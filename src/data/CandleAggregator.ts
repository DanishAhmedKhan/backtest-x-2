import { Candle } from '../core/Candle'

export class CandleAggregator {
    public static aggregate(candles: Candle[], intervalMinutes: number): Candle[] {
        if (!candles.length) return []

        const result: Candle[] = []

        let bucket: Candle[] = []
        let currentBucketStart = this.alignTime(candles[0].time, intervalMinutes)

        for (const candle of candles) {
            const bucketStart = this.alignTime(candle.time, intervalMinutes)

            if (bucketStart !== currentBucketStart) {
                result.push(this.buildCandle(bucket))
                bucket = []
                currentBucketStart = bucketStart
            }

            bucket.push(candle)
        }

        if (bucket.length) {
            result.push(this.buildCandle(bucket))
        }

        return result
    }

    private static alignTime(timestamp: number, intervalMinutes: number) {
        const intervalSec = intervalMinutes * 60
        return Math.floor(timestamp / intervalSec) * intervalSec
    }

    private static buildCandle(candles: Candle[]): Candle {
        const first = candles[0]
        const last = candles[candles.length - 1]

        return new Candle({
            time: first.time,
            open: first.open,
            high: Math.max(...candles.map((c) => c.high)),
            low: Math.min(...candles.map((c) => c.low)),
            close: last.close,
            volume: candles.reduce((sum, c) => sum + c.volume, 0),
        })
    }
}
