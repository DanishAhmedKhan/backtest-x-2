import { useEffect } from 'react'
import type { IChartApi } from 'lightweight-charts'

import type { DrawingContext } from '../../drawing/DrawingContext'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    containerRef: React.RefObject<HTMLDivElement | null>
    drawingContextRef: React.RefObject<DrawingContext>
}

export function useDrawingTools({ chartRef, containerRef, drawingContextRef }: Params) {
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const container = containerRef.current
        if (!container) return

        const handlePointerMove = (param) => {
            drawingContextRef.current.toolManager.handlePointerMove({
                x: param.point?.x ?? 0,
                y: param.point?.y ?? 0,
                time: typeof param.time === 'number' ? param.time : undefined,
                price: undefined,
                shiftKey: false,
                ctrlKey: false,
                altKey: false,
            })
        }

        const handlePointerDown = (e: PointerEvent) => {
            drawingContextRef.current.toolManager.handlePointerDown({
                x: e.offsetX,
                y: e.offsetY,
                time: undefined,
                price: undefined,
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
            })
        }

        const handlePointerUp = (e: PointerEvent) => {
            drawingContextRef.current.toolManager.handlePointerUp({
                x: e.offsetX,
                y: e.offsetY,
                time: undefined,
                price: undefined,
                shiftKey: e.shiftKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
            })
        }

        chart.subscribeCrosshairMove(handlePointerMove)
        container.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointerup', handlePointerUp)

        return () => {
            chart.unsubscribeCrosshairMove(handlePointerMove)
            container.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [chartRef, containerRef, drawingContextRef])
}
