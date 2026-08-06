import { useEffect } from 'react'
import type { CandlestickData, IChartApi, ISeriesApi, Time } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { CandleService } from '../../core/CandleService'
import type { Raw1mData } from '../../components/Chart'

import { eventBus } from '../../event/EventBus'
import { applyChartData } from '../utilities/applyChartData'

import type { ViewportState } from '../../types/Viewport'
import type { LoadedWindow } from '../../types/LoadedWindow'
import { scrollViewportToTime } from '../utilities/viewport'
import { setRaw1mData } from '../utilities/setRaw1mData'

type Params = {
    ticker: Ticker
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mRef: React.RefObject<Raw1mData>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    loadedWindowRef: React.RefObject<LoadedWindow>
    viewportRef: React.RefObject<ViewportState>
}

export function useJumpTo({
    ticker,
    timeframe,
    chartRef,
    seriesRef,
    candlesRef,
    raw1mRef,
    candleMapRef,
    timesRef,
    loadedWindowRef,
    viewportRef,
}: Params) {
    useEffect(() => {
        const unsubscribe = eventBus.on('jumpTo', async ({ timestamp }) => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series) return

            // const chartResult = await CandleService.getCandlesAroundTime(ticker, timeframe, timestamp)

            // const rawResult = await CandleService.getCandlesAroundTime(
            //     ticker,
            //     new Timeframe(1, TimeframeUnit.Minute),
            //     timestamp,
            // )

            // setRaw1mData(raw1mRef, rawResult.candles)

            // loadedWindowRef.current = chartResult.loadedWindow

            // applyChartData({
            //     candles: chartResult.candles,
            //     series,
            //     candlesRef,
            //     candleMapRef,
            //     timesRef,
            // })

            const result = await CandleService.getChartAndRawCandlesAroundTime(ticker, timeframe, timestamp)

            setRaw1mData(raw1mRef, result.rawCandles)

            loadedWindowRef.current = result.loadedWindow

            applyChartData({
                candles: result.chartCandles,
                series,
                candlesRef,
                candleMapRef,
                timesRef,
            })

            requestAnimationFrame(() => {
                scrollViewportToTime({
                    chart,
                    series,
                    viewport: viewportRef,
                    timestamp,
                    align: 'center',
                })

                chart.priceScale('right').applyOptions({
                    autoScale: true,
                })
            })
        })

        return unsubscribe
    }, [
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        viewportRef,
        raw1mRef,
    ])
}
