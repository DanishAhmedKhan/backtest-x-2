import type { Drawing } from '../drawings/Drawing'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { DrawingEditor } from './DrawingEditor'
import type { EditingSession } from './EditingSession'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export class EditorManager {
    private readonly editors: DrawingEditor[] = []

    constructor(private readonly drawingStateManager: DrawingStateManager) {}

    public register(editor: DrawingEditor) {
        this.editors.push(editor)
    }

    private getEditor(drawing: Drawing) {
        return this.editors.find((editor) => editor.canEdit(drawing))
    }

    public beginEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        this.drawingStateManager.setEditing(true)

        const drawing = target.drawing
        this.getEditor(drawing)?.beginEdit(session, event)
    }

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        this.getEditor(target.drawing)?.updateEdit(session, event)
    }

    public endEdit(session: EditingSession) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        this.getEditor(target.drawing)?.endEdit(session)

        this.drawingStateManager.setEditing(false)
    }
}
