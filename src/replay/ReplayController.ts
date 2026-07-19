import { replayStore } from './ReplayStore'

export class ReplayController {
    public forward() {
        this.move(1)
    }

    public backward() {
        this.move(-1)
    }

    public seek(index: number) {
        const candles = replayStore.raw1mCandles

        if (!candles.length) {
            return
        }

        replayStore.replayIndex = Math.max(replayStore.startIndex ?? 0, Math.min(index, candles.length - 1))
    }

    private move(direction: 1 | -1) {
        const candles = replayStore.raw1mCandles

        let index = replayStore.replayIndex

        if (index === null || !candles.length) {
            return
        }

        const required = replayStore.pendingStepSeconds ?? replayStore.updateIntervalSeconds

        replayStore.pendingStepSeconds = null

        let elapsed = 0

        if (direction === 1) {
            while (index < candles.length - 1) {
                elapsed += candles[index + 1].time - candles[index].time

                index++

                if (elapsed >= required) {
                    break
                }
            }
        } else {
            while (index > (replayStore.startIndex ?? 0)) {
                elapsed += candles[index].time - candles[index - 1].time

                index--

                if (elapsed >= required) {
                    break
                }
            }
        }

        replayStore.replayIndex = index
    }
}

export const replayController = new ReplayController()
