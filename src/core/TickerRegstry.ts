import { AssetType } from './AsetType'
import { Ticker } from './Ticker'

export class TickerRegistry {
    private static readonly tickers: Ticker[] = [
        new Ticker('EURUSD', AssetType.FOREX),
        new Ticker('USDJPY', AssetType.FOREX),
        new Ticker('GBPUSD', AssetType.FOREX),
    ]

    static getAll(): Ticker[] {
        return [...this.tickers]
    }

    static getDefault(): Ticker {
        return this.tickers[0]
    }

    static register(ticker: Ticker) {
        this.tickers.push(ticker)
    }
}
