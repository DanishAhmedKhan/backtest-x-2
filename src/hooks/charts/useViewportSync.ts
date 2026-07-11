import { useEffect } from 'react'
import type { IChartApi, Time, CandlestickData, ISeriesApi } from 'lightweight-charts'
import type { ViewportState } from '../../types/Viewport'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    isChangingTimeframeRef: React.RefObject<boolean>
    chartReady: boolean
    viewportRef: React.RefObject<ViewportState>
}

export function useViewportSync({
    chartRef,
    seriesRef,
    candlesRef,
    isChangingTimeframeRef,
    chartReady,
    viewportRef,
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

            const visibleBars = Math.max(0, visibleEnd - visibleStart + 1)
            const rightOffset = Math.max(0, to - lastIndex)

            viewportRef.current = {
                visibleBars,
                rightOffset,
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [chartRef, candlesRef, isChangingTimeframeRef, chartReady, seriesRef, viewportRef])
}
