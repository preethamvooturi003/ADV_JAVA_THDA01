
const users = [
  { accountNumber: '1234567890', pin: '1234', balance: 5000, transactions: [
    { type: 'Withdrawal', amount: 500, date: new Date(2024, 2, 15) },
    { type: 'Deposit', amount: 1000, date: new Date(2024, 2, 10) },
    { type: 'Withdrawal', amount: 300, date: new Date(2024, 2, 5) },
    { type: 'Transfer', amount: 200, date: new Date(2024, 1, 28) },
    { type: 'Withdrawal', amount: 100, date: new Date(2024, 1, 20) }
  ]},
  { accountNumber: '0987654321', pin: '5678', balance: 10000, transactions: [] }
];

let currentUser = null;

// Login functionality
const loginBtn = document.getElementById('loginBtn');
const accountNumber = document.getElementById('accountNumber');
const pin = document.getElementById('pin');
const loginContainer = document.querySelector('.login-container');
const transactionContainer = document.querySelector('.transaction-container');
const loginError = document.getElementById('loginError');

loginBtn.addEventListener('click', () => {
  const enteredAccountNumber = accountNumber.value;
  const enteredPin = pin.value;

  const user = users.find(u => u.accountNumber === enteredAccountNumber && u.pin === enteredPin);

  if (user) {
    currentUser = user;
    loginContainer.style.display = 'none';
    transactionContainer.style.display = 'block';
    loginError.textContent = '';
  } else {
    loginError.textContent = 'Invalid account number or PIN';
  }
});




// Transaction functionality
const transactionType = document.getElementById('transactionType');
const transactionResult = document.getElementById('transactionResult');
const withdrawInput = document.getElementById('withdrawInput');
const withdrawAmount = document.getElementById('withdrawAmount');
const withdrawBtn = document.getElementById('withdrawBtn');
const depositInput = document.getElementById('depositInput');
const depositAmount = document.getElementById('depositAmount');
const depositBtn = document.getElementById('depositBtn');
const changePinInput = document.getElementById('changePinInput');
const newPin = document.getElementById('newPin');
const changePinBtn = document.getElementById('changePinBtn');

transactionType.addEventListener('change', () => {
  transactionResult.textContent = '';
  withdrawInput.style.display = 'none';
  depositInput.style.display = 'none';
  changePinInput.style.display = 'none';
  const selectedTransaction = transactionType.value;

  switch (selectedTransaction) {
    case 'withdraw':
      withdrawInput.style.display = 'block';
      break;

    case 'deposit':
      depositInput.style.display = 'block';
      break;
    case 'balance':
      handleCheckBalance();
      break;
    case 'changePin':
      changePinInput.style.display = 'block';
      break;
    case 'statement':
      handleGenerateStatement();
      break;
    default:
      break;
  }
});

withdrawBtn.addEventListener('click', handleWithdraw);
changePinBtn.addEventListener('click', handleChangePIN);
depositBtn.addEventListener('click', handleDeposit);

function handleWithdraw() {
  const amount = parseFloat(withdrawAmount.value);
  if (amount <= currentUser.balance) {
    currentUser.balance -= amount;
    currentUser.transactions.push({ type: 'Withdrawal', amount, date: new Date() });
    transactionResult.textContent = `Withdrawal successful. Current balance: ${currentUser.balance}`;
    withdrawAmount.value = '';
  } else {
    transactionResult.textContent = 'Insufficient balance';
  }
}
function handleDeposit() {
  const amount = parseFloat(depositAmount.value);
  if (amount > 0) {
    currentUser.balance += amount;
    currentUser.transactions.push({ type: 'Deposit', amount, date: new Date() });
    transactionResult.textContent = `Deposit successful. Current balance: ${currentUser.balance}`;
    depositAmount.value = '';
    saveUserData();
  } else {
    transactionResult.textContent = 'Invalid deposit amount';
  }
}

function handleCheckBalance() {
  transactionResult.textContent = `Current balance: ${currentUser.balance}`;
}

function handleChangePIN() {
  const newPinValue = newPin.value;
  currentUser.pin = newPinValue;
  transactionResult.textContent = 'PIN changed successfully';
  newPin.value = '';
}

function handleGenerateStatement() {
  const recentTransactions = currentUser.transactions.slice(-5).reverse();
  let statementText = `Account Statement for ${currentUser.accountNumber}:\n\n`;
  recentTransactions.forEach(transaction => {
    const date = transaction.date.toLocaleDateString();
    statementText += `${transaction.type}: ${transaction.amount} (${date})\n`;
  });
  statementText += `\nCurrent Balance: ${currentUser.balance}`;
  transactionResult.textContent = statementText;
}