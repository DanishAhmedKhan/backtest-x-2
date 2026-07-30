import { ToolManager } from '../tools/ToolManager'
import type { HoverController } from './HoverController'
import type { SelectionController } from './SelectionController'
import type { EditController } from './EditController'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { RawPointerEvent } from '../models/RawPointerEvent'

export class PointerController {
    constructor(
        private readonly toolManager: ToolManager,
        private readonly hoverController: HoverController,
        private readonly selectionController: SelectionController,
        private readonly editController: EditController,
        private readonly transformer: CoordinateTransformer,
    ) {}

    public handlePointerDown(event: RawPointerEvent) {
        const converted = this.convert(event)

        if (!converted) {
            return
        }

        const hit = this.selectionController.handlePointerDown(converted)

        if (hit) {
            this.editController.handlePointerDown(converted, hit)
            return
        }

        this.toolManager.handlePointerDown(converted)
    }

    public handlePointerMove(event: RawPointerEvent) {
        const converted = this.convert(event)

        if (!converted) {
            return
        }

        if (this.editController.isEditing()) {
            this.editController.handlePointerMove(converted)
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

        if (this.editController.isEditing()) {
            this.editController.handlePointerUp()
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
        const anchor = this.transformer.toAnchor(event.x, event.y)

        if (!anchor) {
            return null
        }

        return {
            screen: {
                x: event.x,
                y: event.y,
            },
            anchor,
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
        }
    }
}
