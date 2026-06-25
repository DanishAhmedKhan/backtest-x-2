import { useEffect } from 'react'
import type { IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'

import { CandleService } from '../../core/CandleService'
import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { replayStore } from '../../replay/ReplayStore'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean
    oldestLoadedFileRef: React.RefObject<number>
    totalFilesRef: React.RefObject<number>
    isLoadingOlderRef: React.RefObject<boolean>
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
    oldestLoadedFileRef,
    totalFilesRef,
    isLoadingOlderRef,
}: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series || !chartReady) {
            return
        }

        const timeScale = chart.timeScale()

        const handleRangeChange = async () => {
            if (replayStore.enabled) {
                return
            }

            if (isLoadingOlderRef.current) {
                return
            }

            const range = timeScale.getVisibleLogicalRange()

            if (!range || range.from > 20) return
            if (oldestLoadedFileRef.current <= 0) return

            isLoadingOlderRef.current = true

            try {
                const loadIndex = oldestLoadedFileRef.current - 1

                const olderCandles = await CandleService.getOlderCandles(ticker, timeframe, loadIndex, 1)

                if (!olderCandles.length) {
                    return
                }

                const formatted: CandlestickData<Time>[] = olderCandles.map((c) => ({
                    time: c.time as Time,
                    open: c.open,
                    high: c.high,
                    low: c.low,
                    close: c.close,
                }))

                const currentRange = timeScale.getVisibleLogicalRange()

                const oldLength = candlesRef.current.length

                const merged = [...formatted, ...candlesRef.current]

                candlesRef.current = merged

                formatted.forEach((c) => {
                    candleMapRef.current.set(Number(c.time), c)
                })

                timesRef.current = merged.map((c) => Number(c.time))

                series.setData(merged)

                oldestLoadedFileRef.current = loadIndex

                if (currentRange) {
                    const addedBars = merged.length - oldLength

                    requestAnimationFrame(() => {
                        timeScale.setVisibleLogicalRange({
                            from: currentRange.from + addedBars,
                            to: currentRange.to + addedBars,
                        })
                    })
                }
            } catch (err) {
                console.error('Failed loading older candles', err)
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
        oldestLoadedFileRef,
        totalFilesRef,
        isLoadingOlderRef,
    ])
}
