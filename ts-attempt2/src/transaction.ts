// src/transaction.ts

export class Transaction {
  private _institution: string;
  private _date: string;
  private _payee: string;
  private _amount: string;
  private _category: string;

  constructor(institution: string, date: string, payee: string, amount: string, category: string) {
    this._institution = institution;
    this._date = this.validateDate(date);
    this._payee = payee;
    this._amount = this.validateAmount(amount);
    this._category = category;
  }

  static createTransaction(institution: string, date: string, payee: string, amount: string, category: string): Transaction {
    if (category === 'SPLIT') {
      return new TransactionWithSplits(institution, date, payee, amount, category);
    }
    return new Transaction(institution, date, payee, amount, category);
  }

  private validateDate(date: string): string {
    if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
      throw new Error('Invalid date format');
    }
    return date;
  }

  private validateAmount(amount: string): string {
    if (isNaN(parseFloat(amount))) {
      throw new Error('Invalid amount format');
    }
    return amount;
  }

  get institution(): string {
    return this._institution;
  }

  get date(): string {
    return this._date;
  }

  get payee(): string {
    return this._payee;
  }

  get amount(): string {
    return this._amount;
  }

  get category(): string {
    return this._category;
  }

  toCsv(headers: string[], values: string[]): string {
    return values.join(',');
  }
}

export class TransactionWithSplits extends Transaction {
  private _splits: TransactionSplit[];

  constructor(institution: string, date: string, payee: string, amount: string, category: string) {
    super(institution, date, payee, amount, category);
    this._splits = [];
  }

  get splits(): TransactionSplit[] {
    return this._splits;
  }

  getSplits(): TransactionSplit[] {
    return this._splits;
  }
}

export class TransactionSplit extends Transaction {
  private _parent: TransactionWithSplits;

  constructor(parentTransaction: TransactionWithSplits, institution: string, date: string, payee: string, amount: string, category: string) {
    super(institution, date, payee, amount, category);
    this._parent = parentTransaction;
    parentTransaction.splits.push(this);
  }

  get parent(): TransactionWithSplits {
    return this._parent;
  }
}

export default {
  Transaction,
  TransactionWithSplits,
  TransactionSplit
};
