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

    const startDrag = (id: string, direction: Direction, rect: Rect) => (e: React.MouseEvent) => {
        e.preventDefault()

        const onMove = (ev: MouseEvent) => {
            let ratio: number

            if (direction === 'vertical') {
                const availableWidth = rect.width - HANDLE_SIZE

                ratio = (ev.clientX - rect.left) / availableWidth
            } else {
                const availableHeight = rect.height - HANDLE_SIZE

                ratio = (ev.clientY - rect.top) / availableHeight
            }

            ratio = Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, ratio))

            setSplits((prev) => {
                if (prev[id] === ratio) {
                    return prev
                }

                return {
                    ...prev,
                    [id]: ratio,
                }
            })
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
