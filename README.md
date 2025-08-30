# Expense & Investment Manager

A comprehensive web application for managing monthly expenses and investments with detailed reporting and analytics capabilities.

## 🚀 Features

### 💰 Expense Management
- Add, edit, and delete expenses
- Categorize expenses with predefined categories
- Monthly and yearly expense filtering
- Real-time expense tracking

### 📈 Investment Tracking
- Track multiple investment accounts and instruments
- Support for 20+ investment categories including:
  - Bank accounts (SBI, Axis, IndusInd, Yes Bank)
  - Fixed Deposits and Recurring Deposits
  - Investment platforms (Groww, Paytm)
  - Government schemes (PPF, NPS)
  - Insurance (PLI)
  - Cash and other assets
- CSV bulk upload functionality
- Monthly investment summaries

### 📊 Comprehensive Reports
- **Expense Summary**: Category-wise expense breakdown
- **Investment Summary**: Portfolio overview with totals
- **Comparison Reports**: Expenses vs Investments analysis
- Monthly and yearly filtering for all reports

### 🎨 Modern UI/UX
- Responsive Bootstrap 5 design
- Interactive dashboard with real-time data
- Modern card-based layout
- Mobile-friendly interface
- Font Awesome icons integration

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Template Engine**: Handlebars
- **Frontend**: Bootstrap 5, Font Awesome, Vanilla JavaScript
- **File Upload**: Multer
- **CSV Processing**: csv-parser

## 📁 Project Structure

```
project/
├── database/
│   └── db.js                 # Database configuration and models
├── public/
│   ├── css/
│   │   └── style.css         # Custom styles
│   ├── js/
│   │   └── app.js           # Frontend JavaScript
│   └── sample-investment-template.csv
├── routes/
│   ├── expenses.js          # Expense CRUD operations
│   ├── investments.js       # Investment CRUD operations
│   └── reports.js           # Report generation
├── uploads/                 # CSV upload directory
├── views/
│   ├── expenses/
│   │   ├── form.handlebars  # Add/Edit expense form
│   │   └── list.handlebars  # Expense listing
│   ├── investments/
│   │   ├── form.handlebars  # Add/Edit investment form
│   │   ├── list.handlebars  # Investment listing
│   │   └── upload.handlebars # CSV upload form
│   ├── layouts/
│   │   └── main.handlebars  # Main layout template
│   ├── reports/
│   │   ├── comparison.handlebars
│   │   ├── expenses.handlebars
│   │   └── investments.handlebars
│   └── dashboard.handlebars # Main dashboard
├── .gitignore
├── package.json
└── server.js               # Main application server
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📊 Database Schema

### Expenses Table
- `id`: Primary key
- `date`: Expense date
- `name_of_expense`: Description
- `type`: Category/type of expense
- `amount`: Expense amount
- `created_at`: Timestamp

### Investments Table
- `id`: Primary key
- `date`: Investment date
- `month`: Month/year identifier
- Multiple investment fields for different accounts and instruments
- `created_at`: Timestamp

## 🎯 Usage Guide

### Adding Expenses
1. Navigate to **Expenses > Add New**
2. Fill in the expense details
3. Select from predefined categories
4. Submit the form

### Managing Investments
1. **Manual Entry**: Use **Investments > Add New**
2. **Bulk Upload**: Use **Investments > Upload CSV**
   - Download the sample template
   - Fill in your investment data
   - Upload the CSV file

### Viewing Reports
1. **Expense Reports**: Category-wise breakdown and totals
2. **Investment Reports**: Portfolio summary with field-wise totals
3. **Comparison Reports**: Side-by-side analysis of expenses vs investments

### Dashboard Features
- Real-time summary cards
- Recent expenses list
- Quick action buttons
- Expense category overview

## 📋 Expense Categories

The application supports the following predefined expense categories:
- Personal expenses (anshu fees, kaam waale)
- Utilities (electricity bill, water bill, broadband)
- Transportation (car petrol, bike petrol, car washing)
- Household (vegetables, milk, rashan, cylinder bill)
- Financial (rent, loans, credit card bills, insurance)
- Subscriptions (youtube subscription)
- And more...

## 💼 Investment Categories

Track investments across 20+ categories:
- **Banking**: SBI, Axis, IndusInd, Yes Bank accounts
- **Fixed Deposits**: Multiple bank FDs
- **Recurring Deposits**: Various RD accounts
- **Government Schemes**: PPF, NPS
- **Investment Platforms**: Groww, Paytm
- **Insurance**: PLI
- **Others**: Cash, Amazon Pay, etc.

## 🔧 Configuration

### Environment Variables
Create a `.env` file for environment-specific configurations:
```env
PORT=3000
NODE_ENV=development
```

### Database
The application uses SQLite3 with automatic database initialization. Sample data is inserted on first run.

## 🚀 Development

### Available Scripts
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

### Adding New Features
1. **Routes**: Add new routes in the `routes/` directory
2. **Views**: Create Handlebars templates in `views/`
3. **Database**: Modify `database/db.js` for schema changes
4. **Styles**: Update `public/css/style.css`

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention through parameterized queries
- File upload restrictions
- CSRF protection ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT in server.js or set PORT environment variable

2. **Database errors**
   - Ensure write permissions in the database directory
   - Check SQLite3 installation

3. **CSV upload issues**
   - Verify CSV format matches the sample template
   - Check file permissions in uploads directory

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review the code documentation
- Create an issue in the project repository

---

**Built with ❤️ using Node.js and modern web technologies**