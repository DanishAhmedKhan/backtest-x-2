import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import type { ViewportState } from '../../types/Viewport'
import type React from 'react'

export function captureViewport({
    chart,
    series,
    viewport,
}: {
    chart: IChartApi
    series: ISeriesApi<'Candlestick'>
    viewport: React.RefObject<ViewportState>
}) {
    const range = chart.timeScale().getVisibleLogicalRange()

    if (!range) {
        return
    }

    const lastBarIndex = series.data().length - 1

    viewport.current = {
        visibleBars: range.to - range.from + 1,
        rightOffset: range.to - lastBarIndex,
    }
}

export function restoreViewport({
    chart,
    viewport,
    barCount,
}: {
    chart: IChartApi
    viewport: React.RefObject<ViewportState>
    barCount: number
}) {
    const lastIndex = barCount - 1

    const to = lastIndex + viewport.current.rightOffset
    const from = to - viewport.current.visibleBars + 1

    chart.timeScale().setVisibleLogicalRange({
        from,
        to,
    })
}

export function scrollViewportToBar({
    chart,
    viewport,
    barIndex,
}: {
    chart: IChartApi
    viewport: React.RefObject<ViewportState>
    barIndex: number
}) {
    const to = barIndex + viewport.current.rightOffset

    const from = to - viewport.current.visibleBars + 1

    chart.timeScale().setVisibleLogicalRange({
        from,
        to,
    })
}
