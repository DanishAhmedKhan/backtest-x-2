import type { Ticker } from './Ticker'
import type { Timeframe } from './Timeframe'
import { CandleAggregator } from '../data/CandleAggregator'
import { candleCache } from '../data/CandleCache'
import { CsvCandleLoader } from '../data/CsvCandleLoader'
import type { Candle } from './Candle'

export class CandleService {
    static async getCandles(ticker: Ticker, timeframe: Timeframe) {
        const key = `${ticker.value}_${timeframe.toKey()}`

        if (candleCache.has(key)) {
            return candleCache.get(key)!
        }

        const tfSeconds = timeframe.toSeconds()

        const intervalFolder = tfSeconds < 3600 ? 'M' : 'H'

        const baseData: Candle[] = await CsvCandleLoader.load(ticker.value, intervalFolder, 2)

        let result: Candle[]

        if (tfSeconds === 60 || tfSeconds === 3600) {
            result = baseData
        } else {
            result = CandleAggregator.aggregate(baseData, tfSeconds / 60)
        }

        candleCache.set(key, result)

        return result
    }

    static async getOlderCandles(ticker: Ticker, timeframe: Timeframe, startIndex: number, count: number) {
        const tfSeconds = timeframe.toSeconds()

        const intervalFolder = tfSeconds < 3600 ? 'M' : 'H'

        const raw = await CsvCandleLoader.loadChunk(ticker.value, intervalFolder, startIndex, count)

        if (tfSeconds === 60 || tfSeconds === 3600) {
            return raw
        }

        return CandleAggregator.aggregate(raw, tfSeconds / 60)
    }

    static async getTotalFiles(ticker: Ticker): Promise<number> {
        return CsvCandleLoader.getFileCount(ticker.value)
    }
}
