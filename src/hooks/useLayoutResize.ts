import { useState } from 'react'
import { HANDLE_SIZE } from '../layout/layoutEngine'

type Direction = 'horizontal' | 'vertical'

type Rect = {
    left: number
    top: number
    width: number
    height: number
}

const MIN_SPLIT = 0.2
const MAX_SPLIT = 0.8

export function useLayoutResize() {
    const [splits, setSplits] = useState<Record<string, number>>({})

    const startDrag = (id: string, direction: Direction, rect: Rect, initialSize: number) => (e: React.MouseEvent) => {
        e.preventDefault()

        const startMouse = direction === 'vertical' ? e.clientX : e.clientY

        const startSize = splits[id] ?? initialSize

        const available = direction === 'vertical' ? rect.width - HANDLE_SIZE : rect.height - HANDLE_SIZE

        const minSize = available * MIN_SPLIT
        const maxSize = available * MAX_SPLIT

        const onMove = (ev: MouseEvent) => {
            const mouse = direction === 'vertical' ? ev.clientX : ev.clientY

            const delta = mouse - startMouse
            let newSize = startSize + delta
            newSize = Math.max(minSize, Math.min(maxSize, newSize))

            setSplits((prev) => ({
                ...prev,
                [id]: newSize,
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
