const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('./database/db');
const expenseRoutes = require('./routes/expenses');
const investmentRoutes = require('./routes/investments');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database();

// Handlebars setup
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    formatCurrency: (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    },
    formatDate: (date) => {
      return new Date(date).toLocaleDateString('en-IN');
    },
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Make database available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('dashboard');
});

app.use('/expenses', expenseRoutes);
app.use('/investments', investmentRoutes);
app.use('/reports', reportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});