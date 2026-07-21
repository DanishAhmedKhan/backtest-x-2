import { useEffect } from 'react'
import type { IChartApi } from 'lightweight-charts'

import type { DrawingContext } from '../../drawing/drawings/DrawingContext'

type Params = {
    chartRef: React.RefObject<IChartApi | null>
    drawingContextRef: React.RefObject<DrawingContext>
}

export function useDrawingTools({ chartRef, drawingContextRef }: Params) {
    useEffect(() => {
        const chart = chartRef.current

        if (!chart) {
            return
        }

        const handleMove = (param) => {
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

        chart.subscribeCrosshairMove(handleMove)

        return () => {
            chart.unsubscribeCrosshairMove(handleMove)
        }
    }, [chartRef, drawingContextRef])
}
