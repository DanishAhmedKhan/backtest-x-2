import { useEffect } from 'react'
import type { IChartApi, Time, CandlestickData } from 'lightweight-charts'

export function useViewportSync(
    chartRef: React.RefObject<IChartApi | null>,
    candlesRef: React.RefObject<CandlestickData<Time>[]>,
    rightOffsetRef: React.RefObject<number>,
    visibleBarsRef: React.RefObject<number>,
    isChangingTimeframeRef: React.RefObject<boolean>,
    anchorTimeRef: React.RefObject<number | null>,
    chartReady: boolean,
) {
    useEffect(() => {
        const chart = chartRef.current
        if (!chart || !chartReady) return

        const timeScale = chart.timeScale()

        const handler = () => {
            if (isChangingTimeframeRef.current) return

            const range = timeScale.getVisibleLogicalRange()
            const candles = candlesRef.current

            if (!range || !candles.length) return

            const totalBars = candles.length

            const calculatedOffset = totalBars - 1 - range.to
            rightOffsetRef.current = Math.round(calculatedOffset)

            const totalScreenSlots = range.to - range.from
            const visibleCandlesCount = totalScreenSlots - timeScale.options().rightOffset
            visibleBarsRef.current = Math.max(1, Math.round(visibleCandlesCount))

            const rightCandleIndex = Math.max(
                0,
                Math.min(totalBars - 1, Math.floor(range.to - timeScale.options().rightOffset)),
            )
            const targetRightCandle = candles[rightCandleIndex]

            if (targetRightCandle) {
                anchorTimeRef.current = Number(targetRightCandle.time)
            }

            // console.log('=== TRADINGVIEW VIEWPORT SYNCHRONIZED ===')
            // console.log('Live Calculated Offset:', rightOffsetRef.current)
            // console.log('Live Visible Candles (Clamped):', visibleBarsRef.current)
            // console.log('Anchor Time:', new Date((anchorTimeRef.current || 0) * 1000).toUTCString())
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [chartRef, candlesRef, rightOffsetRef, visibleBarsRef, isChangingTimeframeRef, anchorTimeRef, chartReady])
}
