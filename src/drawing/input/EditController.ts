import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import { DrawingManager } from '../managers/DrawingManager'
import { HitTestManager } from '../hitTest/HitTestManager'
import { EditingSession } from '../edit/EditingSession'
import type { EditorManager } from '../edit/EditorManager'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class EditController {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
        private readonly editingSession: EditingSession,
        private readonly editorManager: EditorManager,
    ) {}

    public handlePointerDown(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(this.drawingManager.getDrawings(), event.point, this.transformer)

        if (!result) {
            return
        }

        this.editingSession.begin(
            {
                drawing: result.drawing,
                target: result.target,
            },
            event.point,
            result.drawing.clone(),
        )

        this.editorManager.beginEdit(this.editingSession.getTarget()!, event)
    }

    public handlePointerMove(event: ChartPointerEvent) {
        const target = this.editingSession.getTarget()

        if (!target) {
            return
        }

        this.editorManager.updateEdit(target, event)
    }

    public handlePointerUp() {
        const target = this.editingSession.getTarget()

        if (!target) {
            return
        }

        this.editorManager.endEdit(target)

        this.editingSession.end()
    }
}
