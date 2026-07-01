import { useEffect } from 'react'
import type { CandlestickData, Time, IChartApi, ISeriesApi } from 'lightweight-charts'
import { CandleService } from '../../core/CandleService'
import type { Candle } from '../../core/Candle'
import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import { TimeframeUnit } from '../../core/TimeframeUnit'
import { replayStore } from '../../replay/ReplayStore'
import { eventBus } from '../../event/EventBus'

type Params = {
    ticker: Ticker
    timeframe: Timeframe
    chartReady: boolean
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mCandlesRef: React.RefObject<Candle[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    oldestLoadedFileRef: React.RefObject<number>
    totalFilesRef: React.RefObject<number>
    candleCountRef: React.RefObject<number | null>
    spaceCountRef: React.RefObject<number | null>
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
    oldestLoadedFileRef,
    totalFilesRef,
    candleCountRef,
    spaceCountRef,
    setIsChangingTimeframe,
}: Params) {
    useEffect(() => {
        const load = async () => {
            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series || !chartReady) return

            const timeScale = chart.timeScale()

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

            const visible = candleCountRef.current ?? 0
            const whitespace = spaceCountRef.current ?? 0

            timeScale.setVisibleLogicalRange({
                from: formatted.length - visible,
                to: formatted.length + whitespace,
            })

            setIsChangingTimeframe(false)

            if (replayStore.enabled && replayStore.marketTime !== null) {
                eventBus.emit('replayTimeChanged', {
                    time: replayStore.marketTime,
                })
            }
        }

        load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticker, timeframe, chartReady])
}
