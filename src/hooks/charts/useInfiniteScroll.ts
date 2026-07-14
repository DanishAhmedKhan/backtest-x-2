import { useEffect } from 'react'
import type { IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'

import { loadAdjacentWindow } from '../utilities/loadAdjacentWidow,'

import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'
import type { LoadedWindow } from '../../types/LoadedWindow'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    isLoadingDataRef: React.RefObject<boolean>
    isChangingTimeframeRef: React.RefObject<boolean>
    isUserInteractingRef: React.RefObject<boolean>
}

export function useInfiniteScroll({
    chartRef,
    seriesRef,
    candlesRef,
    candleMapRef,
    timesRef,
    ticker,
    timeframe,
    chartReady,
    loadedWindowRef,
    totalFilesRef,
    isLoadingDataRef,
    isChangingTimeframeRef,
    isUserInteractingRef,
}: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series || !chartReady) {
            return
        }

        const timeScale = chart.timeScale()

        const handleRangeChange = async () => {
            if (
                isChangingTimeframeRef.current ||
                replayStore.enabled ||
                isLoadingDataRef.current ||
                isUserInteractingRef.current
            ) {
                return
            }

            const range = timeScale.getVisibleLogicalRange()
            if (!range) return

            isLoadingDataRef.current = true

            // const threshold = max(visibleBars * 2, 150)
            const threshold = 150

            try {
                if (range.from < threshold) {
                    const currentRange = range

                    const result = await loadAdjacentWindow({
                        series,
                        candlesRef,
                        candleMapRef,
                        timesRef,
                        ticker,
                        timeframe,
                        loadedWindowRef,
                        totalFilesRef,
                        direction: 'older',
                    })

                    if (result.loaded) {
                        requestAnimationFrame(() => {
                            timeScale.setVisibleLogicalRange({
                                from: currentRange.from + result.addedBars,
                                to: currentRange.to + result.addedBars,
                            })
                        })

                        return
                    }
                }

                if (range.to > candlesRef.current.length - threshold) {
                    await loadAdjacentWindow({
                        series,
                        candlesRef,
                        candleMapRef,
                        timesRef,
                        ticker,
                        timeframe,
                        loadedWindowRef,
                        totalFilesRef,
                        direction: 'newer',
                    })
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
        isUserInteractingRef,
    ])
}
