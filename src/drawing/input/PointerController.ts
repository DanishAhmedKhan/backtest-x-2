import { ToolManager } from '../tools/ToolManager'
import type { HoverController } from './HoverController'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { RawPointerEvent } from '../models/RawPointerEvent'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class PointerController {
    constructor(
        private readonly toolManager: ToolManager,
        private readonly hoverController: HoverController,
        private readonly transformer: CoordinateTransformer,
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

        this.hoverController.handlePointerMove(converted)
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
        this.hoverController.handlePointerLeave()
        this.toolManager.handlePointerLeave()
    }

    public cancel() {
        this.toolManager.cancel()
    }

    private convert(event: RawPointerEvent): ChartPointerEvent | null {
        const point = this.transformer.toDomain(event.x, event.y)

        if (!point) {
            return null
        }

        return {
            screen: {
                x: event.x,
                y: event.y,
            },
            point,
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
        }
    }
}
