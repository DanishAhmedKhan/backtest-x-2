import type { CandleData } from './CandleData'

export class Candle {
    public readonly time: number
    public readonly open: number
    public readonly high: number
    public readonly low: number
    public readonly close: number
    public readonly volume: number

    constructor(data: CandleData) {
        this.validate(data)

        this.time = data.time
        this.open = data.open
        this.high = data.high
        this.low = data.low
        this.close = data.close
        this.volume = data.volume ?? 0
    }

    private validate(data: CandleData): void {
        const { time, open, high, low, close, volume } = data

        if (!Number.isInteger(time) || time <= 0) {
            throw new Error(`Invalid candle time: ${time}`)
        }

        for (const [key, value] of Object.entries({ open, high, low, close })) {
            if (typeof value !== 'number' || value <= 0) {
                throw new Error(`Invalid candle price ${key}: ${value}`)
            }
        }

        if (high < open || high < close || high < low) {
            throw new Error('Candle high must be >= open, close, and low')
        }

        if (low > open || low > close || low > high) {
            throw new Error('Candle low must be <= open, close, and high')
        }

        if (volume !== undefined && volume < 0) {
            throw new Error(`Invalid candle volume: ${volume}`)
        }
    }

    public isBullish(): boolean {
        return this.close > this.open
    }

    public isBearish(): boolean {
        return this.close < this.open
    }

    public bodySize(): number {
        return Math.abs(this.close - this.open)
    }

    public range(): number {
        return this.high - this.low
    }

    public toLightweight() {
        return {
            time: this.time,
            open: this.open,
            high: this.high,
            low: this.low,
            close: this.close,
        }
    }
}
