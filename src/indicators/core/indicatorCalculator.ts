import type { Candle } from '../../core/Candle'
import type { IndicatorConfig } from './Indicator'

import { calculateEMA } from '../calculations/ema'
import { calculateSMA } from '../calculations/sma'
import { calculateATR } from '../calculations/atr'

export type CalculatedIndicatorValue = {
    time: number
    value: number
}

export function calculateIndicator(candles: Candle[], config: IndicatorConfig): CalculatedIndicatorValue[] {
    switch (config.type) {
        case 'sma':
            return calculateSMA(candles, {
                period: config.period,
                source: config.source ?? 'close',
            })

        case 'ema':
            return calculateEMA(candles, {
                period: config.period,
                source: config.source ?? 'close',
            })

        case 'atr':
            return calculateATR(candles, {
                period: config.period,
            })

        default:
            return []
    }
}
