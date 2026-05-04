import { useEffect, useRef, useCallback } from 'react'
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

type Props = {
    ticker: Ticker
    timeframe: Timeframe
}

export default function Chart({ ticker, timeframe }: Props) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    const allCandlesRef = useRef<CandlestickData<Time>[]>([])
    const fileIndexRef = useRef<number>(0)

    const loadingRef = useRef(false)
    const lastLoadRef = useRef(0)

    const LOAD_COOLDOWN = 500

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            autoSize: true,
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
            },
            timeScale: {
                timeVisible: true,
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
        const loadInitial = async () => {
            if (!seriesRef.current) return

            const raw = await CandleService.getCandles(ticker, timeframe)

            const formatted: CandlestickData<Time>[] = raw.map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))

            allCandlesRef.current = formatted

            const totalFiles = await CandleService.getTotalFiles(ticker)
            fileIndexRef.current = totalFiles - 2

            seriesRef.current.setData(formatted)

            const chart = chartRef.current
            if (!chart) return

            chart.timeScale().scrollToRealTime()
        }

        loadInitial()
    }, [ticker, timeframe])

    const loadMore = useCallback(async () => {
        const now = Date.now()

        if (loadingRef.current) return
        if (now - lastLoadRef.current < LOAD_COOLDOWN) return
        if (fileIndexRef.current <= 0) {
            return
        }

        loadingRef.current = true
        lastLoadRef.current = now

        const chart = chartRef.current
        if (!chart) return

        const start = fileIndexRef.current - 2

        if (start < 0) {
            loadingRef.current = false
            return
        }

        const more = await CandleService.getOlderCandles(ticker, timeframe, start, 2)

        if (!more.length) {
            loadingRef.current = false
            return
        }

        fileIndexRef.current = start

        const formatted: CandlestickData<Time>[] = more.map((c) => ({
            time: c.time as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }))

        formatted.sort((a, b) => Number(a.time) - Number(b.time))

        const logicalRange = chart.timeScale().getVisibleLogicalRange()

        const merged = [...formatted, ...allCandlesRef.current]

        const map = new Map<number, CandlestickData<Time>>()
        for (const c of merged) {
            map.set(Number(c.time), c)
        }

        allCandlesRef.current = Array.from(map.values()).sort((a, b) => Number(a.time) - Number(b.time))

        seriesRef.current.setData(allCandlesRef.current)

        if (logicalRange) {
            chart.timeScale().setVisibleLogicalRange({
                from: logicalRange.from + formatted.length,
                to: logicalRange.to + formatted.length,
            })
        }

        loadingRef.current = false
    }, [ticker, timeframe])

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const timeScale = chart.timeScale()

        const handler = async () => {
            const range = timeScale.getVisibleLogicalRange()
            if (!range) return

            const barsBefore = range.from

            if (barsBefore < 30 && !loadingRef.current) {
                await loadMore()
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [loadMore])

    return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
}
