import { useEffect } from 'react'
import type { IChartApi, Time, CandlestickData } from 'lightweight-charts'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    rightOffsetRef: React.RefObject<number>
    visibleBarsRef: React.RefObject<number>
    isChangingTimeframeRef: React.RefObject<boolean>
    anchorTimeRef: React.RefObject<number | null>
    whitespaceRatioRef: React.RefObject<number | null>
    chartReady: boolean
}

export function useViewportSync({
    chartRef,
    candlesRef,
    rightOffsetRef,
    visibleBarsRef,
    isChangingTimeframeRef,
    anchorTimeRef,
    whitespaceRatioRef,
    chartReady,
}: Params) {
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

            const visibleWidth = range.to - range.from
            visibleBarsRef.current = Math.max(1, Math.round(visibleWidth))

            const rightmostCandleIndex = totalBars - 1
            const whitespaceBars = range.to - rightmostCandleIndex
            whitespaceRatioRef.current = whitespaceBars / visibleWidth

            const anchorIndex = Math.max(0, Math.min(totalBars - 1, Math.floor(rightmostCandleIndex)))
            const anchorCandle = candles[anchorIndex]

            if (anchorCandle) {
                anchorTimeRef.current = Number(anchorCandle.time)
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [
        chartRef,
        candlesRef,
        rightOffsetRef,
        visibleBarsRef,
        isChangingTimeframeRef,
        anchorTimeRef,
        chartReady,
        whitespaceRatioRef,
    ])
}
