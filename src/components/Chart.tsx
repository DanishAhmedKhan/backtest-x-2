import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries, CrosshairMode, type IChartApi, type ISeriesApi } from 'lightweight-charts'
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

        const observer = new ResizeObserver(() => {
            if (!chartContainerRef.current || !chartRef.current) return

            const width = Math.floor(chartContainerRef.current.clientWidth)
            const height = Math.floor(chartContainerRef.current.clientHeight)

            chartRef.current.applyOptions({
                width,
                height,
            })
        })

        observer.observe(chartContainerRef.current)

        return () => {
            observer.disconnect()
            chart.remove()
        }
    }, [])

    useEffect(() => {
        console.log(ticker.toKey(), timeframe.toKey())

        const loadData = async () => {
            if (!seriesRef.current) return

            try {
                const raw = await CandleService.getCandles(ticker, timeframe)

                const formatted = raw.map((c) => ({
                    time: c.time as any,
                    open: c.open,
                    high: c.high,
                    low: c.low,
                    close: c.close,
                }))
                console.log('Candles count:', formatted.length)

                seriesRef.current.setData(formatted)

                chartRef.current?.timeScale().fitContent()
            } catch (e) {
                console.error('Error loading candle data.', e)
            }
        }

        loadData()
    }, [ticker, timeframe])

    return (
        <div
            ref={chartContainerRef}
            style={{
                display: 'block',
                width: '100%',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
            }}
        />
    )
}
