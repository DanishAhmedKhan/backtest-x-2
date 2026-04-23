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

export default function Chart() {
    const chartContainerRef = useRef<HTMLDivElement | null>(null)

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
                // vertLine: {
                //     visible: true,
                //     labelVisible: true,
                //     width: 1,
                // },
                // horzLine: {
                //     visible: true,
                //     labelVisible: true,
                //     width: 1,
                // },
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

        const candleSeries: ISeriesApi<'Candlestick'> = chart.addSeries(CandlestickSeries, {
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

        candleSeries.setData(candleData as CandlestickData[])

        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current!.clientWidth,
            })
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [])

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
