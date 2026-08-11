import { useEffect } from 'react'
import type { IChartApi, MouseEventParams, Time } from 'lightweight-charts'
import type { RawPointerEvent } from '../../drawing/models/RawPointerEvent'
import type { ChartRuntime } from '../../drawing/runtime/ChartRuntime'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    containerRef: React.RefObject<HTMLDivElement | null>
    runtimeRef: React.RefObject<ChartRuntime | null>
}

export function useDrawingTools({ chartRef, containerRef, runtimeRef }: Params) {
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) {
            return
        }

        const container = containerRef.current
        if (!container) {
            return
        }

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
            if (!param.point) {
                return
            }

            const sourceEvent = param.sourceEvent

            runtimeRef.current?.handlePointerMove(
                createRawPointerEvent(
                    param.point.x,
                    param.point.y,
                    typeof param.time === 'number' ? param.time : undefined,
                    sourceEvent?.shiftKey ?? false,
                    sourceEvent?.ctrlKey ?? false,
                    sourceEvent?.altKey ?? false,
                ),
            )
        }

        const handlePointerDown = (e: PointerEvent) => {
            runtimeRef.current?.handlePointerDown(
                createRawPointerEvent(e.offsetX, e.offsetY, undefined, e.shiftKey, e.ctrlKey, e.altKey),
            )
        }

        const handlePointerUp = (e: PointerEvent) => {
            runtimeRef.current?.handlePointerUp(
                createRawPointerEvent(e.offsetX, e.offsetY, undefined, e.shiftKey, e.ctrlKey, e.altKey),
            )
        }

        const handlePointerLeave = () => {
            runtimeRef.current?.handlePointerLeave()
        }

        chart.subscribeCrosshairMove(handlePointerMove)
        container.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointerup', handlePointerUp)
        container.addEventListener('pointerleave', handlePointerLeave)

        return () => {
            chart.unsubscribeCrosshairMove(handlePointerMove)
            container.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointerup', handlePointerUp)
            container.removeEventListener('pointerleave', handlePointerLeave)
        }
    }, [chartRef, containerRef, runtimeRef])
}
