const readline = require('readline');

let storageBalance = 1000.0;

function getStorageBalance() {
  return storageBalance;
}

function resetStorageBalance(value = 1000.0) {
  storageBalance = value;
}

function dataProgram(operationType, balance) {
  if (operationType === 'READ') {
    return storageBalance;
  }

  if (operationType === 'WRITE') {
    storageBalance = balance;
    return storageBalance;
  }

  return storageBalance;
}

async function prompt(rl, message) {
  return new Promise((resolve) => {
    rl.question(message, (answer) => resolve(answer));
  });
}

async function operations(operationType, rl, promptFn = prompt) {
  if (operationType === 'TOTAL') {
    const currentBalance = dataProgram('READ');
    console.log(`Current balance: ${currentBalance.toFixed(2)}`);
    return;
  }

  if (operationType === 'CREDIT') {
    const amountInput = await promptFn(rl, 'Enter credit amount: ');
    const amount = Number.parseFloat(amountInput);
    const normalizedAmount = Number.isNaN(amount) ? 0 : amount;
    const currentBalance = dataProgram('READ');
    const newBalance = currentBalance + normalizedAmount;
    dataProgram('WRITE', newBalance);
    console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
    return;
  }

  if (operationType === 'DEBIT') {
    const amountInput = await promptFn(rl, 'Enter debit amount: ');
    const amount = Number.parseFloat(amountInput);
    const normalizedAmount = Number.isNaN(amount) ? 0 : amount;
    const currentBalance = dataProgram('READ');

    if (currentBalance >= normalizedAmount) {
      const newBalance = currentBalance - normalizedAmount;
      dataProgram('WRITE', newBalance);
      console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
    } else {
      console.log('Insufficient funds for this debit.');
    }
  }
}

async function runApp({
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  }),
  promptFn = prompt,
  operationsFn = operations,
} = {}) {

  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choiceInput = await promptFn(rl, 'Enter your choice (1-4): ');
    const choice = Number.parseInt(choiceInput, 10);

    if (choice === 1) {
      await operationsFn('TOTAL', rl, promptFn);
    } else if (choice === 2) {
      await operationsFn('CREDIT', rl, promptFn);
    } else if (choice === 3) {
      await operationsFn('DEBIT', rl, promptFn);
    } else if (choice === 4) {
      continueFlag = false;
    } else {
      console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  runApp().catch((error) => {
    console.error('Unexpected error:', error);
    process.exitCode = 1;
  });
}

module.exports = {
  dataProgram,
  operations,
  prompt,
  runApp,
  getStorageBalance,
  resetStorageBalance,
};
