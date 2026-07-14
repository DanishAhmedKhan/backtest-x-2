import { useEffect, useRef, useState } from 'react'
import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import { DEFAULT_REPLAY_SPEED, REPLAY_SPEEDS, REPLAY_UPDATE_INTERVALS } from '../config/default/ReplayConfig'

export default function ReplayToolbar() {
    const [position, setPosition] = useState({
        x: window.innerWidth / 2 - 200,
        y: 80,
    })

    const draggingRef = useRef(false)
    const offsetRef = useRef({
        x: 0,
        y: 0,
    })

    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(DEFAULT_REPLAY_SPEED)
    const [updateInterval, setUpdateInterval] = useState(replayStore.updateIntervalSeconds)

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        draggingRef.current = true

        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        }

        const onMouseMove = (event: MouseEvent) => {
            if (!draggingRef.current) return

            setPosition({
                x: event.clientX - offsetRef.current.x,
                y: event.clientY - offsetRef.current.y,
            })
        }

        const onMouseUp = () => {
            draggingRef.current = false

            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
    }

    const handleTogglePlay = () => {
        // setIsPlaying((prev) => !prev)
        setIsPlaying((prev) => {
            const next = !prev
            replayStore.setPlaying(next)
            return next
        })
    }

    const handleForward = () => {
        replayStore.step()

        if (replayStore.marketTime === null) {
            return
        }

        eventBus.emit('replayTimeChanged', {
            time: replayStore.marketTime,
        })
    }

    const handleBackward = () => {
        replayStore.rewind()

        if (replayStore.marketTime === null) {
            return
        }

        eventBus.emit('replayTimeChanged', {
            time: replayStore.marketTime,
        })
    }

    const handleUpdateInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const seconds = Number(e.target.value)

        replayStore.setUpdateIntervalSeconds(seconds)

        eventBus.emit('replayUpdateIntervalChanged', {
            seconds,
        })

        eventBus.emit('replayTimeChanged', {
            time: replayStore.marketTime!,
        })
    }

    // const handleExit = () => {
    //     setIsPlaying(false)

    //     replayStore.stop()

    //     eventBus.emit('replayStop')
    // }

    const handleExit = () => {
        setIsPlaying(false)

        replayStore.setPlaying(false)

        replayStore.stop()

        eventBus.emit('replayStop')
    }

    useEffect(() => {
        if (!isPlaying) {
            return
        }

        const interval = setInterval(() => {
            replayStore.step()

            if (replayStore.marketTime === null) {
                return
            }

            eventBus.emit('replayTimeChanged', {
                time: replayStore.marketTime,
            })
        }, 1000 / speed)

        return () => clearInterval(interval)
    }, [isPlaying, speed])

    useEffect(() => {
        const unsubscribe = eventBus.on('replayUpdateIntervalChanged', ({ seconds }) => {
            setUpdateInterval(seconds)
        })

        return unsubscribe
    }, [])

    return (
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#1b1b1b',
                border: '1px solid #333',
                borderRadius: 8,
                padding: '10px 14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                userSelect: 'none',
            }}
        >
            <div
                onMouseDown={onMouseDown}
                style={{
                    cursor: 'move',
                    padding: '0 8px',
                    color: '#999',
                    fontSize: 18,
                }}
            >
                ⋮⋮
            </div>

            <button onClick={handleBackward}>◀◀</button>

            <button onClick={handleTogglePlay}>{isPlaying ? '⏸' : '▶'}</button>

            <button onClick={handleForward}>▶▶</button>

            <select value={updateInterval} onChange={handleUpdateInterval}>
                {REPLAY_UPDATE_INTERVALS.map((tf) => (
                    <option key={tf.toKey()} value={tf.toSeconds()}>
                        {tf.label}
                    </option>
                ))}
            </select>

            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                {REPLAY_SPEEDS.map((value) => (
                    <option key={value} value={value}>
                        {value}x
                    </option>
                ))}
            </select>

            <button onClick={handleExit}>Exit</button>
        </div>
    )
}
