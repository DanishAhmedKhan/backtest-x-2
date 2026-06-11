import { useEffect } from 'react'
import type { CandlestickData, Time, IChartApi, ISeriesApi } from 'lightweight-charts'
import { CandleService } from '../../core/CandleService'
import type { Candle } from '../../core/Candle'
import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { TimeframeUnit } from '../../core/TimeframeUnit'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean

    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>

    candlesRef: React.RefObject<CandlestickData<Time>[]>

    // IMPORTANT
    raw1mCandlesRef: React.RefObject<Candle[]>

    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>

    rightOffsetRef: React.RefObject<number>
    visibleBarsRef: React.RefObject<number>
    anchorTimeRef: React.RefObject<number | null>
    whitespaceRatioRef: React.RefObject<number>

    oldestLoadedFileRef: React.RefObject<number>
    totalFilesRef: React.RefObject<number>

    setIsChangingTimeframe: (value: boolean) => void
}

export function useChartData({
    ticker,
    timeframe,
    chartReady,

    chartRef,
    seriesRef,

    candlesRef,
    raw1mCandlesRef,

    candleMapRef,
    timesRef,

    rightOffsetRef,
    visibleBarsRef,
    anchorTimeRef,
    whitespaceRatioRef,

    oldestLoadedFileRef,
    totalFilesRef,

    setIsChangingTimeframe,
}: Props) {
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

            setIsChangingTimeframe(true)

            const candles = await CandleService.getCandles(ticker, timeframe)
            raw1mCandlesRef.current = await CandleService.getCandles(ticker, new Timeframe(1, TimeframeUnit.Minute))

            const totalFiles = await CandleService.getTotalFiles(ticker)

            totalFilesRef.current = totalFiles
            oldestLoadedFileRef.current = Math.max(0, totalFiles - 2)

            const formatted: CandlestickData<Time>[] = candles.map((c) => ({
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

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!formatted.length) {
                        setIsChangingTimeframe(false)
                        return
                    }

                    let targetRight = formatted.length - 1

                    if (savedAnchorTime !== null) {
                        const idx = timesRef.current.findIndex((t) => t >= savedAnchorTime)

                        if (idx !== -1) {
                            targetRight = idx
                        }
                    }

                    let finalTo = targetRight - savedOffset

                    let finalFrom = finalTo - savedVisibleBars

                    if (savedVisibleBars <= 5) {
                        const ratio = 1 - savedRatio

                        if (ratio > 0) {
                            const total = savedVisibleBars / ratio

                            finalTo = targetRight + Math.round(total * savedRatio)

                            finalFrom = finalTo - Math.round(total)
                        }
                    }

                    timeScale.setVisibleLogicalRange({
                        from: finalFrom,
                        to: finalTo,
                    })

                    setTimeout(() => {
                        setIsChangingTimeframe(false)
                    }, 60)
                })
            })
        }

        load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, timeframe, chartReady])
}
