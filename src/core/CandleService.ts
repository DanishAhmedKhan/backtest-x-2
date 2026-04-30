import type { Ticker } from './Ticker'
import type { Timeframe } from './Timeframe'
import { CandleAggregator } from '../data/CandleAggregator'
import { candleCache } from '../data/CandleCache'
import { CsvCandleLoader } from '../data/CsvCandleLoader'

export class CandleService {
    static async getCandles(ticker: Ticker, timeframe: Timeframe) {
        const key = `${ticker.value}_${timeframe.label}`

        if (candleCache.has(key)) {
            return candleCache.get(key)!
        }

        let baseData

        const tf = Number(timeframe.value)

        if (tf < 60) {
            baseData = await CsvCandleLoader.load(ticker.value, 'M')
        } else {
            baseData = await CsvCandleLoader.load(ticker.value, 'H')
        }

        let result

        if (tf === 1 || tf === 60) {
            result = baseData
        } else {
            const interval = tf < 60 ? tf : (tf / 60) * 60
            result = CandleAggregator.aggregate(baseData, interval)
        }

        candleCache.set(key, result)

        return result
    }
}
