import type { Candle } from '../../core/Candle'

export type IndicatorSource = 'open' | 'high' | 'low' | 'close' | 'hl2' | 'hlc3' | 'ohlc4'

export type IndicatorValue = {
    time: number
    value: number
}

export function getIndicatorSourceValue(candle: Candle, source: IndicatorSource): number {
    switch (source) {
        case 'open':
            return candle.open

        case 'high':
            return candle.high

        case 'low':
            return candle.low

        case 'close':
            return candle.close

        case 'hl2':
            return (candle.high + candle.low) / 2

        case 'hlc3':
            return (candle.high + candle.low + candle.close) / 3

        case 'ohlc4':
            return (candle.open + candle.high + candle.low + candle.close) / 4
    }
}
