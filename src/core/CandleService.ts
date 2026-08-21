import { Ticker } from './Ticker'
import { Timeframe } from './Timeframe'
import { TimeframeUnit } from './TimeframeUnit'

import { CandleAggregator } from '../data/CandleAggregator'
import { CsvCandleLoader } from '../data/CsvCandleLoader'

export class CandleService {
    private static readonly loadingPolicy = {
        '1m': { initial: 5, adjacent: 2 },
        '5m': { initial: 8, adjacent: 3 },
        '15m': { initial: 12, adjacent: 5 },
        '30m': { initial: 16, adjacent: 8 },
        '1h': { initial: 20, adjacent: 10 },
        '4h': { initial: 24, adjacent: 12 },
        '1d': { initial: 30, adjacent: 15 },
    } as const

    public static async getInitialChartAndRawWindow(ticker: Ticker, timeframe: Timeframe, totalFiles?: number) {
        if (totalFiles === undefined) {
            totalFiles = await CsvCandleLoader.getFileCount(ticker.value)
        }

        const fileCount = this.getInitialFileCount(timeframe)

        const startIndex = Math.max(0, totalFiles - fileCount)

        return this.getChartAndRawWindow(ticker, timeframe, startIndex, fileCount)
    }

    private static getInitialFileCount(timeframe: Timeframe): number {
        return this.loadingPolicy[timeframe.toKey()]?.initial ?? 20
    }

    public static getAdjacentLoadFileCount(timeframe: Timeframe): number {
        return this.loadingPolicy[timeframe.toKey()]?.adjacent ?? 10
    }

    public static async getCandlesWindow(ticker: Ticker, timeframe: Timeframe, startIndex: number, fileCount: number) {
        const tfSeconds = timeframe.toSeconds()

        const intervalFolder = tfSeconds < 3600 ? 'M' : 'H'

        const raw = await CsvCandleLoader.loadWindow(ticker.value, intervalFolder, startIndex, fileCount)

        if (tfSeconds === 60 || tfSeconds === 3600) {
            return raw
        }

        return CandleAggregator.aggregate(raw, tfSeconds / 60)
    }

    public static async getChartAndRawCandlesAroundTime(
        ticker: Ticker,
        timeframe: Timeframe,
        timestamp: number,
        beforeFiles: number = 4,
        afterFiles: number = 4,
    ) {
        const centerFile = await CsvCandleLoader.getFileIndex(ticker.value, timestamp)

        if (centerFile === -1) {
            throw new Error('Timestamp is outside available data.')
        }

        const totalFiles = await CsvCandleLoader.getFileCount(ticker.value)

        const oldestFile = Math.max(0, centerFile - beforeFiles)
        const latestFile = Math.min(totalFiles - 1, centerFile + afterFiles)

        return this.getChartAndRawWindow(ticker, timeframe, oldestFile, latestFile - oldestFile + 1)
    }

    public static async getChartAndRawWindow(
        ticker: Ticker,
        timeframe: Timeframe,
        startIndex: number,
        fileCount: number,
    ) {
        const chartCandles = await this.getCandlesWindow(ticker, timeframe, startIndex, fileCount)

        const rawCandles = await this.getCandlesWindow(
            ticker,
            new Timeframe(1, TimeframeUnit.Minute),
            startIndex,
            fileCount,
        )

        return {
            chartCandles,
            rawCandles,
            loadedWindow: {
                oldestFile: startIndex,
                latestFile: startIndex + fileCount - 1,
            },
        }
    }

    public static async getTotalFiles(ticker: Ticker): Promise<number> {
        return CsvCandleLoader.getFileCount(ticker.value)
    }
}
