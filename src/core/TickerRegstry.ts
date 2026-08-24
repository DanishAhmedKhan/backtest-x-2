import { AssetType } from './AsetType'
import { Ticker } from './Ticker'

export class TickerRegistry {
    private static readonly tickers: Ticker[] = [
        new Ticker('EURUSD', AssetType.FOREX),
        new Ticker('USDJPY', AssetType.FOREX),
        new Ticker('GBPUSD', AssetType.FOREX),
        new Ticker('US100', AssetType.INDEX),
        new Ticker('XAUUSD', AssetType.COMMODITY),
    ]

    public static getAll(): Ticker[] {
        return [...this.tickers]
    }

    public static getDefault(): Ticker {
        return this.tickers[0]
    }

    public static register(ticker: Ticker) {
        this.tickers.push(ticker)
    }

    public static getByValue(value: string): Ticker | undefined {
        return this.tickers.find((t) => t.value === value)
    }
}
