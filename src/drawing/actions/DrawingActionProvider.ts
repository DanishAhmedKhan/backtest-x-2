import type { Drawing } from '../drawings/Drawing'
import type { DrawingAction } from './DrawingAction'

export interface DrawingActionProvider<T extends Drawing = Drawing> {
    canProvideActions(drawing: Drawing): drawing is T

    getActions(drawing: T): DrawingAction[]
}
