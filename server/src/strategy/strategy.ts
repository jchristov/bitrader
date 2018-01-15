import {Ticker} from "../service/traderService";

export enum TradeCommand {
    buy,
    sell,
    hodl
}

export class TradingStrategy {
    process(ticker: Ticker): TradeCommand { return TradeCommand.hodl }
}