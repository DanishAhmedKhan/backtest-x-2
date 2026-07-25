import { ToolManager } from './tools/ToolManager'
import { ToolType } from './tools/ToolType'

import type { IChartApi } from 'lightweight-charts'

export class ToolController {
    constructor(private readonly toolManager: ToolManager, private readonly chart: IChartApi) {}

    public setTool(type: ToolType) {
        this.toolManager.selectByType(type)

        this.updateChartInteraction()
    }

    public allowsViewportInteraction() {
        return this.toolManager.allowsViewportInteraction()
    }

    public syncChartInteraction() {
        this.updateChartInteraction()
    }

    private updateChartInteraction() {
        const enabled = this.allowsViewportInteraction()

        this.chart.applyOptions({
            handleScroll: {
                pressedMouseMove: enabled,
                mouseWheel: true,
                horzTouchDrag: enabled,
                vertTouchDrag: enabled,
            },
        })
    }
}
