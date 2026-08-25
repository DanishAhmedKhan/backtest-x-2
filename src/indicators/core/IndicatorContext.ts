import type { Candle } from '../../core/Candle'
import type { Timeframe } from '../../core/Timeframe'

export type IndicatorContext = {
    candles: Candle[]
    timeframe: Timeframe
}
