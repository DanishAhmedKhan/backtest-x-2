import type { Drawing } from '../drawings/Drawing'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { EditTarget } from './EditTarget'
import type { DrawingEditor } from './DrawingEditor'

export class EditorManager {
    private readonly editors: DrawingEditor[] = []

    public register(editor: DrawingEditor) {
        this.editors.push(editor)
    }

    private getEditor(drawing: Drawing) {
        return this.editors.find((editor) => editor.canEdit(drawing))
    }

    public beginEdit(target: EditTarget, event: ChartPointerEvent) {
        this.getEditor(target.drawing)?.beginEdit(target.drawing, target, event)
    }

    public updateEdit(target: EditTarget, event: ChartPointerEvent) {
        this.getEditor(target.drawing)?.updateEdit(target.drawing, target, event)
    }

    public endEdit(target: EditTarget) {
        this.getEditor(target.drawing)?.endEdit(target.drawing, target)
    }
}
