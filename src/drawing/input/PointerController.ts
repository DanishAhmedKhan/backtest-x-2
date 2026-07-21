import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import { ToolManager } from '../tools/ToolManager'
import type { RawPointerEvent } from '../models/RawPointerEvent'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export class PointerController {
    constructor(
        private readonly toolManager: ToolManager,
        private readonly chart: IChartApi,
        private readonly series: ISeriesApi<'Candlestick'>,
    ) {}

    public handlePointerDown(event: RawPointerEvent) {
        const converted = this.convert(event)

        if (!converted) {
            return
        }

        this.toolManager.handlePointerDown(converted)
    }

    public handlePointerMove(event: RawPointerEvent) {
        const converted = this.convert(event)

        if (!converted) {
            return
        }

        this.toolManager.handlePointerMove(converted)
    }

    public handlePointerUp(event: RawPointerEvent) {
        const converted = this.convert(event)

        if (!converted) {
            return
        }

        this.toolManager.handlePointerUp(converted)
    }

    public handlePointerLeave() {
        this.toolManager.handlePointerLeave()
    }

    public cancel() {
        this.toolManager.cancel()
    }

    private convert(event: RawPointerEvent): ChartPointerEvent | null {
        const time = event.time ?? this.chart.timeScale().coordinateToTime(event.x)

        const price = this.series.coordinateToPrice(event.y)

        if (typeof time !== 'number') {
            return null
        }

        if (price == null) {
            return null
        }

        return {
            point: {
                time,
                price,
            },
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
        }
    }
}
