import { useEffect, useRef } from 'react'
import type { CandlestickData, ISeriesApi, IChartApi, Time } from 'lightweight-charts'

import { Timeframe } from '../../core/Timeframe'
import type { Candle } from '../../core/Candle'

import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'
import { CandleAggregator } from '../../data/CandleAggregator'

type Props = {
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
}

export function useReplaySync({ timeframe, chartRef, seriesRef, candlesRef, raw1mCandlesRef }: Props) {
    const previousCountRef = useRef<number>(0)

    useEffect(() => {
        const preserveViewport = (currentCount: number) => {
            const chart = chartRef.current

            if (!chart) {
                return
            }

            if (previousCountRef.current === 0) {
                previousCountRef.current = currentCount
                return
            }

            const addedBars = currentCount - previousCountRef.current

            previousCountRef.current = currentCount

            if (addedBars <= 0) {
                return
            }

            const range = chart.timeScale().getVisibleLogicalRange()

            if (!range) {
                return
            }

            chart.timeScale().setVisibleLogicalRange({
                from: range.from + addedBars,
                to: range.to + addedBars,
            })
        }

        const rebuildReplay = () => {
            const series = seriesRef.current

            if (!series) {
                return
            }

            const replayTime = replayStore.marketTime
            const replayStart = replayStore.startTime

            if (replayTime === null || replayStart === null) {
                return
            }

            const tfSeconds = timeframe.toSeconds()

            if (tfSeconds === 60) {
                const visible = candlesRef.current.filter((c) => Number(c.time) <= replayTime)

                series.setData(visible)

                preserveViewport(visible.length)

                return
            }

            const replayBucket = Math.floor(replayStart / tfSeconds) * tfSeconds
            const historical = candlesRef.current.filter((c) => Number(c.time) < replayBucket)
            const replay1m = raw1mCandlesRef.current.filter((c) => c.time >= replayBucket && c.time <= replayTime)
            const rebuilt = CandleAggregator.aggregate(replay1m, tfSeconds / 60)

            const finalData = [...historical, ...rebuilt].map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))

            series.setData(finalData)

            preserveViewport(finalData.length)
        }

        const unsubStart = eventBus.on('replayStart', () => {
            previousCountRef.current = 0
            rebuildReplay()
        })

        const unsubChange = eventBus.on('replayTimeChanged', ({ time }) => {
            replayStore.marketTime = time

            rebuildReplay()
        })

        return () => {
            unsubStart()
            unsubChange()
        }
    }, [timeframe, chartRef, seriesRef, candlesRef, raw1mCandlesRef])
}
