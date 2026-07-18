import { useEffect, useState } from 'react'
import type { CandlestickData, IChartApi, ISeriesApi, Time } from 'lightweight-charts'

type Props = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
}

export type OhlcData = {
    open: number
    high: number
    low: number
    close: number
}

export function useOHLCOverlay({ chartRef, seriesRef }: Props) {
    const [ohlc, setOhlc] = useState<OhlcData | null>(null)

    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series) {
            return
        }

        const handleCrosshairMove = (param) => {
            const candle = param.seriesData.get(series) as CandlestickData<Time> | undefined

            if (!candle) {
                return
            }

            setOhlc({
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
            })
        }

        chart.subscribeCrosshairMove(handleCrosshairMove)

        return () => {
            chart.unsubscribeCrosshairMove(handleCrosshairMove)
        }
    }, [chartRef, seriesRef])

    return ohlc
}
