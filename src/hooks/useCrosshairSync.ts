import { useEffect } from 'react'
import type { IChartApi, ISeriesApi, Time, MouseEventParams, CandlestickData } from 'lightweight-charts'
import { eventBus } from '../event/EventBus'
import { findNearestTime } from './useNearestTime'

export function useCrosshairSync(
    id: string,
    chartRef: React.RefObject<IChartApi | null>,
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>,
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>,
    timesRef: React.RefObject<number[]>,
) {
    // EMIT
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const handler = (param: MouseEventParams<Time>) => {
            if (!param.time || typeof param.time !== 'number') {
                eventBus.emit('crosshairMove', { time: null, sourceId: id })
                return
            }

            eventBus.emit('crosshairMove', {
                time: param.time,
                sourceId: id,
            })
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

            const times = timesRef.current
            const candleMap = candleMapRef.current

            if (!times || !candleMap) return

            const nearestTime = findNearestTime(times, time)
            if (!nearestTime) return

            const candle = candleMap.get(nearestTime)
            if (!candle) return

            try {
                chart.setCrosshairPosition(candle.close, candle.time, series)
            } catch {
                chart.clearCrosshairPosition()
            }
        })

        return unsubscribe
    }, [candleMapRef, chartRef, id, seriesRef, timesRef])
}
