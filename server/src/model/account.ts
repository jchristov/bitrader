export class Account {
    private _balance: number;
    public get balance(): number {
        return this._balance;
    }

    constructor(balance: number) {
        this._balance = balance;
    }
}
