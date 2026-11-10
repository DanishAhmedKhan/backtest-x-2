// import { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'

// import type { Tool } from './Tool'
// import { ToolType } from './ToolType'
// import type { ChartPointerEvent } from '../models/ChartPointerEvents'

// import type { DrawingManager } from '../managers/DrawingManager'
// import type { DrawingStateManager } from '../managers/DrawingStateManager'
// import type { PreviewDrawingManager } from '../renderer/PreviewDrawingManager'

// import { eventBus } from '../../event/EventBus'

// export class FibRetracementTool implements Tool {
//     public readonly type = ToolType.FibRetracement
//     public readonly allowsViewportInteraction = false
//     public readonly allowsSelection = false
//     public readonly createsDrawing = true

//     private preview: FibRetracementDrawing | null = null

//     constructor(
//         private readonly drawingManager: DrawingManager,
//         private readonly previewDrawingManager: PreviewDrawingManager,
//         private readonly drawingStateManager: DrawingStateManager,
//     ) {}

//     public activate() {}

//     public deactivate() {
//         this.cancel()
//     }

//     public handlePointerDown(event: ChartPointerEvent) {
//         if (!this.preview) {
//             this.preview = new FibRetracementDrawing(
//                 crypto.randomUUID(),
//                 {
//                     time: event.anchor.time,
//                     price: event.anchor.price,
//                 },
//                 {
//                     time: event.anchor.time,
//                     price: event.anchor.price,
//                 },
//             )

//             this.previewDrawingManager.set(this.preview)

//             return
//         }

//         this.preview.end = { ...event.anchor }

//         this.drawingManager.addDrawing(this.preview)
//         this.previewDrawingManager.clear()
//         this.drawingStateManager.setSelected(this.preview)

//         this.preview = null

//         eventBus.emit('drawingCompleted')
//     }

//     public handlePointerMove(event: ChartPointerEvent) {
//         if (!this.preview) {
//             return
//         }

//         this.preview.end = { ...event.anchor }

//         this.previewDrawingManager.set(this.preview)
//     }

//     public handlePointerUp() {}

//     public handlePointerLeave() {}

//     public cancel() {
//         this.preview = null
//         this.previewDrawingManager.clear()
//     }
// }

import { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'

import type { Tool } from './Tool'
import { ToolType } from './ToolType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { DrawingManager } from '../managers/DrawingManager'
import type { PreviewDrawingManager } from '../renderer/PreviewDrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'

import { eventBus } from '../../event/EventBus'

export class FibRetracementTool implements Tool {
    public readonly type = ToolType.FibRetracement

    public readonly allowsViewportInteraction = false
    public readonly allowsSelection = false
    public readonly createsDrawing = true

    private preview: FibRetracementDrawing | null = null

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
    ) {}

    public activate() {}

    public deactivate() {
        this.cancel()
    }

    public handlePointerDown(event: ChartPointerEvent) {
        if (!this.preview) {
            const anchor = {
                time: event.anchor.time,
                price: event.anchor.price,
            }

            this.preview = new FibRetracementDrawing(crypto.randomUUID(), anchor, anchor)

            this.previewDrawingManager.set(this.preview)

            return
        }

        this.preview.end = {
            time: event.anchor.time,
            price: event.anchor.price,
        }

        this.drawingManager.addDrawing(this.preview)

        this.previewDrawingManager.clear()

        this.drawingStateManager.setSelected(this.preview)

        this.preview = null

        eventBus.emit('drawingCompleted')
    }

    public handlePointerMove(event: ChartPointerEvent) {
        if (!this.preview) {
            return
        }

        this.preview.end = {
            time: event.anchor.time,
            price: event.anchor.price,
        }

        this.previewDrawingManager.set(this.preview)
    }

    public handlePointerUp() {}

    public handlePointerLeave() {}

    public cancel() {
        this.preview = null
        this.previewDrawingManager.clear()
    }
}
