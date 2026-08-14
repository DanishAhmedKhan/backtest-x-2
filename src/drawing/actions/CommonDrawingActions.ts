import type { Drawing } from '../drawings/Drawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'

import type { DrawingActionFactory } from './DrawinActionFactory'

export class CommonDrawingActions {
    public static getActions(
        drawing: Drawing,
        drawingManager: DrawingManager,
        factory: DrawingActionFactory,
    ): DrawingAction[] {
        return [
            {
                id: 'settings',
                label: 'Settings',
                execute: () => {
                    console.log('Open Rectangle Settings')
                },
            },
            factory.delete(drawing, drawingManager),
        ]
    }
}
