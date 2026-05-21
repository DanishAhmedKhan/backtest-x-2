import { Candle } from '../core/Candle'
import { ReplayState } from './ReplayTypes'

export class ReplaySession {
    public candles: Candle[] = []

    public state: ReplayState = {
        isPlaying: false,
        speed: 1,

        currentIndex: 0,

        startIndex: 0,
        endIndex: 0,
    }

    constructor(candles: Candle[]) {
        this.candles = candles

        this.state.endIndex = candles.length - 1
    }

    public currentCandle(): Candle | null {
        return this.candles[this.state.currentIndex] ?? null
    }

    public nextCandle(): Candle | null {
        const nextIndex = this.state.currentIndex + 1

        if (nextIndex > this.state.endIndex) {
            return null
        }

        this.state.currentIndex = nextIndex

        return this.candles[nextIndex]
    }

    public visibleCandles(): Candle[] {
        return this.candles.slice(0, this.state.currentIndex + 1)
    }
}
