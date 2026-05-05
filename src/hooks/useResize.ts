import { useState } from 'react'

type Direction = 'horizontal' | 'vertical'

export function useResize(containerRef: React.RefObject<HTMLDivElement>) {
    const [size, setSize] = useState<number | null>(null)

    const startDrag = (direction: Direction) => (e: React.MouseEvent) => {
        e.preventDefault()

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()

        const onMove = (ev: MouseEvent) => {
            let newSize = 0

            if (direction === 'vertical') {
                newSize = ev.clientX - rect.left
            } else {
                newSize = ev.clientY - rect.top
            }

            const max = direction === 'vertical' ? rect.width : rect.height

            const minPx = max * 0.2
            const maxPx = max * 0.8

            const clamped = Math.min(maxPx, Math.max(minPx, newSize))

            setSize(clamped)
        }

        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    return { size, startDrag }
}
