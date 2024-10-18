// test/transaction_with_splits.test.ts
import {Transaction, TransactionSplit} from '../src/Transaction';


describe('Transaction with Splits', () => {

    it('create a transaction with required fields', () => {
        const transaction = new Transaction('CU Savings', '2023-11-09', 'John Doe', 59.75);
        expect(transaction.account).toBe('CU Savings');
        expect(transaction.dateOnly()).toBe('2023-11-09');
        expect(transaction.payee).toBe('John Doe');
        expect(transaction.amount).toBe(59.75);
    });


    it('use parent values for missing fields in transaction split', () => {
        const parentTransaction = new Transaction('CU Savings', '2023-10-09', 'John Doe', 0);
        const childTransaction = new TransactionSplit(
            parentTransaction,
            parentTransaction.account,
            parentTransaction.date,
            'Baby Doe',
            59.75
        );

        expect(parentTransaction.amount).toBe(0);

        expect(childTransaction.account).toBe(parentTransaction.account);
        expect(childTransaction.date).toBe(parentTransaction.date);
        expect(childTransaction.payee).toBe('Baby Doe');
        expect(childTransaction.amount).toBe(59.75);
    });


    it('should handle optional fields correctly', () => {
        const transaction = new Transaction('CU Savings', '2023-10-09', 'Jane Doe', 59.75);
        expect(transaction.account).toBe('CU Savings');
        expect(transaction.date).toBe('2023-10-09');
        expect(transaction.payee).toBe('Jane Doe');
        expect(transaction.amount).toBe(59.75);
    });


    it('throw an error for invalid date', () => {
        expect(() => {
            new Transaction('CU Savings', 'Invalid Date', 'John Doe', 59.75);
        }).toThrow('Invalid date format');
    });
});