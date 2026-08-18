import type { IndicatorSource } from './indicatorSource'

export type IndicatorType = 'sma' | 'ema' | 'atr' | 'rsi'

export type IndicatorConfig = {
    id: string
    type: IndicatorType
    period: number
    source?: IndicatorSource
}
