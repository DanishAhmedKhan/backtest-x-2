import type { Drawing } from '../drawings/Drawing'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { DrawingEditor } from './DrawingEditor'
import type { EditingSession } from './EditingSession'

export class EditorManager {
    private readonly editors: DrawingEditor[] = []

    public register(editor: DrawingEditor) {
        this.editors.push(editor)
    }

    private getEditor(drawing: Drawing) {
        return this.editors.find((editor) => editor.canEdit(drawing))
    }

    public beginEdit(session: EditingSession, event: ChartPointerEvent) {
        const drawing = session.getTarget()?.drawing

        if (!drawing) {
            return
        }

        this.getEditor(drawing)?.beginEdit(session, event)
    }

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const drawing = session.getTarget()?.drawing

        if (!drawing) {
            return
        }

        this.getEditor(drawing)?.updateEdit(session, event)
    }

    public endEdit(session: EditingSession) {
        const drawing = session.getTarget()?.drawing

        if (!drawing) {
            return
        }

        this.getEditor(drawing)?.endEdit(session)
    }
}
