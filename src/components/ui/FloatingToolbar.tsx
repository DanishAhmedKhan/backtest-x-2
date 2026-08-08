import type React from 'react'
import { useRef, useState } from 'react'

import './toolbar.css'

type Props = {
    children: React.ReactNode
    initialX?: number
    initialY?: number
    className?: string
}

export function FloatingToolbar({ children, initialX = window.innerWidth / 2 - 200, initialY = 80, className }: Props) {
    const [position, setPosition] = useState({
        x: initialX,
        y: initialY,
    })

    const draggingRef = useRef(false)

    const offsetRef = useRef({
        x: 0,
        y: 0,
    })

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        draggingRef.current = true

        offsetRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        }

        const handleMouseMove = (event: MouseEvent) => {
            if (!draggingRef.current) return

            setPosition({
                x: event.clientX - offsetRef.current.x,
                y: event.clientY - offsetRef.current.y,
            })
        }

        const handleMouseUp = () => {
            draggingRef.current = false

            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <div
            className={`floating-toolbar ${className ?? ''}`}
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <div className="floating-toolbar-handle" onMouseDown={handleMouseDown}>
                ⋮⋮
            </div>

            <div className="floating-toolbar-content">{children}</div>
        </div>
    )
}
