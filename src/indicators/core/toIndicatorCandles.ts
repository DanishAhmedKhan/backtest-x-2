import type { CandlestickData, Time } from 'lightweight-charts'

import { Candle } from '../../core/Candle'

export function toIndicatorCandles(candles: CandlestickData<Time>[]): Candle[] {
    return candles.map(
        (candle) =>
            new Candle({
                time: Number(candle.time),
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
            }),
    )
}
