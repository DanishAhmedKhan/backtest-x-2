import { AssetType } from './AsetType'

export class Ticker {
    public readonly value: string
    public readonly assetType: AssetType
    public readonly description?: string

    public static DEFAULT = new Ticker('EURUSD', AssetType.FOREX)

    constructor(value: string, assetType: AssetType = AssetType.UNKNOWN, description?: string) {
        if (!value.trim()) {
            throw new Error('Ticker value cannot be empty')
        }

        if (value.length > 16) {
            throw new Error('Ticker length exceeds the max ticker length')
        }

        this.value = value.toUpperCase()
        this.assetType = assetType
        this.description = description
    }

    public toKey(): string {
        return `${this.value}`
    }

    public toString(): string {
        return this.value
    }

    public equals(ticker?: Ticker): boolean {
        return this.value === ticker?.value
    }

    public static stringify(ticker: Ticker) {
        return `${ticker.value} ${ticker.assetType} ${ticker.description}`
    }

    public static parse(ticker: string) {
        const arr = ticker.split(' ')
        return new Ticker(arr[0], arr[1] as AssetType, arr[2])
    }
}
