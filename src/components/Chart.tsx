import { useEffect, useRef, useState, memo } from 'react'
import {
    createChart,
    CandlestickSeries,
    type CandlestickData,
    type Time,
    type IChartApi,
    type ISeriesApi,
} from 'lightweight-charts'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { CandleService } from '../core/CandleService'

import { useViewportSync } from '../hooks/charts/useViewportSync'
import { useCrosshairSync } from '../hooks/charts/useCrosshairSync'
import { DEFAULT_CHART_CONFIG } from '../config/default/ChartConfig'
import { TIME_SERIES_CONFIG } from '../config/default/TimeSeriesConfig'

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const rightOffsetRef = useRef<number>(10)
    const visibleBarsRef = useRef<number>(100)
    const anchorTimeRef = useRef<number | null>(null)

    const whitespaceRatioRef = useRef<number>(0.1)

    const isChangingTimeframe = useRef<boolean>(false)
    const [isHovered, setIsHovered] = useState(false)
    const [chartReady, setChartReady] = useState<boolean>(false)

    useViewportSync(
        chartRef,
        candlesRef,
        rightOffsetRef,
        visibleBarsRef,
        isChangingTimeframe,
        anchorTimeRef,
        whitespaceRatioRef,
        chartReady,
    )

    useEffect(() => {
        if (!containerRef.current) return

        const chartConfig = DEFAULT_CHART_CONFIG
        chartConfig.timeScale.rightOffset = rightOffsetRef.current
        const chart = createChart(containerRef.current, chartConfig)

        const timeSeriesConfig = TIME_SERIES_CONFIG
        const series = chart.addSeries(CandlestickSeries, timeSeriesConfig)

        chartRef.current = chart
        seriesRef.current = series
        setChartReady(true)

        return () => {
            chart.remove()
            setChartReady(false)
        }
    }, [])

    useEffect(() => {
        const chart = chartRef.current
        const el = containerRef.current
        if (!chart || !el) return

        const resize = () => {
            chart.applyOptions({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        const observer = new ResizeObserver(resize)
        observer.observe(el)
        resize()

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        chartRef.current?.applyOptions({
            crosshair: {
                horzLine: { visible: isHovered },
            },
        })
    }, [isHovered])

    useCrosshairSync(id, chartRef, seriesRef, candleMapRef, timesRef)

    useEffect(() => {
        const load = async () => {
            const chart = chartRef.current
            const series = seriesRef.current
            if (!chart || !series || !chartReady) return

            const timeScale = chart.timeScale()

            const savedOffset = rightOffsetRef.current
            const savedVisibleBars = visibleBarsRef.current
            const savedAnchorTime = anchorTimeRef.current
            const savedRatio = whitespaceRatioRef.current

            isChangingTimeframe.current = true

            const raw = await CandleService.getCandles(ticker, timeframe)

            const formatted: CandlestickData<Time>[] = raw.map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))

            candlesRef.current = formatted
            candleMapRef.current.clear()
            formatted.forEach((c) => {
                candleMapRef.current.set(Number(c.time), c)
            })

            const newTimes = formatted.map((c) => Number(c.time))
            timesRef.current = newTimes

            series.setData(formatted)

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (formatted.length === 0) {
                        isChangingTimeframe.current = false
                        return
                    }

                    let targetRightIndex = formatted.length - 1

                    if (savedAnchorTime !== null && newTimes.length > 0) {
                        const exactMatchIndex = newTimes.findIndex((t) => t >= savedAnchorTime)
                        if (exactMatchIndex !== -1) {
                            targetRightIndex = exactMatchIndex
                        }
                    }

                    let finalTo = targetRightIndex - savedOffset
                    let finalFrom = finalTo - savedVisibleBars

                    if (savedVisibleBars <= 5) {
                        const dataRatio = 1 - savedRatio
                        if (dataRatio > 0) {
                            const calculatedTotalSlots = savedVisibleBars / dataRatio
                            const adjustedOffset = Math.round(calculatedTotalSlots * savedRatio)

                            finalTo = targetRightIndex + adjustedOffset
                            finalFrom = finalTo - Math.round(calculatedTotalSlots)
                        }
                    }

                    timeScale.setVisibleLogicalRange({
                        from: finalFrom,
                        to: finalTo,
                    })

                    setTimeout(() => {
                        isChangingTimeframe.current = false
                    }, 60)
                })
            })
        }

        load()
    }, [ticker, timeframe, chartReady])

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: '100%', height: '100%' }}
        />
    )
}

export default memo(Chart)
