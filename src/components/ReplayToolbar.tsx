import { useEffect, useRef, useState } from 'react'
import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'

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
    const [speed, setSpeed] = useState(1)

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
        setIsPlaying((prev) => !prev)
    }

    const handleForward = () => {
        replayStore.step()

        if (replayStore.currentReplayTime === null) {
            return
        }

        eventBus.emit('replayTimeChanged', {
            time: replayStore.currentReplayTime,
        })
    }

    const handleBackward = () => {
        replayStore.rewind()

        if (replayStore.currentReplayTime === null) {
            return
        }

        eventBus.emit('replayTimeChanged', {
            time: replayStore.currentReplayTime,
        })
    }

    const handleExit = () => {
        setIsPlaying(false)

        replayStore.stop()

        eventBus.emit('replayStop')
    }

    useEffect(() => {
        if (!isPlaying) {
            return
        }

        const interval = setInterval(() => {
            replayStore.step()

            if (replayStore.currentReplayTime === null) {
                return
            }

            eventBus.emit('replayTimeChanged', {
                time: replayStore.currentReplayTime,
            })
        }, 1000 / speed)

        return () => clearInterval(interval)
    }, [isPlaying, speed])

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

            <button>Step</button>

            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>4x</option>
                <option value={10}>8x</option>
                <option value={30}>16x</option>
                <option value={60}>32x</option>
            </select>

            <button onClick={handleExit}>Exit</button>
        </div>
    )
}
