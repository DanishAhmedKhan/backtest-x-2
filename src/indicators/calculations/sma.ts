import type { Candle } from '../../core/Candle'
import type { IndicatorResult, IndicatorValue } from '../core/IndicatorResult'
import { getIndicatorSourceValue, type IndicatorSource } from '../core/indicatorSource'

export type SMAConfig = {
    period: number
    source: IndicatorSource
}

export function calculateSMA(candles: Candle[], config: SMAConfig): IndicatorResult {
    const { period, source } = config

    if (period <= 0 || !Number.isInteger(period)) {
        throw new Error(`SMA period must be a positive integer: ${period}`)
    }

    const result: IndicatorResult = {
        lines: [],
        levels: [],
        markers: [],
        rectangles: [],
        candleStyles: [],
    }

    if (candles.length < period) {
        return result
    }

    const values: IndicatorValue[] = []

    let sum = 0

    for (let i = 0; i < candles.length; i++) {
        sum += getIndicatorSourceValue(candles[i], source)

        if (i >= period) {
            sum -= getIndicatorSourceValue(candles[i - period], source)
        }

        if (i >= period - 1) {
            values.push({
                time: candles[i].time,
                value: sum / period,
            })
        }
    }

    result.lines.push({
        id: 'sma',
        values,
    })

    return result
}
