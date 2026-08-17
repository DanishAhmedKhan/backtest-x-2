import type { Drawing } from '../drawings/Drawing'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { PointerAnchor } from '../models/PointerAnchor'
import type { TimeCoordinateResolver } from '../renderer/TimeCoordinateResolver'

import type { EditTarget } from './EditTarget'

export class EditingSession {
    private target: EditTarget | null = null

    private startPointer: PointerAnchor | null = null
    private originalDrawing: Drawing | null = null

    constructor(private readonly timeResolver: TimeCoordinateResolver) {}

    public begin(target: EditTarget, startPointer: PointerAnchor, originalDrawing: Drawing) {
        this.target = target
        this.startPointer = startPointer
        this.originalDrawing = originalDrawing
    }

    public end() {
        this.target = null
        this.startPointer = null
        this.originalDrawing = null
    }

    public getTarget() {
        return this.target
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

    public getLogicalDelta(event: ChartPointerEvent): number | null {
        if (!this.startPointer) {
            return null
        }

        return event.anchor.logical - this.startPointer.logical
    }

    public getPriceDelta(event: ChartPointerEvent): number | null {
        if (!this.startPointer) {
            return null
        }

        return event.anchor.price - this.startPointer.price
    }

    public getMovedAnchor(original: DrawingAnchor, event: ChartPointerEvent): DrawingAnchor | null {
        const logicalDelta = this.getLogicalDelta(event)
        const priceDelta = this.getPriceDelta(event)

        if (logicalDelta == null || priceDelta == null) {
            return null
        }

        const originalLogical = this.timeResolver.timeToContinuousLogical(original.time)

        if (originalLogical == null) {
            return null
        }

        const newLogical = originalLogical + logicalDelta

        const newTime = this.timeResolver.logicalToTime(newLogical)

        if (newTime == null) {
            return null
        }

        return {
            time: newTime,
            price: original.price + priceDelta,
        }
    }

    public getAnchorAtPointer(event: ChartPointerEvent): DrawingAnchor | null {
        const time = this.timeResolver.logicalToTime(event.anchor.logical)

        if (time == null) {
            return null
        }

        return {
            time,
            price: event.anchor.price,
        }
    }
}
