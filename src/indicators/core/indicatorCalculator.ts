import type { Indicator } from './Indicator'

import { calculateEMA } from '../calculations/ema'
import { calculateSMA } from '../calculations/sma'
import { calculateATR } from '../calculations/atr'
import type { IndicatorContext } from './IndicatorContext'
import type { IndicatorResult } from './IndicatorResult'

export function calculateIndicator(context: IndicatorContext, indicator: Indicator): IndicatorResult {
    const config = indicator.getConfig()

    switch (config.type) {
        case 'sma':
            return calculateSMA(context.candles, {
                period: config.period,
                source: config.source!,
            })

        case 'ema':
            return calculateEMA(context.candles, {
                period: config.period,
                source: config.source!,
            })

        case 'atr':
            return calculateATR(context.candles, {
                period: config.period,
            })

        default:
            throw new Error(`Unsupported indicator type: ${config.type}`)
    }
}
