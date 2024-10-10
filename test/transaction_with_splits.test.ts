// test/transaction_with_splits.test.ts
import { Transaction } from '../src/Transaction';

describe('Transaction with Splits', () => {
  it('should create a transaction with required fields', () => {
    const transaction = new Transaction('CU Savings', '2023-11-09', 'John Doe', 59.75);
    expect(transaction.account).toBe('CU Savings');
    expect(transaction.dateOnly()).toBe('2023-11-09');
    expect(transaction.payee).toBe('John Doe');
    expect(transaction.amount).toBe(59.75);
  });

  it('should handle optional fields correctly', () => {
    const transaction = new Transaction('CU Savings', '2023-10-09', 'Jane Doe', 59.75);
    expect(transaction.account).toBe('CU Savings');
    expect(transaction.date).toBe('2023-10-09');
    expect(transaction.payee).toBe('Jane Doe');
    expect(transaction.amount).toBe(59.75);
  });

  it('should throw an error for invalid date', () => {
    expect(() => {
      new Transaction('CU Savings', '2023-10-09', 'John Doe', 59.75);
    }).toThrow('Invalid date format');
  });

  it('should distribute missing fields from parent to split transactions', () => {
    const parentTransaction = new Transaction('CU Savings', '2023-10-09', 'John Doe', 59.75);
    const childTransaction = new Transaction('', '', 'John Doe', 59.75);

    parentTransaction.addSplit(childTransaction);

    expect(childTransaction.account).toBe(parentTransaction.account);
    expect(childTransaction.date).toBe(parentTransaction.date);
    expect(childTransaction.payee).toBe(parentTransaction.payee);
    expect(childTransaction.amount).toBe(parentTransaction.amount);
  });
});