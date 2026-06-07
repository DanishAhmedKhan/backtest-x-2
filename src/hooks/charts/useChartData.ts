import { useEffect } from 'react'
import type { CandlestickData, Time, IChartApi, ISeriesApi } from 'lightweight-charts'
import { CandleService } from '../../core/CandleService'
import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean

    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>

    candlesRef: React.RefObject<CandlestickData<Time>[]>
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

            if (!chart || !series || !chartReady) {
                return
            }

            const timeScale = chart.timeScale()

            const savedOffset = rightOffsetRef.current
            const savedVisibleBars = visibleBarsRef.current
            const savedAnchorTime = anchorTimeRef.current
            const savedRatio = whitespaceRatioRef.current

            setIsChangingTimeframe(true)

            const raw = await CandleService.getCandles(ticker, timeframe)

            const totalFiles = await CandleService.getTotalFiles(ticker)

            totalFilesRef.current = totalFiles

            oldestLoadedFileRef.current = Math.max(0, totalFiles - 2)

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
                        setIsChangingTimeframe(false)
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
                        setIsChangingTimeframe(false)
                    }, 60)
                })
            })
        }

        load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, timeframe, chartReady])
}
