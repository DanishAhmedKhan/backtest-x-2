import { Timeframe } from '../../core/Timeframe'
import { TimeframeUnit } from '../../core/TimeframeUnit'

export const REPLAY_UPDATE_INTERVALS = [
    new Timeframe(1, TimeframeUnit.Minute),
    new Timeframe(5, TimeframeUnit.Minute),
    new Timeframe(15, TimeframeUnit.Minute),
    new Timeframe(30, TimeframeUnit.Minute),
    new Timeframe(1, TimeframeUnit.Hour),
    new Timeframe(4, TimeframeUnit.Hour),
]

export const REPLAY_SPEEDS = [1, 2, 5, 10, 30, 60] as const

export const DEFAULT_REPLAY_SPEED = 1
