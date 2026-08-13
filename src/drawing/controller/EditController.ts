import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { EditingSession } from '../editor/EditingSession'
import type { EditorManager } from '../editor/EditorManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { ViewportInteractionController } from './ViewportInterationController'
import type { HitTestResult } from '../hitTest/HitTestResult'
import type { Point } from '../geometry/Point'

export class EditController {
    private startScreenPoint: Point | null = null

    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly editorManager: EditorManager,
        private readonly editingSession: EditingSession,
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
                handle: hit.handle,
            },
            event.anchor,
            hit.drawing.clone(),
        )

        this.startScreenPoint = { ...event.screen }

        this.drawingStateManager.setMoving(false)

        this.viewportInteraction.disableViewportInteraction()

        this.editorManager.beginEdit(this.editingSession, event)
    }

    public handlePointerMove(event: ChartPointerEvent) {
        if (!this.editingSession.isEditing()) {
            return
        }

        if (this.startScreenPoint) {
            const EDIT_MOVE_THRESHOLD = 2
            const dx = event.screen.x - this.startScreenPoint.x
            const dy = event.screen.y - this.startScreenPoint.y

            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance >= EDIT_MOVE_THRESHOLD) {
                this.drawingStateManager.setMoving(true)
            }
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

        this.drawingStateManager.setMoving(false)

        this.startScreenPoint = null

        this.editingSession.end()
    }
}
