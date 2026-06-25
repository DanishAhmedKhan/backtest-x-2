import { useRef, useState } from 'react'
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

    const handlePlay = () => {
        if (replayStore.currentReplayTime === null) {
            return
        }

        console.log(
            'REPLAY TIME',
            replayStore.currentReplayTime,
            new Date(replayStore.currentReplayTime! * 1000).toISOString(),
        )

        replayStore.nextMinute()

        eventBus.emit('replayTimeChanged', {
            time: replayStore.currentReplayTime,
        })
    }

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

            <button>◀◀</button>

            <button onClick={handlePlay}>▶</button>

            <button>⏸</button>

            <button>▶▶</button>

            <button>Step</button>

            <select>
                <option>1x</option>
                <option>2x</option>
                <option>4x</option>
                <option>8x</option>
                <option>16x</option>
            </select>

            <button>Exit</button>
        </div>
    )
}
