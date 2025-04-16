// Global variables
let transactions = [];
let categorySummary = {};
let charts = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default for the date input
    document.getElementById('date').valueAsDate = new Date();
    
    // Navigation
    setupNavigation();
    
    // Load initial data
    fetchTransactions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update last updated time
    document.getElementById('lastUpdated').textContent = new Date().toLocaleDateString();
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.add('hide');
            });
            
            // Show the selected section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.remove('hide');
            
            // Refresh charts if analytics section is shown
            if (sectionId === 'analytics-section') {
                refreshAnalyticsCharts();
            }
            
            // Refresh predictions if predictions section is shown
            if (sectionId === 'predictions-section') {
                refreshPredictions();
            }
        });
    });
    
    // View all transactions button
    document.getElementById('viewAllTransactionsBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('[data-section="transactions"]').click();
    });
    
    // Add first transaction button
    document.getElementById('addFirstTransactionBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('[data-section="add-transaction"]').click();
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add transaction form
    document.getElementById('addTransactionForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        let category = document.getElementById('category').value;
        
        // If category is empty, use AI to categorize
        if (!category) {
            category = predictCategory(description);
        }
        
        addTransaction({
            Amount: amount,
            Description: description,
            Date: date,
            Category: category
        });
    });
    
    // Transaction search
    document.getElementById('transactionSearch').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction => 
            transaction.Description.toLowerCase().includes(searchTerm) ||
            transaction.Category.toLowerCase().includes(searchTerm) ||
            transaction.Date.includes(searchTerm) ||
            transaction.Amount.toString().includes(searchTerm)
        );
        
        renderTransactionsTable(filteredTransactions);
    });
}

