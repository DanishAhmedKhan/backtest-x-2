import { useEffect, useRef, useState, memo } from 'react'
import {
    createChart,
    CandlestickSeries,
    CrosshairMode,
    type CandlestickData,
    type Time,
    type IChartApi,
    type ISeriesApi,
} from 'lightweight-charts'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { CandleService } from '../core/CandleService'
import { useViewportSync } from '../hooks/useViewportSync'
import { useCrosshairSync } from '../hooks/useCrosshairSync'
import { findNearestTime } from '../hooks/useNearestTime'

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

    const [isHovered, setIsHovered] = useState(false)

    const lastRightTimeRef = useViewportSync(chartRef, candlesRef)

    useEffect(() => {
        if (!containerRef.current) return

        const chart = createChart(containerRef.current, {
            layout: {
                background: { color: '#0f0f0f' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#1e1e1e' },
                horzLines: { color: '#1e1e1e' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                horzLine: { visible: false },
            },
            timeScale: {
                timeVisible: true,
                rightOffset: 10,
                rightBarStaysOnScroll: true,
            },
        })

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            borderVisible: false,
            priceFormat: { type: 'price', precision: 5, minMove: 0.00001 },
        })

        chartRef.current = chart
        seriesRef.current = series

        return () => chart.remove()
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
            if (!chart || !series) return

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

            timesRef.current = formatted.map((c) => Number(c.time))

            series.setData(formatted)

            const timeScale = chart.timeScale()

            const targetTime = lastRightTimeRef.current

            if (targetTime) {
                const nearest = findNearestTime(timesRef.current, targetTime)

                if (nearest) {
                    const index = timesRef.current.indexOf(nearest)

                    const barsToShow = 100

                    timeScale.setVisibleLogicalRange({
                        from: index - barsToShow,
                        to: index,
                    })

                    return
                }
            }

            timeScale.scrollToRealTime()
        }

        load()
    }, [lastRightTimeRef, ticker, timeframe])

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
