import { HitTestManager } from '../hitTest/HitTestManager'
import { EditingSession } from '../editor/EditingSession'
import type { EditorManager } from '../editor/EditorManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { ViewportInteractionController } from './ViewportInterationController'

export class EditController {
    constructor(
        private readonly hitTestManager: HitTestManager,
        private readonly transformer: CoordinateTransformer,
        private readonly editingSession: EditingSession,
        private readonly editorManager: EditorManager,
        private readonly renderInvalidator: RenderInvalidator,
        private readonly viewportInteraction: ViewportInteractionController,
    ) {}

    public isEditing() {
        return this.editingSession.isEditing()
    }

    public handlePointerDown(event: ChartPointerEvent) {
        const result = this.hitTestManager.hitTest(event.point, this.transformer)

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