// Fetch transactions from the backend
function fetchTransactions() {
    // Show loaders
    document.getElementById('recentTransactionsLoader').classList.remove('hide');
    document.getElementById('transactionsLoader').classList.remove('hide');
    
    // In a real app, this would be an API call
    // For this demo, we'll simulate with a setTimeout
    setTimeout(() => {
        // This would normally be fetched from the backend
        // Extended sample data with more history and categories
        transactions = [
            { Date: '2025-03-17', Description: 'Monthly grocery shopping', Category: 'Groceries', Amount: 450.00 },
    { Date: '2025-03-16', Description: 'Netflix subscription', Category: 'Entertainment', Amount: 19.99 },
    { Date: '2025-03-15', Description: 'Petrol refill', Category: 'Transport', Amount: 80.00 },
    { Date: '2025-03-14', Description: 'Dinner at a restaurant', Category: 'Food', Amount: 60.00 },
    { Date: '2025-03-13', Description: 'Electricity bill', Category: 'Utilities', Amount: 100.00 },
    { Date: '2025-03-12', Description: 'Internet bill', Category: 'Utilities', Amount: 50.00 },
    { Date: '2025-03-11', Description: 'Doctor consultation', Category: 'Health', Amount: 120.00 },
    { Date: '2025-03-10', Description: 'Gym membership renewal', Category: 'Health', Amount: 40.00 },
    { Date: '2025-03-09', Description: 'Tuition fees for kids', Category: 'Education', Amount: 200.00 },
    { Date: '2025-03-08', Description: 'Amazon online shopping', Category: 'Shopping', Amount: 150.00 },
    { Date: '2025-03-07', Description: 'Weekend trip', Category: 'Travel', Amount: 500.00 },

    // February 2025
    { Date: '2025-02-28', Description: 'Monthly house rent', Category: 'Housing', Amount: 1200.00 },
    { Date: '2025-02-27', Description: 'Grocery shopping', Category: 'Groceries', Amount: 400.00 },
    { Date: '2025-02-26', Description: 'Gas bill', Category: 'Utilities', Amount: 90.00 },
    { Date: '2025-02-25', Description: 'Movie tickets', Category: 'Entertainment', Amount: 25.00 },
    { Date: '2025-02-24', Description: 'Dental checkup', Category: 'Health', Amount: 80.00 },
    { Date: '2025-02-23', Description: 'Dinner at a café', Category: 'Food', Amount: 50.00 },
    { Date: '2025-02-22', Description: 'Gym subscription', Category: 'Health', Amount: 35.00 },
    { Date: '2025-02-21', Description: 'Bus pass renewal', Category: 'Transport', Amount: 60.00 },
    { Date: '2025-02-20', Description: 'New books for learning', Category: 'Education', Amount: 100.00 },
    { Date: '2025-02-19', Description: 'Clothing shopping (winter wear)', Category: 'Fashion', Amount: 200.00 },
    { Date: '2025-02-18', Description: 'Lunch with colleagues', Category: 'Food', Amount: 35.00 },
    { Date: '2025-02-17', Description: 'WiFi bill', Category: 'Utilities', Amount: 50.00 },
    { Date: '2025-02-16', Description: 'Vegetables & dairy purchase', Category: 'Groceries', Amount: 90.00 },
    { Date: '2025-02-15', Description: 'Internet bill', Category: 'Utilities', Amount: 50.00 },
    { Date: '2025-02-14', Description: 'Valentine\'s day gift shopping', Category: 'Shopping', Amount: 75.00 },
    { Date: '2025-02-10', Description: 'Weekly groceries', Category: 'Groceries', Amount: 120.00 },
    { Date: '2025-02-07', Description: 'Weekend dinner with family', Category: 'Food', Amount: 100.00 },
    { Date: '2025-02-05', Description: 'Uber rides for work commute', Category: 'Transport', Amount: 60.00 },
    { Date: '2025-02-01', Description: 'Monthly groceries', Category: 'Groceries', Amount: 400.00 },

    // January 2025
    { Date: '2025-01-31', Description: 'House rent payment', Category: 'Housing', Amount: 1200.00 },
    { Date: '2025-01-28', Description: 'Electricity bill', Category: 'Utilities', Amount: 100.00 },
    { Date: '2025-01-25', Description: 'Family weekend getaway', Category: 'Travel', Amount: 800.00 },
    { Date: '2025-01-20', Description: 'Grocery shopping', Category: 'Groceries', Amount: 300.00 },
    { Date: '2025-01-18', Description: 'New winter jacket', Category: 'Fashion', Amount: 120.00 },
    { Date: '2025-01-15', Description: 'Restaurant dinner', Category: 'Food', Amount: 60.00 },
    { Date: '2025-01-10', Description: 'Mobile bill payment', Category: 'Utilities', Amount: 45.00 },
    { Date: '2025-01-08', Description: 'Movie night tickets', Category: 'Entertainment', Amount: 22.00 },
    { Date: '2025-01-05', Description: 'Pharmacy purchase', Category: 'Health', Amount: 50.00 },
    { Date: '2025-01-01', Description: 'New Year celebration dinner', Category: 'Food', Amount: 150.00 }
        ];
        
        // Hide loaders
        document.getElementById('recentTransactionsLoader').classList.add('hide');
        document.getElementById('transactionsLoader').classList.add('hide');
        
        // Show data
        document.getElementById('recentTransactionsList').classList.remove('hide');
        
        // Check if there are transactions
        if (transactions.length === 0) {
            document.getElementById('noTransactions').classList.remove('hide');
            document.getElementById('transactionsTable').classList.add('hide');
        } else {
            document.getElementById('noTransactions').classList.add('hide');
            document.getElementById('transactionsTable').classList.remove('hide');
            
            // Render transactions
            renderTransactionsTable(transactions);
            renderRecentTransactions();
            calculateCategorySummary();
            updateTotalExpensesDisplay();
            
            // Initialize charts
            initializeCharts();
        }
    }, 1000);
}

