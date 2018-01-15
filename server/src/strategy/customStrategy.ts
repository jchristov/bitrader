import {TradeCommand, TradingStrategy} from "./strategy";
import {Ticker} from "../service/traderService";

export class CustomTradingStrategy extends TradingStrategy{
    process(ticker: Ticker): TradeCommand {
        return TradeCommand.hodl;
    }
}