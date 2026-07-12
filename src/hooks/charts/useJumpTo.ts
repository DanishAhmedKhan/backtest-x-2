import { useEffect } from 'react'
import type { CandlestickData, IChartApi, ISeriesApi, Time } from 'lightweight-charts'

import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { TimeframeUnit } from '../../core/TimeframeUnit'
import { CandleService } from '../../core/CandleService'
import type { Candle } from '../../core/Candle'

import { eventBus } from '../../event/EventBus'
import { applyChartData } from '../utilities/applyChartData'

import type { ViewportState } from '../../types/Viewport'
import type { LoadedWindow } from '../../types/LoadedWindow'
import { scrollViewportToBar } from '../utilities/viewport'

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
    viewportRef: React.RefObject<ViewportState>
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
    viewportRef,
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

            // const { visibleBars, rightOffset } = viewportRef.current

            // const to = index + rightOffset
            // const from = to - visibleBars + 1

            // requestAnimationFrame(() => {
            //     // this preserves that position
            //     // chart.timeScale().setVisibleLogicalRange({
            //     //     from,
            //     //     to,
            //     // })

            //     // This centers the candle in the chart
            //     chart.timeScale().setVisibleLogicalRange({
            //         from: index - visibleBars / 2,
            //         to: index + visibleBars / 2 + rightOffset,
            //     })

            //     series.applyOptions({
            //         autoscaleInfoProvider: () => null,
            //     })

            //     // chart.timeScale().fitContent()
            // })

            requestAnimationFrame(() => {
                scrollViewportToBar({
                    chart,
                    candles: candlesRef.current,
                    viewport: viewportRef,
                    barIndex: index,
                    align: 'center',
                })

                series.applyOptions({
                    autoscaleInfoProvider: () => null,
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
        raw1mCandlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        viewportRef,
    ])
}
