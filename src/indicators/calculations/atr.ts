import type { Candle } from '../../core/Candle'
import type { IndicatorValue } from '../core/indicatorSource'

export type ATRConfig = {
    period: number
}

export function calculateATR(candles: Candle[], config: ATRConfig): IndicatorValue[] {
    const { period } = config

    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`ATR period must be a positive integer: ${period}`)
    }

    if (candles.length <= period) {
        return []
    }

    const result: IndicatorValue[] = []

    const trueRanges: number[] = []

    for (let i = 0; i < candles.length; i++) {
        const candle = candles[i]

        if (i === 0) {
            trueRanges.push(candle.high - candle.low)
            continue
        }

        const previousClose = candles[i - 1].close

        const trueRange = Math.max(
            candle.high - candle.low,
            Math.abs(candle.high - previousClose),
            Math.abs(candle.low - previousClose),
        )

        trueRanges.push(trueRange)
    }

    // First ATR = SMA of the first `period` true ranges.
    let sum = 0

    for (let i = 0; i < period; i++) {
        sum += trueRanges[i]
    }

    let previousATR = sum / period

    result.push({
        time: candles[period - 1].time,
        value: previousATR,
    })

    // Subsequent ATR values use Wilder's smoothing:
    //
    // ATR = ((Previous ATR × (period - 1)) + Current TR) / period
    //
    for (let i = period; i < candles.length; i++) {
        const currentTR = trueRanges[i]

        const atr = (previousATR * (period - 1) + currentTR) / period

        previousATR = atr

        result.push({
            time: candles[i].time,
            value: atr,
        })
    }

    return result
}
