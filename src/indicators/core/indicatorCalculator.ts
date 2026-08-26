import type { Indicator } from './Indicator'
import type { IndicatorSource } from './indicatorSource'
import type { IndicatorContext } from './IndicatorContext'
import type { IndicatorResult } from './IndicatorResult'

import { calculateEMA } from '../calculations/ema'
import { calculateSMA } from '../calculations/sma'
import { calculateATR } from '../calculations/atr'

function requireSetting<T>(indicator: Indicator, key: string): T {
    const value = indicator.getSetting<T>(key)

    if (value === undefined) {
        throw new Error(`Missing required setting "${key}" for indicator "${indicator.type}"`)
    }

    return value
}

export function calculateIndicator(context: IndicatorContext, indicator: Indicator): IndicatorResult {
    switch (indicator.type) {
        case 'sma':
            return calculateSMA(context.candles, {
                period: requireSetting<number>(indicator, 'period'),
                source: requireSetting<IndicatorSource>(indicator, 'source'),
            })

        case 'ema':
            return calculateEMA(context.candles, {
                period: requireSetting<number>(indicator, 'period'),
                source: requireSetting<IndicatorSource>(indicator, 'source'),
            })

        case 'atr':
            return calculateATR(context.candles, {
                period: requireSetting<number>(indicator, 'period'),
            })

        default:
            throw new Error(`Unsupported indicator type: ${indicator.type}`)
    }
}