// Render transactions table
function renderTransactionsTable(data) {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
    
    data.forEach((transaction, index) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${formatDate(transaction.Date)}</td>
            <td>${transaction.Description}</td>
            <td><span class="badge bg-info">${transaction.Category}</span></td>
            <td>₹${transaction.Amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editTransaction(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Render recent transactions
function renderRecentTransactions() {
    const recentList = document.getElementById('recentTransactionsList');
    recentList.innerHTML = '';
    
    // Get only the 5 most recent transactions
    const recentTransactions = [...transactions].sort((a, b) => new Date(b.Date) - new Date(a.Date)).slice(0, 5);
    
    recentTransactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'p-2 border-bottom';
        
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${transaction.Description}</strong>
                    <div class="text-muted small">${formatDate(transaction.Date)} • <span class="badge bg-info">${transaction.Category}</span></div>
                </div>
                <div>
                    <span class="text-danger">₹${transaction.Amount.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        recentList.appendChild(div);
    });
}

// Calculate category summary
function calculateCategorySummary() {
    categorySummary = {};
    let total = 0;
    
    transactions.forEach(transaction => {
        if (!categorySummary[transaction.Category]) {
            categorySummary[transaction.Category] = {
                amount: 0,
                count: 0
            };
        }
        
        categorySummary[transaction.Category].amount += transaction.Amount;
        categorySummary[transaction.Category].count++;
        total += transaction.Amount;
    });
    
    // Calculate percentages
    Object.keys(categorySummary).forEach(category => {
        categorySummary[category].percentage = (categorySummary[category].amount / total) * 100;
    });
    
    // Render category summary table
    renderCategorySummaryTable(total);
}

// Render category summary table
function renderCategorySummaryTable(total) {
    const tbody = document.getElementById('categorySummaryBody');
    tbody.innerHTML = '';
    
    Object.keys(categorySummary).forEach(category => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${category}</td>
            <td>₹${categorySummary[category].amount.toFixed(2)}</td>
            <td>${categorySummary[category].percentage.toFixed(2)}%</td>
            <td>${categorySummary[category].count}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Update total expenses display
function updateTotalExpensesDisplay() {
    const total = transactions.reduce((sum, transaction) => sum + transaction.Amount, 0);
    document.getElementById('totalExpensesDisplay').textContent = `₹${total.toFixed(2)}`;
}

// Initialize charts
function initializeCharts() {
    try {
        // Dashboard overview chart
        initializeOverviewChart();
        
        // Category distribution chart
        initializeCategoryDistributionChart();
        
        // Analytics charts
        initializeAnalyticsCharts();
        
        // Prediction chart
        initializePredictionChart();
    } catch (error) {
        console.error("Error initializing charts:", error);
    }
}

// Initialize overview chart
function initializeOverviewChart() {
    const ctx = document.getElementById('expenseOverviewChart');
    if (!ctx) {
        console.error("Overview chart canvas not found");
        return;
    }
    
    // Group transactions by month
    const monthlyData = {};
    transactions.forEach(transaction => {
        const month = transaction.Date.substring(0, 7); // Get YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        monthlyData[month] += transaction.Amount;
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Create chart data
    const months = sortedMonths.map(month => {
        const date = new Date(month + '-01');
        return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
    });
    
    const amounts = sortedMonths.map(month => monthlyData[month]);
    
    // Create chart
    if (charts.overview) {
        charts.overview.destroy();
    }
    
    charts.overview = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Expenses',
                data: amounts,
                backgroundColor: 'rgba(13, 110, 253, 0.2)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Expense Overview'
                }
            }
        }
    });
}

// Initialize category distribution chart
function initializeCategoryDistributionChart() {
    const ctx = document.getElementById('categoryDistributionChart');
    if (!ctx) {
        console.error("Category distribution chart canvas not found");
        return;
    }
    
    const categories = Object.keys(categorySummary);
    const amounts = categories.map(category => categorySummary[category].amount);
    
    // Generate colors
    const backgroundColors = [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 223, 131, 0.7)',
        'rgba(234, 86, 255, 0.7)',
        'rgba(120, 120, 255, 0.7)',
        'rgba(255, 120, 120, 0.7)'
    ];
    
    if (charts.categoryDistribution) {
        charts.categoryDistribution.destroy();
    }
    
    charts.categoryDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors.slice(0, categories.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = categorySummary[label].percentage.toFixed(1);
                            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize analytics charts
function initializeAnalyticsCharts() {
    try {
        // Initialize monthly expense by category chart
        initializeMonthlyExpenseByCategoryChart();
        
        // Initialize expense trends chart
        initializeExpenseTrendsChart();
        
        // Initialize week day analysis chart
        initializeWeekDayAnalysisChart();
    } catch (error) {
        console.error("Error initializing analytics charts:", error);
    }
}

// Initialize monthly expense by category chart
function initializeMonthlyExpenseByCategoryChart() {
    const ctx = document.getElementById('monthlyExpenseByCategoryChart');
    if (!ctx) {
        console.error("Monthly expense by category chart canvas not found");
        return;
    }
    
    // Group transactions by month and category
    const monthlyData = {};
    const categories = new Set();
    
    transactions.forEach(transaction => {
        const month = transaction.Date.substring(0, 7); // Get YYYY-MM
        categories.add(transaction.Category);
        
        if (!monthlyData[month]) {
            monthlyData[month] = {};
        }
        
        if (!monthlyData[month][transaction.Category]) {
            monthlyData[month][transaction.Category] = 0;
        }
        
        monthlyData[month][transaction.Category] += transaction.Amount;
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyData).sort();
    const categoryArray = Array.from(categories);
    
    // Create dataset for each category
    const datasets = categoryArray.map((category, index) => {
        // Generate colors
        const colors = [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(199, 199, 199, 0.7)',
            'rgba(83, 223, 131, 0.7)',
            'rgba(234, 86, 255, 0.7)',
            'rgba(120, 120, 255, 0.7)',
            'rgba(255, 120, 120, 0.7)'
        ];
        
        return {
            label: category,
            data: sortedMonths.map(month => monthlyData[month][category] || 0),
            backgroundColor: colors[index % colors.length]
        };
    });
    
    // Format months for display
    const months = sortedMonths.map(month => {
        const date = new Date(month + '-01');
        return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
    });
    
    // Create chart
    if (charts.monthlyExpenseByCategory) {
        charts.monthlyExpenseByCategory.destroy();
    }
    
    charts.monthlyExpenseByCategory = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Expenses by Category'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ₹${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize expense trends chart
function initializeExpenseTrendsChart() {
    const ctx = document.getElementById('expenseTrendsChart');
    if (!ctx) {
        console.error("Expense trends chart canvas not found");
        return;
    }
    
    // Get top 3 categories by total amount
    const topCategories = Object.keys(categorySummary)
        .sort((a, b) => categorySummary[b].amount - categorySummary[a].amount)
        .slice(0, 3);
    
    // Group transactions by month and category
    const monthlyData = {};
    
    transactions.forEach(transaction => {
        if (!topCategories.includes(transaction.Category)) return;
        
        const month = transaction.Date.substring(0, 7); // Get YYYY-MM
        
        if (!monthlyData[month]) {
            monthlyData[month] = {};
        }
        
        if (!monthlyData[month][transaction.Category]) {
            monthlyData[month][transaction.Category] = 0;
        }
        
        monthlyData[month][transaction.Category] += transaction.Amount;
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Format months for display
    const months = sortedMonths.map(month => {
        const date = new Date(month + '-01');
        return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
    });
    
    // Create datasets for each category
    const datasets = topCategories.map((category, index) => {
        // Generate colors
        const colors = [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
        ];
        
        return {
            label: category,
            data: sortedMonths.map(month => monthlyData[month][category] || 0),
            borderColor: colors[index % colors.length],
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4
        };
    });
    
    // Create chart
    if (charts.expenseTrends) {
        charts.expenseTrends.destroy();
    }
    
    charts.expenseTrends = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Expense Trends for Top Categories'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ₹${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize week day analysis chart
function initializeWeekDayAnalysisChart() {
    const ctx = document.getElementById('weekDayAnalysisChart');
    if (!ctx) {
        console.error("Week day analysis chart canvas not found");
        return;
    }
    
    // Group transactions by day of week
    const dayData = {
        'Sunday': 0,
        'Monday': 0,
        'Tuesday': 0,
        'Wednesday': 0,
        'Thursday': 0,
        'Friday': 0,
        'Saturday': 0
    };
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.Date);
        const day = date.toLocaleString('en-US', { weekday: 'long' });
        dayData[day] += transaction.Amount;
    });
    
    // Create chart
    if (charts.weekDayAnalysis) {
        charts.weekDayAnalysis.destroy();
    }
    
    charts.weekDayAnalysis = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dayData),
            datasets: [{
                label: 'Expenses by Day of Week',
                data: Object.values(dayData),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Spending Pattern by Day of Week'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw || 0;
                            return `₹${value.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize prediction chart
function initializePredictionChart() {
    const ctx = document.getElementById('predictedExpensesChart');
    if (!ctx) {
        console.error("Predicted expenses chart canvas not found");
        return;
    }
    
    // Group transactions by month
const monthlyData = {};
transactions.forEach(transaction => {
    const month = transaction.Date.substring(0, 7); // Get YYYY-MM
    if (!monthlyData[month]) {
        monthlyData[month] = 0;
    }
    monthlyData[month] += transaction.Amount;
});

// Sort months
const sortedMonths = Object.keys(monthlyData).sort();

// Get the last 3 months data
const lastThreeMonths = sortedMonths.slice(-3);
const lastThreeMonthsData = lastThreeMonths.map(month => monthlyData[month]);

// Simple prediction: average of last 3 months + 5% increase
const predictedNextMonth = lastThreeMonthsData.reduce((sum, val) => sum + val, 0) / 3 * 1.05;

// Format months for display
const displayMonths = sortedMonths.map(month => {
    const date = new Date(month + '-01');
    return date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();
});

// Get next month for prediction
const lastMonth = new Date(sortedMonths[sortedMonths.length - 1] + '-01');
const nextMonth = new Date(lastMonth);
nextMonth.setMonth(nextMonth.getMonth() + 1);
const nextMonthLabel = nextMonth.toLocaleString('default', { month: 'short' }) + ' ' + nextMonth.getFullYear();

// Create chart data
const chartLabels = [...displayMonths, nextMonthLabel];
const chartData = [...Object.values(monthlyData), predictedNextMonth];

// Create chart
if (charts.predictedExpenses) {
    charts.predictedExpenses.destroy();
}

charts.predictedExpenses = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chartLabels,
        datasets: [{
            label: 'Actual Expenses',
            data: [...Object.values(monthlyData), 0],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, {
            label: 'Predicted Expenses',
            data: [...Array(chartLabels.length - 1).fill(0), predictedNextMonth],
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '₹' + value;
                    }
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Predicted Expenses for Next Month'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ₹${value.toFixed(2)}`;
                    }
                }
            }
        }
    }
});
}

