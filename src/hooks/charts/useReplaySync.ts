import { useEffect } from 'react'
import type { CandlestickData, ISeriesApi, IChartApi, Time } from 'lightweight-charts'

import { Timeframe } from '../../core/Timeframe'
import type { Candle } from '../../core/Candle'

import { restoreViewport } from '../utilities/viewport'
import { binarySearch } from '../../helper/binarySearch'

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

let isProcessingStep = false

export function useReplaySync({
    timeframe,
    chartRef,
    seriesRef,
    candlesRef,
    raw1mCandlesRef,
    raw1mTimesRef,
    viewportRef,
    replayViewportRef,
}: Props) {
    useEffect(() => {
        const rebuildReplay = (restore = false) => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series) {
                return
            }

            const replayTime = replayStore.marketTime
            const replayStart = replayStore.startTime

            if (replayTime === null || replayStart === null) {
                return
            }

            // const tfSeconds = replayStore.chartTimeframeSeconds
            const tfSeconds = timeframe.toSeconds()

            let replayCandles

            if (tfSeconds === 60) {
                replayCandles = candlesRef.current
                    .filter((c) => Number(c.time) <= replayTime)
                    .map((c) => ({
                        time: Number(c.time),
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                    }))
            } else {
                const replayBucket = Math.floor(replayStart / tfSeconds) * tfSeconds

                const historical = candlesRef.current
                    .filter((c) => Number(c.time) < replayBucket)
                    .map((c) => ({
                        time: Number(c.time),
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                    }))

                const replay1m = raw1mCandlesRef.current.filter((c) => c.time >= replayBucket && c.time <= replayTime)

                const rebuilt = CandleAggregator.aggregate(replay1m, tfSeconds / 60)

                replayCandles = [...historical, ...rebuilt]
            }

            const formatted: CandlestickData<Time>[] = replayCandles.map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))

            series.setData(formatted)

            restoreViewport({
                chart,
                series,
                viewport: restore ? replayViewportRef : viewportRef,
            })
        }

        function findNextAvailableTime(times: number[], target: number) {
            const { left } = binarySearch(times, target)

            return left < times.length ? times[left] : null
        }

        function findPreviousAvailableTime(times: number[], target: number) {
            const { right } = binarySearch(times, target)

            return right >= 0 ? times[right] : null
        }

        function moveReplay(direction: 1 | -1, finder: (times: number[], target: number) => number | null) {
            if (isProcessingStep) {
                rebuildReplay(false)
                return
            }

            const current = replayStore.marketTime

            if (current === null) {
                return
            }

            isProcessingStep = true

            let next: number | null

            if (replayStore.pendingStepSeconds !== null) {
                next = current + direction * replayStore.pendingStepSeconds
                replayStore.pendingStepSeconds = null
            } else {
                const desired = current + direction * replayStore.updateIntervalSeconds

                next = finder(raw1mTimesRef.current, desired)
            }

            if (next === null) {
                return
            }

            replayStore.marketTime = next

            rebuildReplay(false)

            setTimeout(() => {
                isProcessingStep = false
            }, 0)
        }

        const unsubStart = eventBus.on('replayStart', () => {
            rebuildReplay(true)
        })

        const unsubChange = eventBus.on('replayTimeChanged', ({ time }) => {
            replayStore.marketTime = time

            rebuildReplay(false)
        })

        const unsubForward = eventBus.on('replayForward', () => {
            console.log('f')
            moveReplay(1, findNextAvailableTime)
        })

        const unsubBackward = eventBus.on('replayBackward', () => {
            moveReplay(-1, findPreviousAvailableTime)
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
            unsubChange()
            unsubForward()
            unsubBackward()
            unsubStop()
        }
    }, [timeframe, chartRef, seriesRef, candlesRef, raw1mCandlesRef, viewportRef, replayViewportRef, raw1mTimesRef])
}
