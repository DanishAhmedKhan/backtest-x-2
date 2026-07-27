import type { Drawing } from '../drawings/Drawing'
import type { HitTarget } from '../hitTest/HitTestResult'
import type { ChartPoint } from '../models/ChartPoint'

import type { EditTarget } from './EditTarget'

export class EditingSession {
    private target: EditTarget | null = null

    private hitTarget: HitTarget | null = null

    private startPointer: ChartPoint | null = null

    private originalDrawing: Drawing | null = null

    public begin(target: EditTarget, startPointer: ChartPoint, originalDrawing: Drawing) {
        this.target = target
        this.hitTarget = target.target
        this.startPointer = startPointer
        this.originalDrawing = originalDrawing
    }

    public end() {
        this.target = null
        this.hitTarget = null
        this.startPointer = null
        this.originalDrawing = null
    }

    public getTarget() {
        return this.target
    }

    public getHitTarget() {
        return this.hitTarget
    }

    public getStartPointer() {
        return this.startPointer
    }

    public getOriginalDrawing() {
        return this.originalDrawing
    }

    public isEditing() {
        return this.target !== null
    }
}
