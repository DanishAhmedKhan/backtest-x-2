import { useEffect } from 'react'
import type { CandlestickData, Time, IChartApi, ISeriesApi } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { CandleService } from '../../core/CandleService'
import type { Raw1mData } from '../../components/Chart'

import { eventBus } from '../../event/EventBus'
import { replayStore } from '../../replay/ReplayStore'

import type { LoadedWindow } from '../../types/LoadedWindow'
import type { ViewportState } from '../../types/Viewport'
import { applyChartData } from '../utilities/applyChartData'
import { restoreViewport } from '../utilities/viewport'
import { setRaw1mData } from '../utilities/setRaw1mData'

import type { ChartRuntime } from '../../drawing/runtime/ChartRuntime'

type Params = {
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    raw1mRef: React.RefObject<Raw1mData>
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    viewportRef: React.RefObject<ViewportState>
    runtimeRef: React.RefObject<ChartRuntime | null>
    setIsChangingTimeframe: (value: boolean) => void
}

export function useChartData({
    ticker,
    timeframe,
    chartReady,
    chartRef,
    seriesRef,
    candlesRef,
    candleMapRef,
    timesRef,
    raw1mRef,
    loadedWindowRef,
    totalFilesRef,
    viewportRef,
    runtimeRef,
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

            // const chartResult = await CandleService.getInitialWindow(ticker, timeframe, totalFiles)
            // const candles = chartResult.candles

            // // const rawResult = await CandleService.getInitialWindow(
            // //     ticker,
            // //     new Timeframe(1, TimeframeUnit.Minute),
            // //     totalFiles,
            // // )

            // const rawResult = await CandleService.getCandlesWindow(
            //     ticker,
            //     new Timeframe(1, TimeframeUnit.Minute),
            //     chartResult.oldestFile,
            //     chartResult.latestFile - chartResult.oldestFile + 1,
            // )

            // // setRaw1mData(raw1mRef, rawResult.candles)

            // setRaw1mData(raw1mRef, rawResult)

            // loadedWindowRef.current = {
            //     oldestFile: chartResult.oldestFile,
            //     latestFile: chartResult.latestFile,
            // }

            const result = await CandleService.getInitialChartAndRawWindow(ticker, timeframe, totalFiles)

            const candles = result.chartCandles

            setRaw1mData(raw1mRef, result.rawCandles)

            loadedWindowRef.current = result.loadedWindow

            applyChartData({
                candles,
                series,
                candlesRef,
                candleMapRef,
                timesRef,
                skipSeriesUpdate: replayStore.enabled,
            })

            runtimeRef.current?.onChartDataChanged()

            restoreViewport({
                chart,
                series,
                viewport: viewportRef,
            })

            if (replayStore.enabled) {
                const seconds = timeframe.toSeconds()

                replayStore.setChartTimeframeSeconds(seconds)
                replayStore.setUpdateIntervalSeconds(seconds)

                eventBus.emit('replayUpdateIntervalChanged', {
                    seconds,
                })

                eventBus.emit('replayPositionChanged')
            } else {
                restoreViewport({
                    chart,
                    series,
                    viewport: viewportRef,
                })
            }

            requestAnimationFrame(() => {
                setIsChangingTimeframe(false)
            })
        }

        load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, timeframe, chartReady])
}
