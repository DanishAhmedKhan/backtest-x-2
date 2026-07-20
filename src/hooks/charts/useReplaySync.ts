import { useEffect } from 'react'
import type { CandlestickData, ISeriesApi, IChartApi, Time } from 'lightweight-charts'

import { Timeframe } from '../../core/Timeframe'
import type { Candle } from '../../core/Candle'

import { restoreViewport } from '../utilities/viewport'

import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'
import { CandleAggregator } from '../../data/CandleAggregator'
import type { ViewportState } from '../../types/Viewport'

type Props = {
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
    raw1mTimesRef: React.RefObject<number[]>
    viewportRef: React.RefObject<ViewportState>
    replayViewportRef: React.RefObject<ViewportState>
}

export function useReplaySync({ timeframe, chartRef, seriesRef, candlesRef, viewportRef, replayViewportRef }: Props) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series) {
            return
        }

        const tfSeconds = timeframe.toSeconds()

        const rebuildReplay = (restore = false) => {
            if (replayStore.startIndex === null || replayStore.displayIndex === null) {
                return
            }

            let replayCandles: Candle[] = []
            let historicalCandles: CandlestickData<Time>[] = []

            if (tfSeconds === 60) {
                replayCandles = replayStore.replayCandles
            } else {
                const replayBucket =
                    Math.floor(replayStore.raw1mCandles[replayStore.startIndex].time / tfSeconds) * tfSeconds

                historicalCandles = candlesRef.current.filter((c) => Number(c.time) < replayBucket)

                replayCandles = CandleAggregator.aggregateReplay(
                    replayStore.raw1mCandles,
                    replayStore.replayStartIndex!,
                    replayStore.displayIndex,
                    tfSeconds,
                )
            }

            const formatted: CandlestickData<Time>[] =
                tfSeconds === 60
                    ? replayCandles.map((c) => ({
                          time: c.time as Time,
                          open: c.open,
                          high: c.high,
                          low: c.low,
                          close: c.close,
                      }))
                    : [
                          ...historicalCandles,
                          ...replayCandles.map((c) => ({
                              time: c.time as Time,
                              open: c.open,
                              high: c.high,
                              low: c.low,
                              close: c.close,
                          })),
                      ]

            series.setData(formatted)

            restoreViewport({
                chart,
                series,
                viewport: restore ? replayViewportRef : viewportRef,
            })
        }

        const unsubStart = eventBus.on('replayStart', () => {
            rebuildReplay(true)
        })

        const unsubPositionChanged = eventBus.on('replayPositionChanged', () => {
            rebuildReplay(false)
        })

        const unsubStop = eventBus.on('replayStop', () => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series) {
                return
            }

            series.setData(candlesRef.current)

            restoreViewport({
                chart,
                series,
                viewport: viewportRef,
            })
        })

        return () => {
            unsubStart()
            unsubPositionChanged()
            unsubStop()
        }
    }, [timeframe, chartRef, seriesRef, candlesRef, viewportRef, replayViewportRef])
}
