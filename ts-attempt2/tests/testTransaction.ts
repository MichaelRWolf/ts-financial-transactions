// tests/testTransaction.ts

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Transaction, TransactionWithSplits, TransactionSplit } from '../src/transaction.js';

describe('Transaction', () => {
  it('should have the correct attributes', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '100.00', 'groceries');
    expect(transaction.institution).to.equal('Bank');
    expect(transaction.date).to.equal('2024-10-11');
    expect(transaction.payee).to.equal('Payee A');
    expect(transaction.amount).to.equal('100.00');
    expect(transaction.category).to.equal('groceries');
  });

  it('should create a Transaction using the factory method', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '100.00', 'groceries');
    expect(transaction).to.be.instanceOf(Transaction);
  });

  it('should create a TransactionWithSplits using the factory method when category is SPLIT', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '0.00', 'SPLIT');
    expect(transaction).to.be.instanceOf(TransactionWithSplits);
  });

  it('should have positional arguments correctly set', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '100.00', 'rent');
    expect(transaction.institution).to.equal('Bank');
    expect(transaction.date).to.equal('2024-10-11');
    expect(transaction.payee).to.equal('Payee A');
    expect(transaction.amount).to.equal('100.00');
    expect(transaction.category).to.equal('rent');
  });
  it('should throw an error for invalid date', () => {
    expect(() => Transaction.createTransaction('Bank', 'invalid-date', 'Payee A', '100.00', 'rent')).to.throw(Error, 'Invalid date format');
  });

  it('should throw an error for invalid amount', () => {
    expect(() => Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', 'invalid-amount', 'rent')).to.throw(Error, 'Invalid amount format');
  });

  it('should convert to CSV with all headers', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '100.00', 'rent');
    const csv = transaction.toCsv(['institution', 'date', 'payee', 'amount', 'category'], [transaction.institution, transaction.date, transaction.payee, transaction.amount, transaction.category]);
    expect(csv).to.equal('Bank,2024-10-11,Payee A,100.00,rent');
  });

  it('should convert to CSV excluding institution', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '100.00', 'rent');
    const csv = transaction.toCsv(['date', 'payee', 'amount', 'category'], [transaction.date, transaction.payee, transaction.amount, transaction.category]);
    expect(csv).to.equal('2024-10-11,Payee A,100.00,rent');
  });

  it('should convert to CSV with specific headers', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '100.00', 'rent');
    const csv = transaction.toCsv(['payee', 'amount', 'date'], [transaction.payee, transaction.amount, transaction.date]);
    expect(csv).to.equal('Payee A,100.00,2024-10-11');
  });
});

describe('TransactionWithSplits', () => {
  it('should have a list of splits', () => {
    const transaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '0.00', 'SPLIT') as TransactionWithSplits;
    expect(transaction.splits).to.be.an('array').that.is.empty;
  });

  it('should be able to get splits', () => {
    const transaction = new TransactionWithSplits('Bank', '2024-10-11', 'Payee A', '0.00', 'SPLIT');
    expect(transaction.getSplits()).to.deep.equal([]);
  });
});

describe('TransactionSplit', () => {
  it('should have a parent transaction', () => {
    const parentTransaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '0.00', 'SPLIT') as TransactionWithSplits;
    const split = new TransactionSplit(parentTransaction, 'Bank', '2024-10-11', 'Payee B', '50.00', 'groceries');
    expect(split.parent).to.equal(parentTransaction);
    expect(parentTransaction.splits[0]).to.equal(split);
  });

  it('should pass remaining parameters to the parent class constructor', () => {
    const parentTransaction = Transaction.createTransaction('Bank', '2024-10-11', 'Payee A', '0.00', 'SPLIT') as TransactionWithSplits;
    const split = new TransactionSplit(parentTransaction, 'Bank', '2024-10-11', 'Payee B', '50.00', 'groceries');
    expect(split.payee).to.equal('Payee B');
    expect(split.amount).to.equal('50.00');
    expect(split.category).to.equal('groceries');
  });
});
