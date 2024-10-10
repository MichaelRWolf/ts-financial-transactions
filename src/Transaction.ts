export class Transaction {
    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }

    get payee(): string {
        return this._payee;
    }

    set payee(value: string) {
        this._payee = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get account(): string {
        return this._account;
    }

    set account(value: string) {
        this._account = value;
    }

    private _account: string;
    private _date: Date;
    private _payee: string;
    private _amount: number;

    constructor(account: string, dateString: string, payee: string, amount: number) {
        this._account = account;
        this._date = new Date(dateString);
        this._payee = payee;
        this._amount = amount;

    }

    dateOnly(): string {
        return this.date.toISOString().split('T')[0];
    }

    addSplit(childTransaction: Transaction) {

    }

}