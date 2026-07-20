import { useEffect } from 'react'
import { eventBus } from '../../event/EventBus'
import { replayController } from '../../replay/ReplayController'
import { replayStore } from '../../replay/ReplayStore'

export function useReplayController() {
    useEffect(() => {
        const unsubForward = eventBus.on('replayForward', () => {
            replayController.forward()

            eventBus.emit('replayPositionChanged')
        })

        const unsubBackward = eventBus.on('replayBackward', () => {
            replayController.backward()

            eventBus.emit('replayPositionChanged')
        })

        const unsubTimeChanged = eventBus.on('replayTimeChanged', ({ time }) => {
            if (time == null) {
                return
            }

            const candles = replayStore.raw1mCandles

            let left = 0
            let right = candles.length - 1

            while (left <= right) {
                const mid = (left + right) >> 1

                if (candles[mid].time < time) {
                    left = mid + 1
                } else if (candles[mid].time > time) {
                    right = mid - 1
                } else {
                    replayController.seek(mid)

                    eventBus.emit('replayPositionChanged')

                    return
                }
            }

            replayController.seek(left)

            eventBus.emit('replayPositionChanged')
        })

        return () => {
            unsubForward()
            unsubBackward()
            unsubTimeChanged()
        }
    }, [])
}
