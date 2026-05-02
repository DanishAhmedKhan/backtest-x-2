import type { Ticker } from './Ticker'
import type { Timeframe } from './Timeframe'
import { CandleAggregator } from '../data/CandleAggregator'
import { candleCache } from '../data/CandleCache'
import { CsvCandleLoader } from '../data/CsvCandleLoader'
import type { Candle } from './Candle'

export class CandleService {
    static async getCandles(ticker: Ticker, timeframe: Timeframe) {
        const key = `${ticker.value}_${timeframe.toKey()}`
        console.log(key)

        if (candleCache.has(key)) {
            return candleCache.get(key)!
        }

        const tfSeconds = timeframe.toSeconds()

        let baseData: Candle[]

        if (tfSeconds < 3600) {
            baseData = await CsvCandleLoader.load(ticker.value, 'M')
        } else {
            baseData = await CsvCandleLoader.load(ticker.value, 'H')
        }

        let result: Candle[]

        if (tfSeconds === 60 || tfSeconds === 3600) {
            result = baseData
        } else {
            const intervalMinutes = tfSeconds / 60
            result = CandleAggregator.aggregate(baseData, intervalMinutes)
        }

        candleCache.set(key, result)

        return result
    }
}
