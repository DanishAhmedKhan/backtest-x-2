import { AssetType } from './AsetType'

export class Ticker {
    public readonly symbol: string
    public readonly assetType: AssetType
    public readonly description?: string

    public static DEFAULT = new Ticker('EURUSD', AssetType.FOREX)

    constructor(symbol: string, assetType: AssetType = AssetType.UNKNOWN, description?: string) {
        if (!symbol.trim()) {
            throw new Error('Ticker symbol cannot be empty')
        }

        this.symbol = symbol.toUpperCase()
        this.assetType = assetType
        this.description = description
    }

    public equals(ticker: Ticker): boolean {
        return this.symbol === ticker.symbol
    }

    public toString(): string {
        return this.symbol
    }
}
