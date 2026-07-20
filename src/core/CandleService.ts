import type { Ticker } from './Ticker'
import type { Timeframe } from './Timeframe'
import { CandleAggregator } from '../data/CandleAggregator'
import { CsvCandleLoader } from '../data/CsvCandleLoader'
import type { Candle } from './Candle'
import { TimeframeUnit } from './TimeframeUnit'

export class CandleService {
    static async getInitialWindow(
        ticker: Ticker,
        timeframe: Timeframe,
        totalFiles?: number,
    ): Promise<{
        candles: Candle[]
        oldestFile: number
        latestFile: number
    }> {
        const tfSeconds = timeframe.toSeconds()
        const intervalFolder = tfSeconds < 3600 ? 'M' : 'H'
        const fileCount = this.getInitialFileCount(timeframe)

        if (totalFiles === undefined) {
            totalFiles = await this.getTotalFiles(ticker)
        }

        const startIndex = Math.max(0, totalFiles - fileCount)

        const raw = await CsvCandleLoader.loadWindow(ticker.value, intervalFolder, startIndex, fileCount)

        let result: Candle[]

        if (tfSeconds === 60 || tfSeconds === 3600) {
            result = raw
        } else {
            result = CandleAggregator.aggregate(raw, tfSeconds / 60)
        }

        return {
            candles: result,
            oldestFile: startIndex,
            latestFile: totalFiles - 1,
        }
    }

    private static getInitialFileCount(timeframe: Timeframe): number {
        switch (timeframe.unit) {
            case TimeframeUnit.Minute:
                return 5

            case TimeframeUnit.Hour:
                return 20

            case TimeframeUnit.Day:
            case TimeframeUnit.Week:
            case TimeframeUnit.Month:
            case TimeframeUnit.Year:
                return 20

            default:
                return 5
        }
    }

    static async getCandlesWindow(ticker: Ticker, timeframe: Timeframe, startIndex: number, fileCount: number) {
        const tfSeconds = timeframe.toSeconds()

        const intervalFolder = tfSeconds < 3600 ? 'M' : 'H'

        const raw = await CsvCandleLoader.loadWindow(ticker.value, intervalFolder, startIndex, fileCount)

        if (tfSeconds === 60 || tfSeconds === 3600) {
            return raw
        }

        return CandleAggregator.aggregate(raw, tfSeconds / 60)
    }

    static async getCandlesAroundTime(
        ticker: Ticker,
        timeframe: Timeframe,
        timestamp: number,
        beforeFiles: number = 4,
        afterFiles: number = 4,
    ) {
        const centerFile = await CsvCandleLoader.findFileIndex(ticker.value, timestamp)

        if (centerFile === -1) {
            throw new Error('Timestamp is outside available data.')
        }

        const totalFiles = await this.getTotalFiles(ticker)
        const oldestFile = Math.max(0, centerFile - beforeFiles)
        const latestFile = Math.min(totalFiles - 1, centerFile + afterFiles)

        const candles = await this.getCandlesWindow(ticker, timeframe, oldestFile, latestFile - oldestFile + 1)

        return {
            candles,
            loadedWindow: {
                oldestFile,
                latestFile,
            },
        }
    }

    static async getTotalFiles(ticker: Ticker): Promise<number> {
        return CsvCandleLoader.getFileCount(ticker.value)
    }
}
