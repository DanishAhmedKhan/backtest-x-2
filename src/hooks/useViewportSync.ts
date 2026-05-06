import { useEffect, useRef } from 'react'
import type { IChartApi, Time, LogicalRange } from 'lightweight-charts'

export function useViewportSync(
    chartRef: React.RefObject<IChartApi | null>,
    candlesRef: React.RefObject<{ time: Time }[]>,
) {
    const lastRightTimeRef = useRef<number | null>(null)

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const timeScale = chart.timeScale()

        const handler = () => {
            const range: LogicalRange | null = timeScale.getVisibleLogicalRange()
            if (!range) return

            const candles = candlesRef.current
            if (!candles || !candles.length) return

            const rightIndex = Math.floor(range.to)

            if (rightIndex >= 0 && rightIndex < candles.length) {
                lastRightTimeRef.current = Number(candles[rightIndex].time)
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [candlesRef, chartRef])

    return lastRightTimeRef
}
