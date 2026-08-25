import type { Candle } from '../../core/Candle'
import { emptyIndicatorResult, type IndicatorResult } from '../core/IndicatorResult'
import { getIndicatorSourceValue, type IndicatorSource, type IndicatorValue } from '../core/indicatorSource'

export type EMAConfig = {
    period: number
    source: IndicatorSource
}

export function calculateEMA(candles: Candle[], config: EMAConfig): IndicatorResult {
    const { period, source } = config

    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`EMA period must be a positive integer: ${period}`)
    }

    const result = emptyIndicatorResult()

    if (candles.length < period) {
        return result
    }

    const values: IndicatorValue[] = []

    const multiplier = 2 / (period + 1)

    let sum = 0

    for (let i = 0; i < period; i++) {
        sum += getIndicatorSourceValue(candles[i], source)
    }

    let previousEMA = sum / period

    values.push({
        time: candles[period - 1].time,
        value: previousEMA,
    })

    for (let i = period; i < candles.length; i++) {
        const sourceValue = getIndicatorSourceValue(candles[i], source)

        const ema = (sourceValue - previousEMA) * multiplier + previousEMA

        previousEMA = ema

        values.push({
            time: candles[i].time,
            value: ema,
        })
    }

    result.lines.push({
        id: 'ema',
        values,
    })

    return result
}
