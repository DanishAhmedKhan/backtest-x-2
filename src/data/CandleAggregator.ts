import { Candle } from '../core/Candle'

export class CandleAggregator {
    public static aggregate(candles: Candle[], intervalMinutes: number): Candle[] {
        if (!candles.length) {
            return []
        }

        const intervalSec = intervalMinutes * 60

        const buckets = new Map<number, Candle[]>()

        for (const candle of candles) {
            const bucket = Math.floor(candle.time / intervalSec) * intervalSec

            if (!buckets.has(bucket)) {
                buckets.set(bucket, [])
            }

            buckets.get(bucket)!.push(candle)
        }

        return [...buckets.entries()].map(([time, group]) => this.buildBucket(group, time))
    }

    public static aggregateUntil(candles: Candle[], tfSeconds: number, replayTime: number): Candle[] {
        if (!candles.length) {
            return []
        }

        const result: Candle[] = []

        let currentBucket: Candle[] = []
        let currentStart: number | null = null

        for (const candle of candles) {
            if (candle.time > replayTime) {
                break
            }

            const bucket = Math.floor(candle.time / tfSeconds) * tfSeconds

            if (currentStart === null) {
                currentStart = bucket
            }

            if (bucket !== currentStart) {
                result.push(this.buildBucket(currentBucket, currentStart))

                currentBucket = []
                currentStart = bucket
            }

            currentBucket.push(candle)
        }

        if (currentBucket.length) {
            result.push(this.buildBucket(currentBucket, currentStart!))
        }

        return result
    }

    public static aggregateRange(candles: Candle[], startIndex: number, endIndex: number, tfSeconds: number): Candle[] {
        if (candles.length === 0 || startIndex > endIndex || startIndex >= candles.length) {
            return []
        }

        endIndex = Math.min(endIndex, candles.length - 1)

        const result: Candle[] = []

        let currentBucket: Candle[] = []
        let currentBucketTime: number | null = null

        for (let i = startIndex; i <= endIndex; i++) {
            const candle = candles[i]

            const bucketTime = Math.floor(candle.time / tfSeconds) * tfSeconds

            if (currentBucketTime === null) {
                currentBucketTime = bucketTime
            }

            if (bucketTime !== currentBucketTime) {
                result.push(this.buildBucket(currentBucket, currentBucketTime))

                currentBucket = []
                currentBucketTime = bucketTime
            }

            currentBucket.push(candle)
        }

        if (currentBucket.length) {
            result.push(this.buildBucket(currentBucket, currentBucketTime!))
        }

        return result
    }

    private static buildBucket(group: Candle[], time: number): Candle {
        return new Candle({
            time,
            open: group[0].open,
            high: Math.max(...group.map((c) => c.high)),
            low: Math.min(...group.map((c) => c.low)),
            close: group[group.length - 1].close,
            volume: group.reduce((sum, c) => sum + c.volume, 0),
        })
    }
}
