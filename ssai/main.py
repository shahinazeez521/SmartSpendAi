import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator
from datetime import datetime
import os

# File to store transactions
TRANSACTION_FILE = "synthetic_transactions.csv"

# Load existing transactions
if os.path.exists(TRANSACTION_FILE):
    transactions = pd.read_csv(TRANSACTION_FILE)
else:
    print("Transaction dataset not found. Please check the file location.")
    exit()

# Predefined categories
categories = {
    '1': 'Food',
    '2': 'Education',
    '3': 'Fashion',
    '4': 'Groceries',
    '5': 'Utilities',
    '6': 'Entertainment',
    '7':'others'
}

# Save transactions to CSV
def save_transactions():
    transactions.to_csv(TRANSACTION_FILE, index=False)

# Display categories
def display_categories():
    print("Select a category or press Enter to auto-categorize:")
    for key, value in categories.items():
        print(f"{key}. {value}")

# Add transaction with category prediction
def add_transaction():
    amount = float(input("Enter transaction amount: ₹"))
    description = input("Enter transaction description: ").strip()
    date = input("Enter transaction date (YYYY-MM-DD) or press Enter for today: ").strip()
    if not date:
        date = datetime.today().strftime('%Y-%m-%d')

    display_categories()
    category_choice = input("Enter category number (1-7) or press Enter for auto-categorization: ").strip()

    if category_choice in categories:
        category = categories[category_choice]
    else:
        category = logistic_model.predict([description])[0]
        print(f"Predicted Category: {category}")

    global transactions
    transactions = pd.concat([transactions, pd.DataFrame({
        'Amount': [amount],
        'Category': [category],
        'Description': [description],
        'Date': [date]
    })], ignore_index=True)

    save_transactions()
    print(f"✅ Transaction added under category: {category}\n")

# View all transactions
def view_transactions():
    if transactions.empty:
        print("No transactions found!\n")
    else:
        print("\nAll Transactions:")
        print(transactions.to_string(index=False))
        print()

# Visualize categorized expenses
def view_categorized_expenses():
    if transactions.empty:
        print("No transactions to display!\n")
        return

    summary = transactions.groupby('Category')['Amount'].sum()

    print("\nCategorized Expenses Summary:")
    for category, total in summary.items():
        print(f"- {category}: ₹{total}")
    print(f"Total Expenses: ₹{summary.sum()}\n")

    # Pie Chart
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.pie(summary, labels=summary.index, autopct='%1.1f%%', startangle=140)
    plt.title('Expense Distribution (Pie Chart)')

    # Bar Chart
    plt.subplot(1, 2, 2)
    plt.bar(summary.index, summary.values, color='skyblue')
    plt.title('Expenses by Category (Bar Chart)')
    plt.xlabel('Category')
    plt.ylabel('Amount (₹)')
    plt.xticks(rotation=45)

    plt.tight_layout()
    plt.show()

# Logistic Regression Model Training and Evaluation
X = transactions['Description']
y = transactions['Category']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

logistic_model = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('classifier', LogisticRegression())
])
logistic_model.fit(X_train, y_train)

def evaluate_logistic_regression():
    y_pred = logistic_model.predict(X_test)
    print("\n🔍 Logistic Regression Evaluation:")
    print(classification_report(y_test, y_pred))

# LSTM Model for Monthly Expense Prediction
def evaluate_lstm_model():
    # Safely convert 'Date' to datetime, handling mixed formats
    transactions['Date'] = pd.to_datetime(transactions['Date'], errors='coerce')
    transactions.dropna(subset=['Date'], inplace=True)

    monthly_totals = transactions.groupby(transactions['Date'].dt.to_period('M'))['Amount'].sum()

    if len(monthly_totals) < 3:
        print("\n⚠️ Not enough monthly data for LSTM prediction.")
        return

    data = monthly_totals.values.reshape(-1, 1)
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)

    generator = TimeseriesGenerator(scaled_data, scaled_data, length=2, batch_size=1)

    lstm_model = Sequential([
        LSTM(50, activation='relu', input_shape=(2, 1)),
        Dense(1)
    ])
    lstm_model.compile(optimizer='adam', loss='mse')
    lstm_model.fit(generator, epochs=500, verbose=0)

    prediction_input = scaled_data[-2:].reshape((1, 2, 1))
    scaled_prediction = lstm_model.predict(prediction_input, verbose=0)
    predicted_amount = scaler.inverse_transform(scaled_prediction)[0][0]

    mse = mean_squared_error(scaled_data[2:], lstm_model.predict(generator))
    rmse = np.sqrt(mse)

    print(f"\n🔍 LSTM Evaluation:")
    print(f"Mean Squared Error (MSE): {mse:.4f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"⚠️📈 Predicted Total Expense for Next Month: ₹{predicted_amount:.2f}\n")

# Main CLI Menu
def main():
    while True:
        print("🛑SmartSpend AI🛑")
        print("1. Add a new transaction")
        print("2. View all transactions")
        print("3. View categorized expenses with charts")
        print("4. Evaluate Logistic Regression Model")
        print("5. Evaluate and Predict with LSTM Model")
        print("6. Exit")

        choice = input("Enter your choice (1-6): ").strip()

        if choice == '1':
            add_transaction()
        elif choice == '2':
            view_transactions()
        elif choice == '3':
            view_categorized_expenses()
        elif choice == '4':
            evaluate_logistic_regression()
        elif choice == '5':
            evaluate_lstm_model()
        elif choice == '6':
            print("Thank you for using SmartSpend AI!")
            break
        else:
            print("❌ Invalid choice. Please try again.\n")

if __name__ == "__main__":
    main()
