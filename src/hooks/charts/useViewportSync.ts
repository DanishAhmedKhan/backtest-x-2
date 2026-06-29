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
            if (totalCandles === 0) return

            const lastDataIndex = totalCandles - 1
            const { from, to } = logicalRange

            const visibleFrom = Math.max(0, Math.ceil(from))
            const visibleTo = Math.min(lastDataIndex, Math.floor(to))
            const visibleCandleCount = Math.max(0, visibleTo - visibleFrom + 1)
            const whiteSpaceBars = to > lastDataIndex ? Math.floor(to) - lastDataIndex : 0

            candleCountRef.current = visibleCandleCount
            spaceCountRef.current = whiteSpaceBars
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [chartRef, candlesRef, isChangingTimeframeRef, chartReady, seriesRef, candleCountRef, spaceCountRef])
}
