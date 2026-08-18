import { useEffect } from 'react'
import type { CandlestickData, Time, IChartApi, ISeriesApi } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { CandleService } from '../../core/CandleService'
import type { ChartDataStatus, Raw1mData } from '../../components/Chart'

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
    displayedCandlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    raw1mRef: React.RefObject<Raw1mData>
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    viewportRef: React.RefObject<ViewportState>
    runtimeRef: React.RefObject<ChartRuntime | null>
    setChartDataStatus: React.Dispatch<React.SetStateAction<ChartDataStatus>>
    refreshPaneLayout: () => void
    setIsChangingTimeframe: (value: boolean) => void
}

export function useChartData({
    ticker,
    timeframe,
    chartReady,
    chartRef,
    seriesRef,
    candlesRef,
    displayedCandlesRef,
    candleMapRef,
    timesRef,
    raw1mRef,
    loadedWindowRef,
    totalFilesRef,
    viewportRef,
    runtimeRef,
    setChartDataStatus,
    refreshPaneLayout,
    setIsChangingTimeframe,
}: Params) {
    useEffect(() => {
        const load = async () => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series || !chartReady) {
                return
            }

            const setChartEmptyState = (empty: boolean) => {
                chart.applyOptions({
                    rightPriceScale: {
                        visible: !empty,
                    },
                    timeScale: {
                        visible: !empty,
                    },
                    grid: {
                        vertLines: {
                            visible: !empty,
                        },
                        horzLines: {
                            visible: !empty,
                        },
                    },
                })
            }

            setIsChangingTimeframe(true)
            setChartDataStatus('loading')
            setChartEmptyState(true)

            series.setData([])

            candlesRef.current = []
            displayedCandlesRef.current = []
            candleMapRef.current.clear()
            timesRef.current = []

            raw1mRef.current = {
                candles: [],
                times: [],
            }

            loadedWindowRef.current = {
                oldestFile: 0,
                latestFile: 0,
            }

            try {
                const totalFiles = await CandleService.getTotalFiles(ticker)
                totalFilesRef.current = totalFiles

                if (totalFiles === 0) {
                    setChartDataStatus('no-data')
                    return
                }

                const result = await CandleService.getInitialChartAndRawWindow(ticker, timeframe, totalFiles)

                setChartEmptyState(false)
                requestAnimationFrame(() => {
                    refreshPaneLayout()
                })

                setChartDataStatus('ready')

                loadedWindowRef.current = result.loadedWindow
                setRaw1mData(raw1mRef, result.rawCandles)

                applyChartData({
                    candles: result.chartCandles,
                    series,
                    candlesRef,
                    candleMapRef,
                    timesRef,
                    skipSeriesUpdate: replayStore.enabled,
                })

                displayedCandlesRef.current = result.chartCandles.map((c) => ({
                    time: c.time as Time,
                    open: c.open,
                    high: c.high,
                    low: c.low,
                    close: c.close,
                }))

                runtimeRef.current?.onChartDataChanged()

                eventBus.emit('chartDataChanged')

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
            } finally {
                requestAnimationFrame(() => {
                    setIsChangingTimeframe(false)
                })
            }
        }

        load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, timeframe, chartReady])
}
