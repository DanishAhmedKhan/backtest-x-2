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

        this.editorManager.beginEdit(this.editingSession, event)
    }

    public handlePointerMove(event: ChartPointerEvent) {
        if (!this.editingSession.isEditing()) {
            return
        }

        this.editorManager.updateEdit(this.editingSession, event)
    }

    public handlePointerUp() {
        if (!this.editingSession.isEditing()) {
            return
        }

        this.editorManager.endEdit(this.editingSession)

        this.editingSession.end()
    }
}
