const {
  dataProgram,
  operations,
  runApp,
  getStorageBalance,
  resetStorageBalance,
} = require('../index');

function createMockRl(answers = []) {
  let index = 0;
  return {
    question: (message, callback) => {
      const answer = answers[index++] ?? '';
      callback(answer);
    },
    close: jest.fn(),
  };
}

beforeEach(() => {
  resetStorageBalance();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
});

test('TC-001 View balance (initial value)', async () => {
  const rl = createMockRl();
  await operations('TOTAL', rl);
  expect(console.log).toHaveBeenCalledWith('Current balance: 1000.00');
});

test('TC-002 Credit succeeds (valid amount)', async () => {
  const rl = createMockRl(['100.00']);
  await operations('CREDIT', rl);
  expect(getStorageBalance()).toBeCloseTo(1100.0, 2);
  expect(console.log).toHaveBeenCalledWith('Amount credited. New balance: 1100.00');
});

test('TC-003 Debit succeeds (sufficient balance)', async () => {
  const rl = createMockRl(['200.00']);
  await operations('DEBIT', rl);
  expect(getStorageBalance()).toBeCloseTo(800.0, 2);
  expect(console.log).toHaveBeenCalledWith('Amount debited. New balance: 800.00');
});

test('TC-004 Debit fails (insufficient funds)', async () => {
  const rl = createMockRl(['2000.00']);
  await operations('DEBIT', rl);
  expect(getStorageBalance()).toBeCloseTo(1000.0, 2);
  expect(console.log).toHaveBeenCalledWith('Insufficient funds for this debit.');
});

test('TC-005 Balance reflects credit', async () => {
  const rl = createMockRl(['50.00']);
  await operations('CREDIT', rl);
  expect(getStorageBalance()).toBeCloseTo(1050.0, 2);
});

test('TC-006 Balance reflects debit', async () => {
  const rl = createMockRl(['50.00']);
  await operations('DEBIT', rl);
  expect(getStorageBalance()).toBeCloseTo(950.0, 2);
});

test('TC-007 Multiple operations compute correctly', async () => {
  await operations('CREDIT', createMockRl(['100.00']));
  await operations('DEBIT', createMockRl(['40.00']));
  expect(getStorageBalance()).toBeCloseTo(1060.0, 2);
});

test('TC-008 Invalid menu input is handled', async () => {
  const rl = createMockRl(['9', '4']);
  await runApp({ rl });
  expect(console.log).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
  expect(console.log).toHaveBeenCalledWith('Exiting the program. Goodbye!');
  expect(rl.close).toHaveBeenCalled();
});

test('TC-009 Exit program', async () => {
  const rl = createMockRl(['4']);
  await runApp({ rl });
  expect(console.log).toHaveBeenCalledWith('Exiting the program. Goodbye!');
  expect(rl.close).toHaveBeenCalled();
});

test('TC-010 Balance persists within session', async () => {
  await operations('TOTAL', createMockRl());
  await operations('CREDIT', createMockRl(['25.00']));
  expect(getStorageBalance()).toBeCloseTo(1025.0, 2);
});

test('TC-011 Data layer read path', () => {
  dataProgram('WRITE', 1200.0);
  expect(dataProgram('READ')).toBeCloseTo(1200.0, 2);
});

test('TC-012 Data layer write path', async () => {
  await operations('CREDIT', createMockRl(['10.00']));
  expect(getStorageBalance()).toBeCloseTo(1010.0, 2);
});
