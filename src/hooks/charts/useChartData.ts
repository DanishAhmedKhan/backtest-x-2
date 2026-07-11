import { useEffect } from 'react'
import type { CandlestickData, Time, IChartApi, ISeriesApi } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { TimeframeUnit } from '../../core/TimeframeUnit'
import { CandleService } from '../../core/CandleService'
import type { Candle } from '../../core/Candle'

import { eventBus } from '../../event/EventBus'
import { replayStore } from '../../replay/ReplayStore'
import { applyChartData } from '../utilities/applyChartData'
import { restoreViewport } from '../utilities/viewport'

import type { LoadedWindow } from '../../types/LoadedWindow'
import type { ViewportState } from '../../types/Viewport'

type Params = {
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    viewportRef: React.RefObject<ViewportState>
    setIsChangingTimeframe: (value: boolean) => void
}

export function useChartData({
    ticker,
    timeframe,
    chartReady,
    chartRef,
    seriesRef,
    candlesRef,
    raw1mCandlesRef,
    candleMapRef,
    timesRef,
    loadedWindowRef,
    totalFilesRef,
    viewportRef,
    setIsChangingTimeframe,
}: Params) {
    useEffect(() => {
        const load = async () => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series || !chartReady) return

            setIsChangingTimeframe(true)

            const totalFiles = await CandleService.getTotalFiles(ticker)

            totalFilesRef.current = totalFiles

            const candles = await CandleService.getInitialWindow(ticker, timeframe, totalFiles)

            raw1mCandlesRef.current = await CandleService.getInitialWindow(
                ticker,
                new Timeframe(1, TimeframeUnit.Minute),
                totalFiles,
            )

            loadedWindowRef.current = {
                oldestFile: Math.max(0, totalFiles - 2),
                latestFile: totalFiles - 1,
            }

            const barCount = applyChartData({
                candles,
                series,
                candlesRef,
                candleMapRef,
                timesRef,
            })

            restoreViewport({
                chart,
                viewport: viewportRef,
                barCount,
            })

            setIsChangingTimeframe(false)

            if (replayStore.enabled && replayStore.marketTime !== null) {
                eventBus.emit('replayTimeChanged', {
                    time: replayStore.marketTime,
                })
            }
        }

        load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, timeframe, chartReady])
}
