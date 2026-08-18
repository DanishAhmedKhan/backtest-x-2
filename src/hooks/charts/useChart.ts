import { useEffect, useRef, useState } from 'react'
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi } from 'lightweight-charts'

import { DEFAULT_CHART_CONFIG } from '../../config/default/ChartConfig'
import { TIME_SERIES_CONFIG } from '../../config/default/TimeSeriesConfig'
import { IndicatorRenderer } from '../../indicators/rendering/IndicatorRenderer'

export function useChart(containerRef: React.RefObject<HTMLDivElement | null>) {
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

    return {
        chartRef,
        seriesRef,
        indicatorRendererRef,
        chartReady,
    }
}
