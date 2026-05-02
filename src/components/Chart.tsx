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
                vertLine: {
                    width: 1,
                    color: '#9B7DFF',
                    labelBackgroundColor: '#000',
                },
                horzLine: {
                    width: 1,
                    color: '#9B7DFF',
                    labelBackgroundColor: '#000',
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        })

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            borderVisible: false,
            priceFormat: {
                type: 'price',
                precision: 5,
                minMove: 0.00001,
            },
        })

        chartRef.current = chart
        seriesRef.current = series

        return () => {
            chart.remove()
        }
    }, [])

    useEffect(() => {
        const loadInitial = async () => {
            if (!seriesRef.current) return

            const raw = await CandleService.getCandles(ticker, timeframe)

            const formatted = raw.map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))

            allCandlesRef.current = formatted

            fileIndexRef.current = 100 - 2

            seriesRef.current.setData(formatted)
            chartRef.current?.timeScale().fitContent()
        }

        loadInitial()
    }, [ticker, timeframe])

    const loadMore = useCallback(async () => {
        if (loadingRef.current) return
        loadingRef.current = true

        const chart = chartRef.current
        if (!chart) return

        const more = await CandleService.getOlderCandles(ticker, timeframe, fileIndexRef.current - 2, 2)

        fileIndexRef.current -= 2

        const formatted = more.map((c) => ({
            time: c.time as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }))

        const logicalRange = chart.timeScale().getVisibleLogicalRange()

        allCandlesRef.current = [...formatted, ...allCandlesRef.current]

        seriesRef.current?.setData(allCandlesRef.current)

        if (logicalRange) {
            chart.timeScale().setVisibleLogicalRange({
                from: logicalRange.from + formatted.length,
                to: logicalRange.to + formatted.length,
            })
        }

        loadingRef.current = false
    }, [ticker, timeframe])

    useEffect(() => {
        if (!chartRef.current) return

        const timeScale = chartRef.current.timeScale()

        const handler = async () => {
            const range = timeScale.getVisibleLogicalRange()
            if (!range) return

            if (range.from < 10) {
                console.log('Loading more...')
                await loadMore()
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [loadMore])

    return (
        <div
            ref={chartContainerRef}
            style={{
                width: '100%',
                height: '100%',
            }}
        />
    )
}
