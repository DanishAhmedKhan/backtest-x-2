import { useState } from 'react'

type Direction = 'horizontal' | 'vertical'

export function useResize(containerRef: React.RefObject<HTMLDivElement>, initial = 50) {
    const [split, setSplit] = useState(initial)

    const startDrag = (direction: Direction) => (e: React.MouseEvent) => {
        e.preventDefault()

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()

        const onMove = (ev: MouseEvent) => {
            let percent = 50

            if (direction === 'vertical') {
                const x = ev.clientX - rect.left
                percent = (x / rect.width) * 100
            } else {
                const y = ev.clientY - rect.top
                percent = (y / rect.height) * 100
            }

            const clamped = Math.min(80, Math.max(20, percent))
            setSplit(clamped)
        }

        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    return { split, startDrag }
}
