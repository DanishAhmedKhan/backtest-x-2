import { useEffect } from 'react'
import type { IChartApi, Time, CandlestickData, ISeriesApi } from 'lightweight-charts'
import type { ViewportState } from '../../types/Viewport'
import { captureViewport } from '../utilities/viewport'

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

        if (!chart || !series || !chartReady) {
            return
        }

        const timeScale = chart.timeScale()

        const handler = () => {
            if (isChangingTimeframeRef.current) {
                return
            }

            const lastBarIndex = series.data().length - 1

            if (lastBarIndex < 0) {
                return
            }

            captureViewport({
                chart,
                series,
                viewport: viewportRef,
            })
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [chartReady, chartRef, seriesRef, viewportRef, isChangingTimeframeRef, candlesRef])
}
