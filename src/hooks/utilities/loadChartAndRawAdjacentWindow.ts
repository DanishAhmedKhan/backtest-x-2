import type { CandlestickData, ISeriesApi, Time } from 'lightweight-charts'

import type { Ticker } from '../../core/Ticker'
import type { Timeframe } from '../../core/Timeframe'
import { CandleService } from '../../core/CandleService'

import type { Raw1mData } from '../../components/Chart'
import type { LoadedWindow } from '../../types/LoadedWindow'
import { setRaw1mData } from './setRaw1mData'

import { replayStore } from '../../replay/ReplayStore'

type Params = {
    series: ISeriesApi<'Candlestick'>
    candlesRef: React.RefObject<CandlestickData<Time>[]>
    raw1mRef: React.RefObject<Raw1mData>
    candleMapRef: React.RefObject<Map<number, CandlestickData<Time>>>
    timesRef: React.RefObject<number[]>
    ticker: Ticker
    timeframe: Timeframe
    loadedWindowRef: React.RefObject<LoadedWindow>
    totalFilesRef: React.RefObject<number>
    direction: 'older' | 'newer'
    fileCount: number
}

export type LoadAdjacentWindowResult = {
    loaded: boolean
    addedBars: number
}

export async function loadChartAndRawAdjacentWindow({
    series,
    candlesRef,
    raw1mRef,
    candleMapRef,
    timesRef,
    ticker,
    timeframe,
    loadedWindowRef,
    totalFilesRef,
    direction,
    fileCount,
}: Params): Promise<LoadAdjacentWindowResult> {
    let startIndex: number
    let actualFileCount: number

    if (direction === 'older') {
        if (loadedWindowRef.current.oldestFile <= 0) {
            return {
                loaded: false,
                addedBars: 0,
            }
        }

        actualFileCount = Math.min(fileCount, loadedWindowRef.current.oldestFile)
        startIndex = loadedWindowRef.current.oldestFile - actualFileCount
    } else {
        const remaining = totalFilesRef.current - loadedWindowRef.current.latestFile - 1

        if (remaining <= 0) {
            return {
                loaded: false,
                addedBars: 0,
            }
        }

        actualFileCount = Math.min(fileCount, remaining)
        startIndex = loadedWindowRef.current.latestFile + 1
    }

    const result = await CandleService.getChartAndRawWindow(ticker, timeframe, startIndex, actualFileCount)

    if (!result.chartCandles.length) {
        return {
            loaded: false,
            addedBars: 0,
        }
    }

    const formatted: CandlestickData<Time>[] = result.chartCandles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
    }))

    if (direction === 'older') {
        candlesRef.current = [...formatted, ...candlesRef.current]
        loadedWindowRef.current.oldestFile = startIndex
        setRaw1mData(raw1mRef, [...result.rawCandles, ...raw1mRef.current.candles])
    } else {
        candlesRef.current = [...candlesRef.current, ...formatted]
        loadedWindowRef.current.latestFile = startIndex + actualFileCount - 1

        const updatedRawCandles = [...raw1mRef.current.candles, ...result.rawCandles]
        setRaw1mData(raw1mRef, updatedRawCandles)

        if (replayStore.enabled) {
            replayStore.appendRaw1mCandles(result.rawCandles)
        }
    }

    candleMapRef.current.clear()

    for (const candle of candlesRef.current) {
        candleMapRef.current.set(Number(candle.time), candle)
    }

    timesRef.current = candlesRef.current.map((c) => Number(c.time))

    if (!replayStore.enabled) {
        series.setData(candlesRef.current)
    }

    return {
        loaded: true,
        addedBars: formatted.length,
    }
}
