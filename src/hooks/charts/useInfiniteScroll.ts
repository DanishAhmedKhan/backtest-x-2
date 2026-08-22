import { useEffect } from 'react'
import type { IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'

import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'
import type { LoadedWindow } from '../../types/LoadedWindow'
import type { ViewportState } from '../../types/Viewport'
import { CandleService } from '../../core/CandleService'

import type { ChartRuntime } from '../../drawing/runtime/ChartRuntime'
import type { Raw1mData } from '../../components/Chart'

import { loadAdjacentWindow } from '../utilities/loadAdjacentWindow'

enum Direction {
    OLDER = 'older',
    NEWER = 'newer',
}

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    displayedCandlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    raw1mRef: React.RefObject<Raw1mData>
    isLoadingDataRef: React.RefObject<boolean>
    isChangingTimeframeRef: React.RefObject<boolean>
    isViewportInteractionRef: React.RefObject<boolean>
    viewportRef: React.RefObject<ViewportState>
    runtimeRef: React.RefObject<ChartRuntime | null>
}

export function useInfiniteScroll({
    chartRef,
    seriesRef,
    candlesRef,
    displayedCandlesRef,
    candleMapRef,
    timesRef,
    ticker,
    timeframe,
    chartReady,
    loadedWindowRef,
    totalFilesRef,
    raw1mRef,
    isLoadingDataRef,
    isChangingTimeframeRef,
    isViewportInteractionRef,
    viewportRef,
    runtimeRef,
}: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series || !chartReady) return

        const timeScale = chart.timeScale()

        const handleRangeChange = async () => {
            if (replayStore.isSelecting) return

            if (isChangingTimeframeRef.current || isLoadingDataRef.current || isViewportInteractionRef.current) {
                return
            }

            const range = timeScale.getVisibleLogicalRange()
            if (!range) return

            isLoadingDataRef.current = true

            const threshold = Math.max(Math.ceil(viewportRef.current.visibleBars * 2), 150)
            const fileCount = CandleService.getAdjacentLoadFileCount(timeframe)

            try {
                const loadWindow = (direction: Direction) =>
                    loadAdjacentWindow({
                        series,
                        candlesRef,
                        raw1mRef,
                        candleMapRef,
                        timesRef,
                        ticker,
                        timeframe,
                        loadedWindowRef,
                        totalFilesRef,
                        direction,
                        fileCount,
                    })

                if (range.from < threshold) {
                    if (replayStore.enabled) return

                    const beforeScroll = timeScale.scrollPosition()

                    const result = await loadWindow(Direction.OLDER)

                    if (result.loaded) {
                        displayedCandlesRef.current = candlesRef.current

                        runtimeRef.current?.onChartDataChanged()
                        eventBus.emit('chartDataChanged')

                        timeScale.scrollPosition()
                        timeScale.scrollToPosition(beforeScroll, false)
                    }
                }

                if (range.to > candlesRef.current.length - threshold) {
                    const result = await loadWindow(Direction.NEWER)

                    if (result.loaded) {
                        displayedCandlesRef.current = candlesRef.current

                        runtimeRef.current?.onChartDataChanged()
                        eventBus.emit('chartDataChanged')
                    }
                }
            } catch (err) {
                console.error(err)
            } finally {
                requestAnimationFrame(() => {
                    isLoadingDataRef.current = false
                })
            }
        }

        const unsubscribeDrag = eventBus.on('chartDragEnded', () => {
            handleRangeChange()
        })

        timeScale.subscribeVisibleLogicalRangeChange(handleRangeChange)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handleRangeChange)
            unsubscribeDrag()
        }
    }, [
        chartReady,
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        candleMapRef,
        timesRef,
        totalFilesRef,
        loadedWindowRef,
        isChangingTimeframeRef,
        isLoadingDataRef,
        isViewportInteractionRef,
        viewportRef,
        runtimeRef,
        raw1mRef,
        displayedCandlesRef,
    ])
}