// Refresh analytics charts
function refreshAnalyticsCharts() {
    initializeAnalyticsCharts();
}

// Refresh predictions
function refreshPredictions() {
    initializePredictionChart();
    
    // Update prediction summary
    updatePredictionSummary();
}

// Update prediction summary
function updatePredictionSummary() {
    // Group transactions by month
    const monthlyData = {};
    transactions.forEach(transaction => {
        const month = transaction.Date.substring(0, 7); // Get YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }
        monthlyData[month] += transaction.Amount;
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyData).sort();
    
    // Get the last 3 months data
    const lastThreeMonths = sortedMonths.slice(-3);
    const lastThreeMonthsData = lastThreeMonths.map(month => monthlyData[month]);
    
    // Simple prediction: average of last 3 months + 5% increase
    const predictedNextMonth = lastThreeMonthsData.reduce((sum, val) => sum + val, 0) / 3 * 1.05;
    
    // Get next month for prediction
    const lastMonth = new Date(sortedMonths[sortedMonths.length - 1] + '-01');
    const nextMonth = new Date(lastMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthLabel = nextMonth.toLocaleString('default', { month: 'long' }) + ' ' + nextMonth.getFullYear();
    
    // Update prediction summary
    document.getElementById('predictedMonthName').textContent = nextMonthLabel;
    document.getElementById('predictedAmount').textContent = `₹${predictedNextMonth.toFixed(2)}`;
    
    // Calculate category-wise predictions
    calculateCategoryPredictions();
}

// Calculate category-wise predictions
function calculateCategoryPredictions() {
    // Group transactions by month and category
    const monthlyCategoryData = {};
    
    transactions.forEach(transaction => {
        const month = transaction.Date.substring(0, 7); // Get YYYY-MM
        const category = transaction.Category;
        
        if (!monthlyCategoryData[month]) {
            monthlyCategoryData[month] = {};
        }
        
        if (!monthlyCategoryData[month][category]) {
            monthlyCategoryData[month][category] = 0;
        }
        
        monthlyCategoryData[month][category] += transaction.Amount;
    });
    
    // Sort months
    const sortedMonths = Object.keys(monthlyCategoryData).sort();
    
    // Get all categories
    const allCategories = new Set();
    Object.values(monthlyCategoryData).forEach(monthData => {
        Object.keys(monthData).forEach(category => allCategories.add(category));
    });
    
    // Get the last 3 months data for each category
    const lastThreeMonths = sortedMonths.slice(-3);
    const predictions = {};
    
    allCategories.forEach(category => {
        const categoryData = lastThreeMonths.map(month => 
            monthlyCategoryData[month][category] || 0
        );
        
        // If we have data for this category
        if (categoryData.some(val => val > 0)) {
            // Simple prediction: average of last 3 months + 5% increase
            const prediction = categoryData.reduce((sum, val) => sum + val, 0) / categoryData.filter(val => val > 0).length * 1.05;
            predictions[category] = prediction;
        }
    });
    
    // Sort predictions by amount (descending)
    const sortedPredictions = Object.entries(predictions)
        .sort((a, b) => b[1] - a[1]);
    
    // Update prediction table
    const tbody = document.getElementById('categoryPredictionsBody');
    tbody.innerHTML = '';
    
    sortedPredictions.forEach(([category, amount]) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${category}</td>
            <td>₹${amount.toFixed(2)}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${(amount / sortedPredictions[0][1] * 100).toFixed(2)}%"></div>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Add transaction
function addTransaction(transaction) {
    transactions.push(transaction);
    
    // Update UI
    renderTransactionsTable(transactions);
    renderRecentTransactions();
    calculateCategorySummary();
    updateTotalExpensesDisplay();
    
    // Refresh charts
    initializeCharts();
    
    // Reset form
    document.getElementById('addTransactionForm').reset();
    document.getElementById('date').valueAsDate = new Date();
    
    // Show success message
    showAlert('Transaction added successfully!', 'success');
}

// Edit transaction
function editTransaction(index) {
    const transaction = transactions[index];
    
    // Populate form with transaction data
    document.getElementById('amount').value = transaction.Amount;
    document.getElementById('description').value = transaction.Description;
    document.getElementById('date').value = transaction.Date;
    document.getElementById('category').value = transaction.Category;
    
    // Show edit mode
    document.getElementById('addTransactionFormTitle').textContent = 'Edit Transaction';
    document.getElementById('addTransactionFormSubmit').textContent = 'Update Transaction';
    
    // Add index to form
    document.getElementById('addTransactionForm').dataset.editIndex = index;
    
    // Navigate to add transaction section
    document.querySelector('[data-section="add-transaction"]').click();
}

// Delete transaction
function deleteTransaction(index) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions.splice(index, 1);
        
        // Update UI
        renderTransactionsTable(transactions);
        renderRecentTransactions();
        calculateCategorySummary();
        updateTotalExpensesDisplay();
        
        // Refresh charts
        initializeCharts();
        
        // Show success message
        showAlert('Transaction deleted successfully!', 'success');
    }
}

// Predict category based on description
function predictCategory(description) {
    // Simple prediction: find similar descriptions and use their categories
    const desc = description.toLowerCase();
    
    // Keywords to categories mapping
    const keywordMap = {
        'raw material': 'Raw Materials',
        'chemicals': 'Raw Materials',
        'supplies': 'Raw Materials',
        'packaging': 'Raw Materials',
        'metals': 'Raw Materials',
        'plastics': 'Raw Materials',
        'paper': 'Raw Materials',
        'fabric': 'Raw Materials',
    
        // Machinery and Equipment
        'machine': 'Machinery',
        'equipment': 'Machinery',
        'forklift': 'Machinery',
        'conveyor': 'Machinery',
        'press': 'Machinery',
        'lathe': 'Machinery',
        'robotics': 'Machinery',
        'assembly': 'Machinery',
        
        // Factory maintenance
        'repair': 'Maintenance',
        'maintenance': 'Maintenance',
        'cleaning': 'Maintenance',
        'servicing': 'Maintenance',
        'inspection': 'Maintenance',
        'lubrication': 'Maintenance',
    
        // Housing and Facility
        'rent': 'Housing',
        'warehouse': 'Housing',
        'storage': 'Housing',
        'lease': 'Housing',
    
        // Utilities
        'electricity': 'Utilities',
        'gas': 'Utilities',
        'water': 'Utilities',
        'power': 'Utilities',
        'energy': 'Utilities',
    
        // Finance and Insurance
        'insurance': 'Finance',
        'loan': 'Finance',
        'tax': 'Finance',
        'audit': 'Finance',
    
        // Workforce and Labor
        'salary': 'Labor',
        'wages': 'Labor',
        'bonus': 'Labor',
        'overtime': 'Labor',
        'worker': 'Labor',
        'staff': 'Labor',
        'hiring': 'Labor',
    
        // Factory Operations & Safety
        'safety': 'Factory Operations',
        'security': 'Factory Operations',
        'fire drill': 'Factory Operations',
        'training': 'Factory Operations',
        'ppe': 'Factory Operations',  // Personal Protective Equipment
        'uniforms': 'Factory Operations',
    
        // Logistics and Transportation
        'grocery': 'Groceries',
        'food': 'Food',
        'restaurant': 'Food',
        'dinner': 'Food',
        'lunch': 'Food',
        'breakfast': 'Food',
    
        'uber': 'Transport',
        'taxi': 'Transport',
        'petrol': 'Transport',
        'gas': 'Utilities',
        
        'netflix': 'Entertainment',
        'movie': 'Entertainment',
        'cinema': 'Entertainment',
        'subscription': 'Entertainment',
    
        'amazon': 'Shopping',
        'flipkart': 'Shopping',
        'clothes': 'Fashion',
        'shirt': 'Fashion',
        'shoes': 'Fashion',
    
        'rent': 'Housing',
        'electricity': 'Utilities',
        'water': 'Utilities',
        'internet': 'Utilities',
        'wifi': 'Utilities',
        'phone': 'Utilities',
        'mobile': 'Utilities',
    
        'doctor': 'Health',
        'medicine': 'Health',
        'insurance': 'Health',
    
        'education': 'Education',
        'course': 'Education',
        'school': 'Education',
        'tuition': 'Education',
    
        'loan': 'Finance',
        'tax': 'Finance',
        'insurance': 'Finance',
    
        'travel': 'Travel',
        'flight': 'Travel',
        'hotel': 'Travel',
        'vacation': 'Travel'
    };
    
    // Check if any keyword matches
    for (const [keyword, category] of Object.entries(keywordMap)) {
        if (desc.includes(keyword)) {
            return category;
        }
    }
    
    // If no match, return 'Miscellaneous'
    return 'Miscellaneous';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.getElementById('alertContainer').appendChild(alertDiv);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 3000);
}

// Export transactions to CSV
function exportTransactionsToCSV() {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const csvContent = [
        headers.join(','),
        ...transactions.map(transaction => [
            transaction.Date,
            `"${transaction.Description.replace(/"/g, '""')}"`,
            transaction.Category,
            transaction.Amount
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import transactions from CSV
function importTransactionsFromCSV(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        const lines = contents.split('\n');
        
        // Skip header
        const header = lines[0].split(',');
        
        // Check if the CSV format is correct
        if (header.length !== 4 ||
            !header.includes('Date') ||
            !header.includes('Description') ||
            !header.includes('Category') ||
            !header.includes('Amount')) {
            showAlert('Invalid CSV format. Please use the correct format.', 'danger');
            return;
        }
        
        // Parse transactions
        const newTransactions = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            // Split by comma, but respect quotes
            const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            
            if (values && values.length === 4) {
                const transaction = {
                    Date: values[0].replace(/"/g, ''),
                    Description: values[1].replace(/"/g, ''),
                    Category: values[2].replace(/"/g, ''),
                    Amount: parseFloat(values[3].replace(/"/g, ''))
                };
                
                newTransactions.push(transaction);
            }
        }
        
        // Add new transactions
        transactions.push(...newTransactions);
        
        // Update UI
        renderTransactionsTable(transactions);
        renderRecentTransactions();
        calculateCategorySummary();
        updateTotalExpensesDisplay();
        
        // Refresh charts
        initializeCharts();
        
        // Show success message
        showAlert(`${newTransactions.length} transactions imported successfully!`, 'success');
    };
    
    reader.readAsText(file);
}
function updatePredictedExpenses() {
    // Using the transactions array directly
    
    // Group transactions by month and calculate monthly totals
    const monthlyTotals = {};
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.Date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlyTotals[monthKey]) {
            monthlyTotals[monthKey] = 0;
        }
        
        // Add transaction amount (convert from paisa to rupees)
        monthlyTotals[monthKey] += parseFloat(transaction.Amount);
    });
    
    // Debug output to console
    console.log("Monthly totals:", monthlyTotals);
    
    // Get the last three months' data
    const monthKeys = Object.keys(monthlyTotals).sort().reverse();
    const lastThreeMonthsData = monthKeys.slice(0, 3).map(key => monthlyTotals[key]);
    
    console.log("Last three months data:", lastThreeMonthsData);
    
    // Calculate the predicted expense for next month (average of last 3 months + 5%)
    let predictedNextMonth = 0;
    if (lastThreeMonthsData.length > 0) {
        const total = lastThreeMonthsData.reduce((sum, val) => sum + val, 0);
        predictedNextMonth = total / lastThreeMonthsData.length * 1.05;
    }
    
    console.log("Predicted next month:", predictedNextMonth);
    
    // Format the predicted amount with the Indian numbering system (lakhs, crores)
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(predictedNextMonth);
    
    // Update the UI with the calculated amount
    const predictedElement = document.getElementById('predictedExpenseAmount');
    if (predictedElement) {
        predictedElement.textContent = formattedAmount;
        console.log("Updated predicted amount element with:", formattedAmount);
    } else {
        console.error("Could not find predictedExpenseAmount element");
    }
    
    // Update the prediction chart if available
    try {
        updatePredictedExpensesChart(monthKeys, monthlyTotals, predictedNextMonth);
    } catch (error) {
        console.error("Error updating prediction chart:", error);
    }
}

// Make sure this function gets called when showing the predictions section
function initializeApp() {
    // Set up navigation
    document.querySelectorAll('#mainNav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            // Update active nav item
            document.querySelectorAll('#mainNav .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected section
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Function to show a section
    function showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.add('hide');
        });
        
        // Show the selected section
        const sectionToShow = document.getElementById(`${sectionId}-section`);
        if (sectionToShow) {
            sectionToShow.classList.remove('hide');
            
            // If showing predictions section, update the predicted expenses
            if (sectionId === 'predictions') {
                console.log("Predictions section shown, calculating expenses...");
                updatePredictedExpenses();
            }
        }
    }
    
    // Show default section on load
    showSection('dashboard');
}

// Call this when your page loads
document.addEventListener('DOMContentLoaded', initializeApp);
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for import/export
    document.getElementById('exportCSVBtn').addEventListener('click', exportTransactionsToCSV);
    
    document.getElementById('importCSVBtn').addEventListener('click', function() {
        document.getElementById('importCSVFile').click();
    });
    
    document.getElementById('importCSVFile').addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            importTransactionsFromCSV(e.target.files[0]);
        }
    });
});