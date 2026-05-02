import { Timeframe } from './Timeframe'

export class TimeframeRegistry {
    private static readonly timeframes: Timeframe[] = [
        Timeframe.parse('1m'),
        Timeframe.parse('5m'),
        Timeframe.parse('15m'),
        Timeframe.parse('30m'),
        Timeframe.parse('1h'),
        Timeframe.parse('4h'),
        Timeframe.parse('1d'),
    ]

    static getAll(): Timeframe[] {
        return [...this.timeframes]
    }

    static getDefault(): Timeframe {
        return this.timeframes[0]
    }

    static getByValue(value: string): Timeframe | undefined {
        return this.timeframes.find((tf) => tf.toKey() === value)
    }
}
