const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// List all investments
router.get('/', (req, res) => {
  const { month, year } = req.query;
  let query = "SELECT * FROM investments";
  let params = [];

  if (month && year) {
    query += " WHERE month LIKE ?";
    params = [`%${month}%${year}%`];
  }

  query += " ORDER BY date DESC";

  req.db.db.all(query, params, (err, investments) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    const fields = req.db.getInvestmentFields();
    res.render('investments/list', { 
      investments, 
      fields,
      selectedMonth: month,
      selectedYear: year
    });
  });
});

// Show add investment form
router.get('/add', (req, res) => {
  const fields = req.db.getInvestmentFields();
  res.render('investments/form', { fields });
});

// Add new investment
router.post('/add', (req, res) => {
  const { date, month, ...investmentData } = req.body;
  const fields = req.db.getInvestmentFields();
  
  const columns = ['date', 'month', ...fields];
  const values = [date, month, ...fields.map(field => parseFloat(investmentData[field]) || 0)];
  const placeholders = columns.map(() => '?').join(', ');
  
  req.db.db.run(
    `INSERT INTO investments (${columns.join(', ')}) VALUES (${placeholders})`,
    values,
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.redirect('/investments');
    }
  );
});

// Show edit investment form
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  
  req.db.db.get("SELECT * FROM investments WHERE id = ?", [id], (err, investment) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    
    if (!investment) {
      return res.status(404).send('Investment not found');
    }

    const fields = req.db.getInvestmentFields();
    res.render('investments/form', { investment, fields, isEdit: true });
  });
});

// Update investment
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { date, month, ...investmentData } = req.body;
  const fields = req.db.getInvestmentFields();
  
  const setClause = ['date = ?', 'month = ?', ...fields.map(field => `${field} = ?`)].join(', ');
  const values = [date, month, ...fields.map(field => parseFloat(investmentData[field]) || 0), id];
  
  req.db.db.run(
    `UPDATE investments SET ${setClause} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.redirect('/investments');
    }
  );
});

// Delete investment
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  
  req.db.db.run("DELETE FROM investments WHERE id = ?", [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.redirect('/investments');
  });
});

// Show CSV upload form
router.get('/upload', (req, res) => {
  res.render('investments/upload');
});

// Handle CSV upload
router.post('/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const results = [];
  const fields = req.db.getInvestmentFields();

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Process each row
      const stmt = req.db.db.prepare(`
        INSERT INTO investments (date, month, ${fields.join(', ')}) 
        VALUES (?, ?, ${fields.map(() => '?').join(', ')})
      `);

      results.forEach(row => {
        const values = [
          row.date || new Date().toISOString().split('T')[0],
          row.month || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          ...fields.map(field => parseFloat(row[field]) || 0)
        ];
        stmt.run(values);
      });

      stmt.finalize();

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      
      res.redirect('/investments?uploaded=true');
    });
});

module.exports = router;