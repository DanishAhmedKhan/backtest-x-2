import { useEffect } from 'react'
import type { MouseEventParams, Time, IChartApi, ISeriesApi } from 'lightweight-charts'

import { DrawingContext } from '../../drawing/DrawingContext'
import type { RawPointerEvent } from '../../drawing/models/RawPointerEvent'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    containerRef: React.RefObject<HTMLDivElement | null>
    drawingContextRef: React.RefObject<DrawingContext>
}

export function useDrawingTools({ chartRef, seriesRef, containerRef, drawingContextRef }: Params) {
    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series) return

        const container = containerRef.current
        if (!container) return

        drawingContextRef.current.initialize(chart, series)

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
            drawingContextRef.current
                .getInputController()
                .handlePointerMove(
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
            drawingContextRef.current
                .getInputController()
                .handlePointerDown(
                    createRawPointerEvent(e.offsetX, e.offsetY, undefined, e.shiftKey, e.ctrlKey, e.altKey),
                )
        }

        const handlePointerUp = (e: PointerEvent) => {
            drawingContextRef.current
                .getInputController()
                .handlePointerUp(
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
    }, [chartRef, seriesRef, containerRef, drawingContextRef])
}
