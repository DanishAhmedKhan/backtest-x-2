import type { Ticker } from '../core/Ticker'
import type { Timeframe } from '../core/Timeframe'

export type Config = {
    ticker: Ticker
    timeframe: Timeframe
    loadedFile?: string
}
