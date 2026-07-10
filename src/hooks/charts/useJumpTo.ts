import { useEffect } from 'react'
import type { CandlestickData, IChartApi, ISeriesApi, Time } from 'lightweight-charts'

import { CandleService } from '../../core/CandleService'
import type { Candle } from '../../core/Candle'
import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'

import { eventBus } from '../../event/EventBus'
import { applyChartData } from '../utilities/applyChartData'

import type { LoadedWindow } from '../../components/Chart'
import { TimeframeUnit } from '../../core/TimeframeUnit'

type Params = {
    ticker: Ticker
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    loadedWindowRef: React.RefObject<LoadedWindow>
    candleCountRef: React.RefObject<number | null>
    spaceCountRef: React.RefObject<number | null>
}

export function useJumpTo({
    ticker,
    timeframe,
    chartRef,
    seriesRef,
    candlesRef,
    raw1mCandlesRef,
    candleMapRef,
    timesRef,
    loadedWindowRef,
    candleCountRef,
    spaceCountRef,
}: Params) {
    useEffect(() => {
        const unsubscribe = eventBus.on('jumpTo', async ({ timestamp }) => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series) {
                return
            }

            const chartResult = await CandleService.getCandlesAroundTime(ticker, timeframe, timestamp)

            const rawResult = await CandleService.getCandlesAroundTime(
                ticker,
                new Timeframe(1, TimeframeUnit.Minute),
                timestamp,
            )

            raw1mCandlesRef.current = rawResult.candles

            loadedWindowRef.current = chartResult.loadedWindow

            const barCount = applyChartData({
                candles: chartResult.candles,
                series,
                candlesRef,
                candleMapRef,
                timesRef,
            })

            let index = candlesRef.current.findIndex((c) => Number(c.time) >= timestamp)

            if (index === -1) {
                index = barCount - 1
            }

            const visible = candleCountRef.current ?? 200
            const whitespace = spaceCountRef.current ?? 10

            requestAnimationFrame(() => {
                chart.timeScale().setVisibleLogicalRange({
                    from: index - visible / 2,
                    to: index + visible / 2 + whitespace,
                })

                series.applyOptions({
                    autoscaleInfoProvider: () => null,
                })

                chart.timeScale().fitContent()
            })
        })

        return unsubscribe
    }, [
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        candleCountRef,
        spaceCountRef,
    ])
}
