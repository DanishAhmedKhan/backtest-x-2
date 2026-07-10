import type { CandlestickData, ISeriesApi, Time } from 'lightweight-charts'

import { CandleService } from '../../core/CandleService'
import { Ticker } from '../../core/Ticker'
import { Timeframe } from '../../core/Timeframe'
import type { LoadedWindow } from '../../components/Chart'

export type LoadAdjacentWindowResult = {
    loaded: boolean
    addedBars: number
}

type Params = {
    series: ISeriesApi<'Candlestick'>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    ticker: Ticker
    timeframe: Timeframe
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    direction: 'older' | 'newer'
}

export async function loadAdjacentWindow({
    series,
    candlesRef,
    candleMapRef,
    timesRef,
    ticker,
    timeframe,
    loadedWindowRef,
    totalFilesRef,
    direction,
}: Params): Promise<LoadAdjacentWindowResult> {
    let fileIndex: number

    if (direction === 'older') {
        if (loadedWindowRef.current.oldestFile <= 0) {
            return { loaded: false, addedBars: 0 }
        }

        fileIndex = loadedWindowRef.current.oldestFile - 1
    } else {
        if (loadedWindowRef.current.latestFile >= totalFilesRef.current - 1) {
            return { loaded: false, addedBars: 0 }
        }

        fileIndex = loadedWindowRef.current.latestFile + 1
    }

    const candles = await CandleService.getCandlesWindow(ticker, timeframe, fileIndex, 1)

    if (!candles.length) {
        return {
            loaded: false,
            addedBars: 0,
        }
    }

    const formatted: CandlestickData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
    }))

    if (direction === 'older') {
        candlesRef.current = [...formatted, ...candlesRef.current]
        loadedWindowRef.current.oldestFile = fileIndex
    } else {
        candlesRef.current = [...candlesRef.current, ...formatted]
        loadedWindowRef.current.latestFile = fileIndex
    }

    candleMapRef.current.clear()

    candlesRef.current.forEach((c) => {
        candleMapRef.current.set(Number(c.time), c)
    })

    timesRef.current = candlesRef.current.map((c) => Number(c.time))

    series.setData(candlesRef.current)

    return {
        loaded: true,
        addedBars: formatted.length,
    }
}
