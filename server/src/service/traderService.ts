export class Exchange {
    private _baseAsset: string;
    private _quoateAsset: string;

    public get baseAsset(): string {
        return this._baseAsset;
    }

    public get quoateAsset(): string {
        return this._quoateAsset;
    }

    public get symbol(): string {
        return `${this._baseAsset}-${this._quoateAsset}`;
    }

    constructor(base: string, quoate: string) {
        this._baseAsset = base;
        this._quoateAsset = quoate;
    }
}

export class Ticker {
    ask: number;
    bid: number;
    last: number;

    constructor(ask: number, bid: number, last: number) {
        this.ask = ask;
        this.bid = bid;
        this.last = last;
    }
}

export enum ErrorTraderService {
    getTickerFailed = 'get_ticker_failed'
}

export class TraderService {
    buy() {}
    sell() {}
    getTicker(exchange: Exchange = null): Promise<Ticker> {
        return new Promise<any>((resolve) => resolve(new Ticker(0, 0, 0)));
    }
}