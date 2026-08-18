import type { Candle } from '../../core/Candle'
import { getIndicatorSourceValue, type IndicatorSource, type IndicatorValue } from '../core/indicatorSource'

export type SMAConfig = {
    period: number
    source: IndicatorSource
}

export function calculateSMA(candles: Candle[], config: SMAConfig): IndicatorValue[] {
    const { period, source } = config

    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`SMA period must be a positive integer: ${period}`)
    }

    if (candles.length < period) {
        return []
    }

    const result: IndicatorValue[] = []

    let sum = 0

    for (let i = 0; i < candles.length; i++) {
        sum += getIndicatorSourceValue(candles[i], source)

        if (i >= period) {
            sum -= getIndicatorSourceValue(candles[i - period], source)
        }

        if (i >= period - 1) {
            result.push({
                time: candles[i].time,
                value: sum / period,
            })
        }
    }

    return result
}
