import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import { DrawingManager } from '../managers/DrawingManager'
import { HitTestManager } from '../hitTest/HitTestManager'

import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

import { EditingSession } from '../edit/EditingSession'

export class EditController {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
        private readonly editingSession: EditingSession,
    ) {}

    public handlePointerDown(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(this.drawingManager.getDrawings(), event.point, this.transformer)

        if (!result) {
            return
        }

        this.editingSession.begin({
            drawing: result.drawing,
            target: result.target,
        })
    }

    public handlePointerUp() {
        this.editingSession.end()
    }
}
