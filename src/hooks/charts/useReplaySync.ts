import { useEffect, useRef } from 'react'
import type { CandlestickData, ISeriesApi, IChartApi, Time } from 'lightweight-charts'

import { Timeframe } from '../../core/Timeframe'
import type { Candle } from '../../core/Candle'

import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'
import { CandleAggregator } from '../../data/CandleAggregator'
import { restoreViewport } from '../utilities/viewport'
import type { ViewportState } from '../../types/Viewport'

type Props = {
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
    viewportRef: React.RefObject<ViewportState>
    replayViewportRef: React.RefObject<ViewportState>
}

// export function useReplaySync({
//     timeframe,
//     chartRef,
//     seriesRef,
//     candlesRef,
//     raw1mCandlesRef,
//     viewportRef,
//     replayViewportRef,
// }: Props) {
//     useEffect(() => {
//         const rebuildReplay = (restore = false) => {
//             const chart = chartRef.current
//             const series = seriesRef.current

//             if (!chart || !series) {
//                 return
//             }

//             const replayTime = replayStore.marketTime
//             const replayStart = replayStore.startTime

//             if (replayTime === null || replayStart === null) {
//                 return
//             }

//             const tfSeconds = replayStore.chartTimeframeSeconds

//             let replayCandles

//             if (tfSeconds === 60) {
//                 replayCandles = candlesRef.current
//                     .filter((c) => Number(c.time) <= replayTime)
//                     .map((c) => ({
//                         time: Number(c.time),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))
//             } else {
//                 const replayBucket = Math.floor(replayStart / tfSeconds) * tfSeconds

//                 const historical = candlesRef.current
//                     .filter((c) => Number(c.time) < replayBucket)
//                     .map((c) => ({
//                         time: Number(c.time),
//                         open: c.open,
//                         high: c.high,
//                         low: c.low,
//                         close: c.close,
//                     }))

//                 const replay1m = raw1mCandlesRef.current.filter((c) => c.time >= replayBucket && c.time <= replayTime)

//                 const rebuilt = CandleAggregator.aggregate(replay1m, tfSeconds / 60)

//                 replayCandles = [...historical, ...rebuilt]
//             }

//             const formatted: CandlestickData<Time>[] = replayCandles.map((c) => ({
//                 time: c.time as Time,
//                 open: c.open,
//                 high: c.high,
//                 low: c.low,
//                 close: c.close,
//             }))

//             series.setData(formatted)

//             restoreViewport({
//                 chart,
//                 series,
//                 viewport: restore ? replayViewportRef : viewportRef,
//             })
//         }
//         const unsubStart = eventBus.on('replayStart', () => {
//             rebuildReplay(true)
//         })

//         const unsubChange = eventBus.on('replayTimeChanged', ({ time }) => {
//             replayStore.marketTime = time

//             rebuildReplay(false)
//         })

//         return () => {
//             unsubStart()
//             unsubChange()
//         }
//     }, [timeframe, chartRef, seriesRef, candlesRef, raw1mCandlesRef, viewportRef, replayViewportRef])
// }

export function useReplaySync({
    timeframe,
    chartRef,
    seriesRef,
    candlesRef,
    raw1mCandlesRef,
    viewportRef,
    replayViewportRef,
}: Props) {
    const lastReplayBarRef = useRef<CandlestickData<Time> | null>(null)

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

            const tfSeconds = replayStore.chartTimeframeSeconds

            // -------------------------------------------------------
            // Replay start -> build entire replay history once
            // -------------------------------------------------------
            if (restore) {
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

                    const replay1m = raw1mCandlesRef.current.filter(
                        (c) => c.time >= replayBucket && c.time <= replayTime,
                    )

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

                lastReplayBarRef.current = formatted.at(-1) ?? null

                restoreViewport({
                    chart,
                    series,
                    viewport: replayViewportRef,
                })

                return
            }

            // -------------------------------------------------------
            // Replay update -> update only last candle
            // -------------------------------------------------------

            let latestBar: CandlestickData<Time>

            if (tfSeconds === 60) {
                const candle = candlesRef.current.find((c) => Number(c.time) === replayTime)

                if (!candle) {
                    return
                }

                latestBar = {
                    time: candle.time,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                }
            } else {
                const replayBucket = Math.floor(replayStart / tfSeconds) * tfSeconds

                const replay1m = raw1mCandlesRef.current.filter((c) => c.time >= replayBucket && c.time <= replayTime)

                const rebuilt = CandleAggregator.aggregate(replay1m, tfSeconds / 60)

                const candle = rebuilt.at(-1)

                if (!candle) {
                    return
                }

                latestBar = {
                    time: candle.time as Time,
                    open: candle.open,
                    high: candle.high,
                    low: candle.low,
                    close: candle.close,
                }
            }

            series.update(latestBar)

            lastReplayBarRef.current = latestBar

            restoreViewport({
                chart,
                series,
                viewport: restore ? replayViewportRef : viewportRef,
            })
        }

        const unsubStart = eventBus.on('replayStart', () => {
            rebuildReplay(true)
        })

        const unsubChange = eventBus.on('replayTimeChanged', ({ time }) => {
            replayStore.marketTime = time

            rebuildReplay(false)
        })

        return () => {
            unsubStart()
            unsubChange()
        }
    }, [timeframe, chartRef, seriesRef, candlesRef, raw1mCandlesRef, viewportRef, replayViewportRef])
}
