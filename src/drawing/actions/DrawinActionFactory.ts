import type { Drawing } from '../drawings/Drawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { DrawingAction, DrawingActionMap, ValueActionId } from './DrawingAction'

export class DrawingActionFactory {
    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public value<T>(
        id: Extract<DrawingAction['id'], 'color' | 'line-width' | 'style' | 'background'>,
        label: string,
        value: T,
        execute: (value: T) => void,
    ): DrawingAction {
        return {
            id,
            label,
            value,
            execute: (value) => {
                execute(value)

                this.drawingStateManager.refresh()
                this.renderInvalidator.invalidate()
            },
        } as DrawingAction
    }

    public create<K extends ValueActionId>(
        id: K,
        label: string,
        value: DrawingActionMap[K] extends { value: infer V } ? V : never,
        action: DrawingActionMap[K] extends {
            execute: (value: infer V) => void
        }
            ? (value: V) => void
            : never,
    ): DrawingAction {
        return {
            id,
            label,
            value,
            execute: (value) => {
                action(value)
                this.drawingStateManager.refresh()
                this.renderInvalidator.invalidate()
            },
        } as DrawingAction
    }

    public command<K extends keyof DrawingActionMap>(id: K, label: string, action: () => void): DrawingAction {
        return {
            id,
            label,
            execute: () => {
                action()

                this.drawingStateManager.refresh()
                this.renderInvalidator.invalidate()
            },
        } as DrawingAction
    }

    public delete(drawing: Drawing, drawingManager: DrawingManager): DrawingAction {
        return {
            id: 'delete',
            label: 'Delete',
            execute: () => {
                drawingManager.removeDrawing(drawing.id)

                this.drawingStateManager.clearSelection()
                this.renderInvalidator.invalidate()
            },
        }
    }
}
