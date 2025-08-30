// Dashboard data loading
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/') {
        loadDashboardData();
    }
});

async function loadDashboardData() {
    try {
        // Load recent expenses
        const expensesResponse = await fetch('/api/dashboard/expenses');
        const expensesData = await expensesResponse.json();
        
        // Update dashboard cards
        document.getElementById('totalExpenses').textContent = 
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expensesData.total || 0);
        
        // Load recent expenses list
        const recentExpensesHtml = expensesData.recent.map(expense => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <strong>${expense.name_of_expense}</strong>
                    <br>
                    <small class="text-muted">${new Date(expense.date).toLocaleDateString('en-IN')}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-secondary">${expense.type}</span>
                    <br>
                    <strong class="text-danger">
                        ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expense.amount)}
                    </strong>
                </div>
            </div>
        `).join('');
        
        document.getElementById('recentExpenses').innerHTML = recentExpensesHtml || 
            '<p class="text-muted text-center">No recent expenses</p>';
        
        // Load expense categories
        const categoriesHtml = expensesData.categories.map(category => `
            <div class="d-flex justify-content-between align-items-center py-2">
                <span class="badge bg-secondary">${category.type}</span>
                <strong>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(category.total)}</strong>
            </div>
        `).join('');
        
        document.getElementById('expenseCategories').innerHTML = categoriesHtml || 
            '<p class="text-muted text-center">No expense data</p>';
            
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Form validation and enhancement
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Processing...';
        }
    });
});

// Auto-format currency inputs
document.querySelectorAll('input[type="number"]').forEach(input => {
    if (input.name !== 'month' && input.name !== 'year') {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        });
    }
});

// Enhanced table interactions
document.querySelectorAll('.table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
});

// Auto-set current date for new entries
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    if (!input.value) {
        input.value = new Date().toISOString().split('T')[0];
    }
});

// Auto-set current month for investment forms
const monthInputs = document.querySelectorAll('input[name="month"]');
monthInputs.forEach(input => {
    if (!input.value && input.placeholder) {
        const now = new Date();
        input.value = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
});