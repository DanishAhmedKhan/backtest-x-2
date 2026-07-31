import { useEffect } from 'react'
import type { ChartRuntime } from '../../drawing/runtime/ChartRuntime'

type Params = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    containerRef: React.RefObject<HTMLDivElement | null>
    runtimeRef: React.RefObject<ChartRuntime | null>
}

export function useDrawingCanvas({ canvasRef, containerRef, runtimeRef }: Params) {
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current

        if (!canvas || !container) {
            return
        }

        const resize = () => {
            const pane = runtimeRef.current?.getPaneLayoutCalculator().calculate()

            if (!pane) return

            canvas.style.width = `${pane.width}px`
            canvas.style.height = `${pane.height}px`

            const dpr = window.devicePixelRatio || 1

            canvas.width = Math.round(pane.width * dpr)
            canvas.height = Math.round(pane.height * dpr)

            const ctx = canvas.getContext('2d')

            if (!ctx) {
                return
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }

        resize()

        const observer = new ResizeObserver(resize)

        observer.observe(container)

        return () => observer.disconnect()
    }, [canvasRef, containerRef, runtimeRef])
}
