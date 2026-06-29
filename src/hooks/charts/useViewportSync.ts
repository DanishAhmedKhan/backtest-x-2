import { useEffect } from 'react'
import type { IChartApi, Time, CandlestickData, ISeriesApi } from 'lightweight-charts'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    isChangingTimeframeRef: React.RefObject<boolean>
    chartReady: boolean
    candleCountRef: React.RefObject<number | null>
    spaceCountRef: React.RefObject<number | null>
}

export function useViewportSync({
    chartRef,
    seriesRef,
    candlesRef,
    isChangingTimeframeRef,
    chartReady,
    candleCountRef,
    spaceCountRef,
}: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !chartReady) return

        const timeScale = chart.timeScale()

        const handler = (logicalRange) => {
            if (isChangingTimeframeRef.current) return

            if (!logicalRange) return

            const totalCandles = series.data().length

            if (!totalCandles) return

            const lastIndex = totalCandles - 1

            const { from, to } = logicalRange

            const visibleStart = Math.max(from, 0)
            const visibleEnd = Math.min(to, lastIndex)

            const visibleCandles = Math.max(0, visibleEnd - visibleStart + 1)

            const whitespace = Math.max(0, to - lastIndex)

            candleCountRef.current = visibleCandles
            spaceCountRef.current = whitespace
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [chartRef, candlesRef, isChangingTimeframeRef, chartReady, seriesRef, candleCountRef, spaceCountRef])
}
