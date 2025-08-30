-- Expense and Investment Management System Database Schema
-- This file contains the complete database structure for the application

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    name_of_expense TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN (
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
    )),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    month TEXT NOT NULL,
    SBI_In_Account DECIMAL(10,2) DEFAULT 0 CHECK (SBI_In_Account >= 0),
    SBI_FD DECIMAL(10,2) DEFAULT 0 CHECK (SBI_FD >= 0),
    SBI_RD DECIMAL(10,2) DEFAULT 0 CHECK (SBI_RD >= 0),
    PPF DECIMAL(10,2) DEFAULT 0 CHECK (PPF >= 0),
    Axis_In_Acnt DECIMAL(10,2) DEFAULT 0 CHECK (Axis_In_Acnt >= 0),
    Axis_FD DECIMAL(10,2) DEFAULT 0 CHECK (Axis_FD >= 0),
    Axis_RD DECIMAL(10,2) DEFAULT 0 CHECK (Axis_RD >= 0),
    Indus_Acnt DECIMAL(10,2) DEFAULT 0 CHECK (Indus_Acnt >= 0),
    Indus_FD DECIMAL(10,2) DEFAULT 0 CHECK (Indus_FD >= 0),
    Indus_Land_RD DECIMAL(10,2) DEFAULT 0 CHECK (Indus_Land_RD >= 0),
    Paytm DECIMAL(10,2) DEFAULT 0 CHECK (Paytm >= 0),
    Groww DECIMAL(10,2) DEFAULT 0 CHECK (Groww >= 0),
    NPS DECIMAL(10,2) DEFAULT 0 CHECK (NPS >= 0),
    Yes_Bank DECIMAL(10,2) DEFAULT 0 CHECK (Yes_Bank >= 0),
    Amazon DECIMAL(10,2) DEFAULT 0 CHECK (Amazon >= 0),
    PLI DECIMAL(10,2) DEFAULT 0 CHECK (PLI >= 0),
    Cash DECIMAL(10,2) DEFAULT 0 CHECK (Cash >= 0),
    Archana_Acc DECIMAL(10,2) DEFAULT 0 CHECK (Archana_Acc >= 0),
    Archana_Groww DECIMAL(10,2) DEFAULT 0 CHECK (Archana_Groww >= 0),
    Archana_FD DECIMAL(10,2) DEFAULT 0 CHECK (Archana_FD >= 0),
    Archana_RD DECIMAL(10,2) DEFAULT 0 CHECK (Archana_RD >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
CREATE INDEX IF NOT EXISTS idx_investments_date ON investments(date);
CREATE INDEX IF NOT EXISTS idx_investments_month ON investments(month);

-- Insert sample data for demonstration
INSERT OR IGNORE INTO expenses (id, date, name_of_expense, type, amount) VALUES
(1, '2024-01-15', 'Weekly Grocery Shopping', 'vegetables', 2500.00),
(2, '2024-01-20', 'Monthly Electricity Bill', 'electricity bill', 3200.00),
(3, '2024-01-25', 'Car Fuel Fill-up', 'car petrol', 4000.00),
(4, '2024-01-30', 'Monthly House Rent', 'rent', 25000.00),
(5, '2024-01-10', 'Anshu School Fees', 'anshu fees', 15000.00),
(6, '2024-01-12', 'House Cleaning Service', 'kaam waale', 800.00),
(7, '2024-01-18', 'Water Bill Payment', 'water bill', 450.00),
(8, '2024-01-22', 'Daily Milk Supply', 'milk', 1200.00);

INSERT OR IGNORE INTO investments (id, date, month, SBI_In_Account, SBI_FD, PPF, Groww, Archana_Groww, Cash) VALUES
(1, '2024-01-31', 'January 2024', 50000.00, 100000.00, 15000.00, 25000.00, 20000.00, 10000.00),
(2, '2024-02-29', 'February 2024', 55000.00, 100000.00, 15000.00, 30000.00, 22000.00, 8000.00);

-- Views for common queries
CREATE VIEW IF NOT EXISTS monthly_expense_summary AS
SELECT 
    strftime('%Y-%m', date) as month_year,
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM expenses 
GROUP BY strftime('%Y-%m', date), type
ORDER BY month_year DESC, total_amount DESC;

CREATE VIEW IF NOT EXISTS monthly_investment_summary AS
SELECT 
    month,
    date,
    (SBI_In_Account + SBI_FD + SBI_RD + PPF + Axis_In_Acnt + Axis_FD + Axis_RD + 
     Indus_Acnt + Indus_FD + Indus_Land_RD + Paytm + Groww + NPS + Yes_Bank + 
     Amazon + PLI + Cash + Archana_Acc + Archana_Groww + Archana_FD + Archana_RD) as total_investment
FROM investments
ORDER BY date DESC;