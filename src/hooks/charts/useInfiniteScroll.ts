import { useEffect } from 'react'
import type { IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'

import { replayStore } from '../../replay/ReplayStore'
import { loadAdjacentWindow } from '../utilities/loadAdjacentWidow,'

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
    isLoadingOlderRef: React.RefObject<boolean>
    isChangingTimeframeRef: React.RefObject<boolean>
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
    isLoadingOlderRef,
    isChangingTimeframeRef,
}: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series || !chartReady) {
            return
        }

        const timeScale = chart.timeScale()

        const handleRangeChange = async () => {
            if (isChangingTimeframeRef.current) {
                return
            }

            if (replayStore.enabled) return

            if (isLoadingOlderRef.current) return

            const range = timeScale.getVisibleLogicalRange()

            if (!range) return

            isLoadingOlderRef.current = true

            try {
                if (range.from < 20) {
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

                if (range.to > candlesRef.current.length - 20) {
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
                isLoadingOlderRef.current = false
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handleRangeChange)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handleRangeChange)
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
        isLoadingOlderRef,
        loadedWindowRef,
        isChangingTimeframeRef,
    ])
}
