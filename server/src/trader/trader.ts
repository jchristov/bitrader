import { TraderService } from '../service/traderService';
import { Account } from '../model/account';
import { TradingStrategy } from '../strategy/strategy';
import { CustomTradingStrategy } from '../strategy/customStrategy';

export interface HistoryRecord {
    value: number;
    growth: number;

}

export interface TraderConfig {
    deposit: number,
    currency: string,
    refreshRate?: number
    strategy?: TradingStrategy
}

export class TradingSession {
    private _initialDeposit: number;
    private _history: Array<HistoryRecord>;
    private _currency: string;
    private _refreshRate: number;

    constructor(config: TraderConfig) {
        this._initialDeposit = config.deposit;
        this._refreshRate = config.refreshRate | 30;
        this._currency = config.currency;
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