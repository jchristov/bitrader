import { TraderService } from '../service/traderService';
import { Account } from '../model/account';
import { TradingStrategy } from './strategy/strategy';
import { CustomTradingStrategy } from './strategy/customStrategy';

export interface HistoryRecord {
    value: number;
    growth: number;

}

export class TradingSession {
    private _initialDeposit: number;
    private _history: Array<HistoryRecord>;
    private _buyThreshold: number;
    private _sellThreshold: number;
    private _currency: string;
    private _refreshRate: number;

    constructor(deposit: number, currency: string, buyThreshold: number, sellThreshold: number, refreshRate: number = 30) {
        this._initialDeposit = deposit;
        this._buyThreshold = buyThreshold;
        this._sellThreshold = sellThreshold;
        this._refreshRate = refreshRate;
        this._currency = currency;
    }
}

export class Trader {
    private _traderService: TraderService;
    private _session: TradingSession;
    private _account: Account;
    private _strategy: TradingStrategy;

    constructor(traderService: TraderService, account: Account) {
        this._traderService = traderService;
        this._strategy = new CustomTradingStrategy();
    }

    getTicker(): Promise<any> {
        return this._traderService.getTicker()
    }

    setStrategy(strategy: TradingStrategy) {
        this._strategy = strategy;
    }

}