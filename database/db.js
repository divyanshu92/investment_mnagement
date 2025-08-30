const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'expense_manager.db'));
    this.init();
  }

  init() {
    // Create expenses table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        name_of_expense TEXT NOT NULL,
        type TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create investments table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS investments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        month TEXT NOT NULL,
        SBI_In_Account DECIMAL(10,2) DEFAULT 0,
        SBI_FD DECIMAL(10,2) DEFAULT 0,
        SBI_RD DECIMAL(10,2) DEFAULT 0,
        PPF DECIMAL(10,2) DEFAULT 0,
        Axis_In_Acnt DECIMAL(10,2) DEFAULT 0,
        Axis_FD DECIMAL(10,2) DEFAULT 0,
        Axis_RD DECIMAL(10,2) DEFAULT 0,
        Indus_Acnt DECIMAL(10,2) DEFAULT 0,
        Indus_FD DECIMAL(10,2) DEFAULT 0,
        Indus_Land_RD DECIMAL(10,2) DEFAULT 0,
        Paytm DECIMAL(10,2) DEFAULT 0,
        Groww DECIMAL(10,2) DEFAULT 0,
        NPS DECIMAL(10,2) DEFAULT 0,
        Yes_Bank DECIMAL(10,2) DEFAULT 0,
        Amazon DECIMAL(10,2) DEFAULT 0,
        PLI DECIMAL(10,2) DEFAULT 0,
        Cash DECIMAL(10,2) DEFAULT 0,
        Archana_Acc DECIMAL(10,2) DEFAULT 0,
        Archana_Groww DECIMAL(10,2) DEFAULT 0,
        Archana_FD DECIMAL(10,2) DEFAULT 0,
        Archana_RD DECIMAL(10,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data
    this.insertSampleData();
  }

  insertSampleData() {
    // Check if sample data already exists
    this.db.get("SELECT COUNT(*) as count FROM expenses", (err, row) => {
      if (err) return;
      
      if (row.count === 0) {
        // Insert sample expenses
        const sampleExpenses = [
          ['2024-01-15', 'Grocery Shopping', 'vegetables', 2500],
          ['2024-01-20', 'Electricity Bill', 'electricity bill', 3200],
          ['2024-01-25', 'Car Fuel', 'car petrol', 4000],
          ['2024-01-30', 'Monthly Rent', 'rent', 25000]
        ];

        const stmt = this.db.prepare("INSERT INTO expenses (date, name_of_expense, type, amount) VALUES (?, ?, ?, ?)");
        sampleExpenses.forEach(expense => {
          stmt.run(expense);
        });
        stmt.finalize();
      }
    });

    this.db.get("SELECT COUNT(*) as count FROM investments", (err, row) => {
      if (err) return;
      
      if (row.count === 0) {
        // Insert sample investment
        this.db.run(`
          INSERT INTO investments (date, month, SBI_In_Account, SBI_FD, PPF, Groww, Cash) 
          VALUES ('2024-01-31', 'January 2024', 50000, 100000, 15000, 25000, 10000)
        `);
      }
    });
  }

  getExpenseCategories() {
    return [
      'anshu fees',
      'kaam waale',
      'car & bike washing',
      'vegetables',
      'electricity bill',
      'water bill',
      'car petrol',
      'bike petrol',
      'milk',
      'rent',
      'cylinder bill',
      'broadband',
      'rashan',
      'youtube subscription',
      'monthly car loan',
      'credit card bill',
      'other loans',
      'tax saving mutual funds',
      'archana groww',
      'term insurance',
      'fd',
      'salary',
      'investment',
      'loan',
      'expenses'
    ];
  }

  getInvestmentFields() {
    return [
      'SBI_In_Account',
      'SBI_FD',
      'SBI_RD',
      'PPF',
      'Axis_In_Acnt',
      'Axis_FD',
      'Axis_RD',
      'Indus_Acnt',
      'Indus_FD',
      'Indus_Land_RD',
      'Paytm',
      'Groww',
      'NPS',
      'Yes_Bank',
      'Amazon',
      'PLI',
      'Cash',
      'Archana_Acc',
      'Archana_Groww',
      'Archana_FD',
      'Archana_RD'
    ];
  }
}

module.exports = Database;