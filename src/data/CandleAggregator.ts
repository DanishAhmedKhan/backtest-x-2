import { Candle } from '../core/Candle'

export class CandleAggregator {
    public static aggregate(candles: Candle[], intervalMinutes: number): Candle[] {
        if (!candles.length) return []

        const intervalSec = intervalMinutes * 60

        const sorted = candles.slice().sort((a, b) => a.time - b.time)

        const buckets = new Map<number, Candle[]>()

        for (const candle of sorted) {
            const bucketTime = Math.floor(candle.time / intervalSec) * intervalSec

            if (!buckets.has(bucketTime)) {
                buckets.set(bucketTime, [])
            }

            buckets.get(bucketTime)!.push(candle)
        }

        const result: Candle[] = []

        for (const [bucketTime, group] of buckets) {
            const first = group[0]
            const last = group[group.length - 1]

            result.push(
                new Candle({
                    time: bucketTime,
                    open: first.open,
                    high: Math.max(...group.map((c) => c.high)),
                    low: Math.min(...group.map((c) => c.low)),
                    close: last.close,
                    volume: group.reduce((sum, c) => sum + c.volume, 0),
                }),
            )
        }

        return result.sort((a, b) => a.time - b.time)
    }
}
