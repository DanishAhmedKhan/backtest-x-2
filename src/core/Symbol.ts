import type { Ticker } from '../core/Ticker'
import type { Timeframe } from '../core/Timeframe'

export interface Symbol {
    ticker: Ticker
    timeframe: Timeframe
}
