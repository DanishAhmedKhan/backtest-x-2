import { useEffect } from 'react'
import type { IChartApi, ISeriesApi, Time, MouseEventParams, CandlestickData } from 'lightweight-charts'
import { eventBus } from '../../event/EventBus'
import { findNearestTime } from '../utilities/findNearestTime'
import { replayStore } from '../../replay/ReplayStore'

type Props = {
    id: string
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
}

export function useCrosshairSync({ id, chartRef, seriesRef, candleMapRef, timesRef }: Props) {
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const handler = (param: MouseEventParams<Time>) => {
            const time = typeof param.time === 'number' ? param.time : null

            eventBus.emit('crosshairMove', {
                time,
                sourceId: id,
            })

            if (!replayStore.isSelecting) {
                return
            }

            replayStore.previewTime = time

            if (time !== null) {
                eventBus.emit('replayPreviewMove', {
                    time,
                })
            }
        }

        chart.subscribeCrosshairMove(handler)

        return () => {
            chart.unsubscribeCrosshairMove(handler)
        }
    }, [chartRef, id])

    useEffect(() => {
        const unsubscribe = eventBus.on('crosshairMove', ({ time, sourceId }) => {
            if (sourceId === id) return

            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series) return

            if (!time) {
                chart.clearCrosshairPosition()
                return
            }

            const nearestTime = findNearestTime(timesRef.current, time)
            if (!nearestTime) return

            const candle = candleMapRef.current.get(nearestTime)
            if (!candle) return

            try {
                chart.setCrosshairPosition(candle.close, candle.time, series)
            } catch {
                chart.clearCrosshairPosition()
            }
        })

        return unsubscribe
    }, [chartRef, id, seriesRef, candleMapRef, timesRef])
}
