import type { CandlestickData, ISeriesApi, Time } from 'lightweight-charts'

import type { Candle } from '../../core/Candle'

type Params = {
    candles: Candle[]
    series: ISeriesApi<'Candlestick'>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
}

export function applyChartData({ candles, series, candlesRef, candleMapRef, timesRef }: Params) {
    const formatted: CandlestickData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
    }))

    candlesRef.current = formatted

    candleMapRef.current.clear()

    formatted.forEach((c) => {
        candleMapRef.current.set(Number(c.time), c)
    })

    timesRef.current = formatted.map((c) => Number(c.time))

    series.setData(formatted)

    return formatted.length
}
