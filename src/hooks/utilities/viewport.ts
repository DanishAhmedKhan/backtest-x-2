import type React from 'react'
import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import type { ViewportState } from '../../types/Viewport'

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

    const renderedBars = series.data()

    if (renderedBars.length === 0) {
        return
    }

    const lastIndex = renderedBars.length - 1

    const visibleBars = Math.max(1, range.to - range.from + 1)

    if (range.to > lastIndex) {
        viewport.current = {
            visibleBars,
            rightWhitespace: range.to - lastIndex,
            barsAfterViewport: 0,
        }
    } else {
        viewport.current = {
            visibleBars,
            rightWhitespace: 0,
            barsAfterViewport: lastIndex - range.to,
        }
    }
}

export function restoreViewport({
    chart,
    series,
    viewport,
}: {
    chart: IChartApi
    series: ISeriesApi<'Candlestick'>
    viewport: React.RefObject<ViewportState>
}) {
    const renderedBars = series.data()

    if (renderedBars.length === 0) {
        return
    }

    const lastIndex = renderedBars.length - 1

    let to: number

    if (viewport.current.rightWhitespace > 0) {
        to = lastIndex + viewport.current.rightWhitespace
    } else {
        to = lastIndex - viewport.current.barsAfterViewport
    }

    const desiredFrom = to - viewport.current.visibleBars + 1

    if (desiredFrom < 0) {
        const leftPadding = -desiredFrom

        chart.timeScale().setVisibleLogicalRange({
            from: -leftPadding,
            to: viewport.current.visibleBars - leftPadding - 1,
        })

        return
    }

    chart.timeScale().setVisibleLogicalRange({
        from: desiredFrom,
        to,
    })
}

export function scrollViewportToBar({
    chart,
    series,
    viewport,
    barIndex,
    align = 'center',
}: {
    chart: IChartApi
    series: ISeriesApi<'Candlestick'>
    viewport: React.RefObject<ViewportState>
    barIndex: number
    align?: 'center' | 'right'
}) {
    if (series.data().length === 0) {
        return
    }

    const { visibleBars, rightWhitespace } = viewport.current

    let from: number
    let to: number

    if (align === 'center') {
        from = barIndex - visibleBars / 2
        to = from + visibleBars - 1 + rightWhitespace
    } else {
        to = barIndex + rightWhitespace
        from = to - visibleBars + 1
    }

    chart.timeScale().setVisibleLogicalRange({
        from,
        to,
    })
}

export function shiftViewport({ chart, bars }: { chart: IChartApi; bars: number }) {
    if (bars <= 0) {
        return
    }

    const range = chart.timeScale().getVisibleLogicalRange()

    if (!range) {
        return
    }

    chart.timeScale().setVisibleLogicalRange({
        from: range.from + bars,
        to: range.to + bars,
    })
}
