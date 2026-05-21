import { Candle } from '../core/Candle'
import { EventBus } from '../event/EventBus'
import { ReplayEvents } from './ReplayEvents'
import { ReplaySession } from './ReplaySession'

class ReplayEngineClass {
    private session: ReplaySession | null = null

    private timer: number | null = null

    public create(candles: Candle[]) {
        this.pause()

        this.session = new ReplaySession(candles)

        EventBus.emit(ReplayEvents.RESET, {
            candles: this.session.visibleCandles(),
        })
    }

    public play() {
        if (!this.session) return

        if (this.timer) return

        this.session.state.isPlaying = true

        EventBus.emit(ReplayEvents.PLAY)

        this.timer = window.setInterval(() => {
            this.tick()
        }, 1000 / this.session.state.speed)
    }

    public pause() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }

        if (this.session) {
            this.session.state.isPlaying = false
        }

        EventBus.emit(ReplayEvents.PAUSE)
    }

    public toggle() {
        if (!this.session) return

        if (this.session.state.isPlaying) {
            this.pause()
        } else {
            this.play()
        }
    }

    public stepForward() {
        this.tick()
    }

    public setSpeed(speed: number) {
        if (!this.session) return

        this.session.state.speed = speed

        if (this.session.state.isPlaying) {
            this.pause()
            this.play()
        }
    }

    private tick() {
        if (!this.session) return

        const candle = this.session.nextCandle()

        if (!candle) {
            this.pause()
            return
        }

        EventBus.emit(ReplayEvents.TICK, candle)
    }
}

export const ReplayEngine = new ReplayEngineClass()
