import { useState } from 'react'
import { HANDLE_SIZE } from '../layout/layoutEngine'

type Direction = 'horizontal' | 'vertical'

type Rect = {
    left: number
    top: number
    width: number
    height: number
}

export function useLayoutResize() {
    const [splits, setSplits] = useState<Record<string, number>>({})

    const startDrag = (id: string, direction: Direction, rect: Rect) => (e: React.MouseEvent) => {
        e.preventDefault()

        const startX = e.clientX
        const startY = e.clientY

        const available = direction === 'vertical' ? rect.width - HANDLE_SIZE : rect.height - HANDLE_SIZE

        const initialRatio = splits[id] ?? 0.5

        const onMove = (ev: MouseEvent) => {
            const delta = direction === 'vertical' ? ev.clientX - startX : ev.clientY - startY

            let ratio = initialRatio + delta / available

            ratio = Math.max(0.2, Math.min(0.8, ratio))

            setSplits((prev) => ({
                ...prev,
                [id]: ratio,
            }))
        }

        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    return {
        splits,
        startDrag,
    }
}
