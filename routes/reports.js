const express = require('express');
const router = express.Router();

// Monthly expense summary
router.get('/expenses', (req, res) => {
  const { month, year } = req.query;
  let query = `
    SELECT 
      type,
      COUNT(*) as count,
      SUM(amount) as total,
      AVG(amount) as average
    FROM expenses
  `;
  let params = [];

  if (month && year) {
    query += " WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    params = [month.padStart(2, '0'), year];
  }

  query += " GROUP BY type ORDER BY total DESC";

  req.db.db.all(query, params, (err, summary) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    // Get total expenses
    let totalQuery = "SELECT SUM(amount) as total FROM expenses";
    if (month && year) {
      totalQuery += " WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    }

    req.db.db.get(totalQuery, params, (err, totalRow) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }

      res.render('reports/expenses', { 
        summary, 
        total: totalRow.total || 0,
        selectedMonth: month,
        selectedYear: year
      });
    });
  });
});

// Monthly investment summary
router.get('/investments', (req, res) => {
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
    
    // Calculate totals for each field
    const totals = {};
    fields.forEach(field => {
      totals[field] = investments.reduce((sum, inv) => sum + (inv[field] || 0), 0);
    });

    const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

    res.render('reports/investments', { 
      investments, 
      fields,
      totals,
      grandTotal,
      selectedMonth: month,
      selectedYear: year
    });
  });
});

// Expenses vs Investments comparison
router.get('/comparison', (req, res) => {
  const { month, year } = req.query;
  let expenseQuery = "SELECT SUM(amount) as total FROM expenses";
  let investmentQuery = "SELECT * FROM investments";
  let params = [];

  if (month && year) {
    expenseQuery += " WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    investmentQuery += " WHERE month LIKE ?";
    params = [month.padStart(2, '0'), year];
  }

  req.db.db.get(expenseQuery, params, (err, expenseTotal) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    const investmentParams = month && year ? [`%${month}%${year}%`] : [];
    req.db.db.all(investmentQuery, investmentParams, (err, investments) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }

      const fields = req.db.getInvestmentFields();
      const investmentTotal = investments.reduce((total, inv) => {
        return total + fields.reduce((sum, field) => sum + (inv[field] || 0), 0);
      }, 0);

      const comparison = {
        expenses: expenseTotal.total || 0,
        investments: investmentTotal,
        difference: investmentTotal - (expenseTotal.total || 0),
        ratio: expenseTotal.total ? (investmentTotal / expenseTotal.total * 100).toFixed(2) : 0
      };

      res.render('reports/comparison', { 
        comparison,
        selectedMonth: month,
        selectedYear: year
      });
    });
  });
});

module.exports = router;