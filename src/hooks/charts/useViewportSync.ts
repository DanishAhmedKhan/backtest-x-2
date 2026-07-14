import { useEffect } from 'react'
import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import type { ViewportState } from '../../types/Viewport'
import { captureViewport } from '../utilities/viewport'
import { replayStore } from '../../replay/ReplayStore'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    isChangingTimeframeRef: React.RefObject<boolean>
    isLoadingDataRef: React.RefObject<boolean>
    chartReady: boolean
    viewportRef: React.RefObject<ViewportState>
    replayViewportRef: React.RefObject<ViewportState>
    isUserInteractingRef: React.RefObject<boolean>
}

export function useViewportSync({
    chartRef,
    seriesRef,
    isChangingTimeframeRef,
    isLoadingDataRef,
    chartReady,
    viewportRef,
    replayViewportRef,
    isUserInteractingRef,
}: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series || !chartReady) {
            return
        }

        const timeScale = chart.timeScale()

        const handler = () => {
            if (isChangingTimeframeRef.current || isLoadingDataRef.current) {
                return
            }

            if (replayStore.enabled && replayStore.isPlaying && !isUserInteractingRef.current) {
                return
            }

            const lastBarIndex = series.data().length - 1

            if (lastBarIndex < 0) {
                return
            }

            console.count('capture')

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
    }, [
        chartReady,
        chartRef,
        seriesRef,
        viewportRef,
        isChangingTimeframeRef,
        isLoadingDataRef,
        replayViewportRef,
        isUserInteractingRef,
    ])
}
