import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'

export type ChartState = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}
