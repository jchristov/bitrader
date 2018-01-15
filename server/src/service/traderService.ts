export class Exchange {
    private _baseAsset: string;
    private _quoateAsset: string;

    public get baseAsset(): string {
        return this._baseAsset;
    }

    public get quoateAsset(): string {
        return this._quoateAsset;
    }

    constructor(base: string, quoate: string) {
        this._baseAsset = base;
        this._quoateAsset = quoate;
    }
}
export class TraderService {
    buy() {}
    sell() {}
    getTicker(exchange: Exchange) {}
}