import { useEffect, useRef, useState } from 'react'
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi } from 'lightweight-charts'

import type { Ticker } from '../../core/Ticker'
import { TickerPriceFormat } from '../../core/TickerPriceFormat'

import { IndicatorRenderer } from '../../indicators/rendering/IndicatorRenderer'

import { DEFAULT_CHART_CONFIG } from '../../config/default/ChartConfig'
import { TIME_SERIES_CONFIG } from '../../config/default/TimeSeriesConfig'

type Params = {
    ticker: Ticker
    containerRef: React.RefObject<HTMLDivElement | null>
}

export function useChart({ ticker, containerRef }: Params) {
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
    const indicatorRendererRef = useRef<IndicatorRenderer | null>(null)

    const [chartReady, setChartReady] = useState(false)

    useEffect(() => {
        const container = containerRef.current

        if (!container) return

        const chart = createChart(container, DEFAULT_CHART_CONFIG)
        const series = chart.addSeries(CandlestickSeries, TIME_SERIES_CONFIG)

        chartRef.current = chart
        seriesRef.current = series

        indicatorRendererRef.current = new IndicatorRenderer(chart)

        setChartReady(true)

        return () => {
            indicatorRendererRef.current?.dispose()
            indicatorRendererRef.current = null

            chart.remove()

            chartRef.current = null
            seriesRef.current = null

            setChartReady(false)
        }
    }, [containerRef])

    useEffect(() => {
        const series = seriesRef.current

        if (!series) return

        series.applyOptions({
            priceFormat: TickerPriceFormat.getFormat(ticker),
        })
    }, [ticker])

    return {
        chartRef,
        seriesRef,
        indicatorRendererRef,
        chartReady,
    }
}
