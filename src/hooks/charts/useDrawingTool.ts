import { useEffect } from 'react'
import type { MouseEventParams, Time, IChartApi } from 'lightweight-charts'

import type { PointerController } from '../../drawing/input/PointerController'
import type { RawPointerEvent } from '../../drawing/models/RawPointerEvent'

type Params = {
    chartRef: React.RefObject<IChartApi | null>

    containerRef: React.RefObject<HTMLDivElement | null>

    pointerControllerRef: React.RefObject<PointerController | null>
}

export function useDrawingTools({ chartRef, containerRef, pointerControllerRef }: Params) {
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const container = containerRef.current
        if (!container) return

        const pointerController = pointerControllerRef.current
        if (!pointerController) return

        const createRawPointerEvent = (
            x: number,
            y: number,
            time: number | undefined,
            shiftKey: boolean,
            ctrlKey: boolean,
            altKey: boolean,
        ): RawPointerEvent => ({
            x,
            y,
            time,
            shiftKey,
            ctrlKey,
            altKey,
        })

        const handlePointerMove = (param: MouseEventParams<Time>) => {
            pointerController.handlePointerMove(
                createRawPointerEvent(
                    param.point?.x ?? 0,
                    param.point?.y ?? 0,
                    typeof param.time === 'number' ? param.time : undefined,
                    false,
                    false,
                    false,
                ),
            )
        }

        const handlePointerDown = (e: PointerEvent) => {
            pointerController.handlePointerDown(
                createRawPointerEvent(e.offsetX, e.offsetY, undefined, e.shiftKey, e.ctrlKey, e.altKey),
            )
        }

        const handlePointerUp = (e: PointerEvent) => {
            pointerController.handlePointerUp(
                createRawPointerEvent(e.offsetX, e.offsetY, undefined, e.shiftKey, e.ctrlKey, e.altKey),
            )
        }

        chart.subscribeCrosshairMove(handlePointerMove)
        container.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointerup', handlePointerUp)

        return () => {
            chart.unsubscribeCrosshairMove(handlePointerMove)
            container.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointerup', handlePointerUp)
        }
    }, [chartRef, containerRef, pointerControllerRef])
}
