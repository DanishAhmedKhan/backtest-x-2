import { useEffect } from 'react'
import type { CandlestickData, ISeriesApi, Time } from 'lightweight-charts'

import { Timeframe } from '../../core/Timeframe'
import type { Candle } from '../../core/Candle'

import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'
import { CandleAggregator } from '../../data/CandleAggregator'

type Props = {
    timeframe: Timeframe
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
}

export function useReplaySync({ timeframe, seriesRef, candlesRef, raw1mCandlesRef }: Props) {
    useEffect(() => {
        const rebuildReplay = () => {
            const series = seriesRef.current

            if (!series) {
                return
            }

            const replayTime = replayStore.currentReplayTime
            const replayStart = replayStore.startTime

            if (replayTime === null || replayStart === null) {
                return
            }

            const tfSeconds = timeframe.toSeconds()

            if (tfSeconds === 60) {
                const visible = candlesRef.current.filter((c) => Number(c.time) <= replayTime)

                series.setData(visible)

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
        }

        const handleReplayUpdate = (time: number) => {
            replayStore.currentReplayTime = time

            rebuildReplay()
        }

        const unsubStart = eventBus.on('replayStart', ({ time }) => handleReplayUpdate(time))

        const unsubChange = eventBus.on('replayTimeChanged', ({ time }) => handleReplayUpdate(time))

        return () => {
            unsubStart()
            unsubChange()
        }
    }, [timeframe, seriesRef, candlesRef, raw1mCandlesRef])
}
