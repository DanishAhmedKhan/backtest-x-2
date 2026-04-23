import { Candle } from '../core/Candle'
import { Timeframe } from '../core/Timeframe'

export class BarAggregator {
    static aggregate(candles: Candle[], timeframe: string | Timeframe): Candle[] {
        const tf = typeof timeframe === 'string' ? Timeframe.parse(timeframe) : timeframe

        const intervalSeconds = tf.toSeconds()

        const result: Candle[] = []
        let bucket: Candle[] = []
        let bucketStart = 0

        for (const candle of candles) {
            const start = Math.floor(candle.time / intervalSeconds) * intervalSeconds

            if (!bucket.length) bucketStart = start

            if (start !== bucketStart) {
                result.push(this.merge(bucket, bucketStart))
                bucket = []
                bucketStart = start
            }

            bucket.push(candle)
        }

        if (bucket.length) {
            result.push(this.merge(bucket, bucketStart))
        }

        return result
    }

    private static merge(candles: Candle[], time: number): Candle {
        return new Candle({
            time,
            open: candles[0].open,
            close: candles[candles.length - 1].close,
            high: Math.max(...candles.map((c) => c.high)),
            low: Math.min(...candles.map((c) => c.low)),
            volume: candles.reduce((s, c) => s + c.volume, 0),
        })
    }
}
