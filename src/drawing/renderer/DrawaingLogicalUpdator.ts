import type { DrawingManager } from '../managers/DrawingManager'
import { LineDrawing } from '../drawings/LineDrawing'
import type { TimeCoordinateResolver } from '../renderer/TimeCoordinateResolver'
import type { LogicalTimeCoordinateResolver } from './LogicalTimeCoordinateResolver'

export class DrawingLogicalUpdater {
    constructor(private readonly drawingManager: DrawingManager, private readonly resolver: TimeCoordinateResolver) {}
    public update() {
        for (const drawing of this.drawingManager.getDrawings()) {
            if (!(drawing instanceof LineDrawing)) {
                continue
            }

            const startLogical = this.resolver.timeToLogical(drawing.start.time)
            const endLogical = this.resolver.timeToLogical(drawing.end.time)

            if (startLogical != null) {
                drawing.start.logical = startLogical
            }

            if (endLogical != null) {
                drawing.end.logical = endLogical
            }
        }
    }
}
