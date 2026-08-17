import type { IChartApi } from 'lightweight-charts'

import type { ToolType } from './ToolType'
import type { ToolManager } from './ToolManager'
import type { ViewportInteractionController } from '../controller/ViewportInterationController'

export class ToolController implements ViewportInteractionController {
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

    public disableViewportInteraction() {
        this.chart.applyOptions({
            handleScroll: {
                pressedMouseMove: false,
                mouseWheel: true,
                horzTouchDrag: false,
                vertTouchDrag: false,
            },
        })
    }

    public enableViewportInteraction() {
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
