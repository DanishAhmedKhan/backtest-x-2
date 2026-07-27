import { EditingSession } from '../editor/EditingSession'
import type { EditorManager } from '../editor/EditorManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { ViewportInteractionController } from './ViewportInterationController'
import type { HitTestResult } from '../hitTest/HitTestResult'

export class EditController {
    constructor(
        private readonly editingSession: EditingSession,
        private readonly editorManager: EditorManager,
        private readonly renderInvalidator: RenderInvalidator,
        private readonly viewportInteraction: ViewportInteractionController,
    ) {}

    public isEditing() {
        return this.editingSession.isEditing()
    }

    public handlePointerDown(event: ChartPointerEvent, hit: HitTestResult) {
        this.editingSession.begin(
            {
                drawing: hit.drawing,
                target: hit.target,
            },
            event.point,
            hit.drawing.clone(),
        )

        this.viewportInteraction.disableViewportInteraction()

        this.editorManager.beginEdit(this.editingSession, event)
    }

    public handlePointerMove(event: ChartPointerEvent) {
        if (!this.editingSession.isEditing()) {
            return
        }

        this.editorManager.updateEdit(this.editingSession, event)

        this.renderInvalidator.invalidate()
    }

    public handlePointerUp() {
        if (!this.editingSession.isEditing()) {
            return
        }

        this.editorManager.endEdit(this.editingSession)

        this.viewportInteraction.enableViewportInteraction()

        this.editingSession.end()
    }
}
