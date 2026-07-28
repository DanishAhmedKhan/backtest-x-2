import type { Drawing } from '../drawings/Drawing'

import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'

export class DrawingActionManager {
    private readonly providers: DrawingActionProvider[] = []

    public register(provider: DrawingActionProvider) {
        this.providers.push(provider)
    }

    public getActions(drawing: Drawing): DrawingAction[] {
        return this.providers.find((provider) => provider.canProvideActions(drawing))?.getActions(drawing) ?? []
    }
}
