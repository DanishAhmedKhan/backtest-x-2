import { useEffect, useRef } from 'react'
import {
    createChart,
    CandlestickSeries,
    CrosshairMode,
    type IChartApi,
    type CandlestickData,
    type ISeriesApi,
} from 'lightweight-charts'
import { candleData } from '../data/sampleData'
import { Ticker } from '../core/Ticker'
import type { Timeframe } from '../core/Timeframe'
import { CsvCandleLoader } from '../data/CsvCandleLoader'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
}

export default function Chart({ ticker, timeframe }: Props) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null)

    const fetchCandleData = async () => {
        try {
            const candleData2 = await CsvCandleLoader.loadData(ticker, timeframe)
            console.log('candleData', candleData2)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart: IChartApi = createChart(chartContainerRef.current, {
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

        const candleSeries = chart.addSeries(CandlestickSeries, {
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

        const loadData = async () => {
            try {
                const raw = await CsvCandleLoader.loadData(ticker, timeframe)

                const formatted = raw.map((c) => ({
                    time: c.time as any,
                    open: c.open,
                    high: c.high,
                    low: c.low,
                    close: c.close,
                }))

                candleSeries.setData(formatted)
            } catch (e) {
                console.error(e)
            }
        }

        loadData()

        return () => {
            chart.remove()
        }
    }, [ticker, timeframe])

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
            ref={chartContainerRef}
        />
    )
}
