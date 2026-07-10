import type { Ticker } from './Ticker'
import type { Timeframe } from './Timeframe'
import { CandleAggregator } from '../data/CandleAggregator'
import { candleCache } from '../data/CandleCache'
import { CsvCandleLoader } from '../data/CsvCandleLoader'

export class CandleService {
    static async getCandles(ticker: Ticker, timeframe: Timeframe) {
        const key = `${ticker.value}_${timeframe.toKey()}`

        if (candleCache.has(key)) {
            return candleCache.get(key)!
        }

        const result = await this.getInitialWindow(ticker, timeframe)

        candleCache.set(key, result)

        return result
    }

    static async getInitialWindow(ticker: Ticker, timeframe: Timeframe, totalFiles?: number) {
        const fileCount = totalFiles ?? (await this.getTotalFiles(ticker))
        const startIndex = Math.max(0, fileCount - 2)

        return this.getCandlesWindow(ticker, timeframe, startIndex, 2)
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
        beforeFiles: number = 1,
        afterFiles: number = 1,
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
