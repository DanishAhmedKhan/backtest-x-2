import { useRef, useState } from 'react'

type Position = {
    x: number
    y: number
}

export function useDraggable(initial: Position) {
    const [position, setPosition] = useState(initial)

    const draggingRef = useRef(false)

    const offsetRef = useRef({
        x: 0,
        y: 0,
    })

    const onMouseDown = (e: React.MouseEvent) => {
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

    return {
        position,
        onMouseDown,
    }
}
