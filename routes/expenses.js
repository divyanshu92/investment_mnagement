const express = require('express');
const router = express.Router();

// List all expenses
router.get('/', (req, res) => {
  const { month, year } = req.query;
  let query = "SELECT * FROM expenses";
  let params = [];

  if (month && year) {
    query += " WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?";
    params = [month.padStart(2, '0'), year];
  }

  query += " ORDER BY date DESC";

  req.db.db.all(query, params, (err, expenses) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    const categories = req.db.getExpenseCategories();
    res.render('expenses/list', { 
      expenses, 
      categories,
      selectedMonth: month,
      selectedYear: year
    });
  });
});

// Show add expense form
router.get('/add', (req, res) => {
  const categories = req.db.getExpenseCategories();
  res.render('expenses/form', { categories });
});

// Add new expense
router.post('/add', (req, res) => {
  const { date, name_of_expense, type, amount } = req.body;
  
  req.db.db.run(
    "INSERT INTO expenses (date, name_of_expense, type, amount) VALUES (?, ?, ?, ?)",
    [date, name_of_expense, type, parseFloat(amount)],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.redirect('/expenses');
    }
  );
});

// Show edit expense form
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  
  req.db.db.get("SELECT * FROM expenses WHERE id = ?", [id], (err, expense) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    
    if (!expense) {
      return res.status(404).send('Expense not found');
    }

    const categories = req.db.getExpenseCategories();
    res.render('expenses/form', { expense, categories, isEdit: true });
  });
});

// Update expense
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { date, name_of_expense, type, amount } = req.body;
  
  req.db.db.run(
    "UPDATE expenses SET date = ?, name_of_expense = ?, type = ?, amount = ? WHERE id = ?",
    [date, name_of_expense, type, parseFloat(amount), id],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.redirect('/expenses');
    }
  );
});

// Delete expense
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  
  req.db.db.run("DELETE FROM expenses WHERE id = ?", [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.redirect('/expenses');
  });
});

module.exports = router;