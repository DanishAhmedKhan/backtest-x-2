import { useEffect } from 'react'
import type { IChartApi, Time, CandlestickData } from 'lightweight-charts'

export function useViewportSync(
    chartRef: React.RefObject<IChartApi | null>,
    candlesRef: React.RefObject<CandlestickData<Time>[]>,
    rightOffsetRef: React.RefObject<number>,
    visibleBarsRef: React.RefObject<number>,
) {
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const timeScale = chart.timeScale()

        const handler = () => {
            const range = timeScale.getVisibleLogicalRange()
            const candles = candlesRef.current

            if (!range || !candles.length) return

            const totalBars = candles.length

            visibleBarsRef.current = range.to - range.from
            rightOffsetRef.current = totalBars - range.to
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [chartRef, candlesRef, rightOffsetRef, visibleBarsRef])
}
