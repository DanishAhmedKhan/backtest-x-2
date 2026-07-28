import { Geometry } from './Geometry'

import type { Point } from './Point'
import type { LineSegment } from './LineSegment'

export class LineGeometry {
    public static isNearHandle(mouse: Point, handle: Point, radius: number) {
        return Geometry.distance(mouse, handle) <= radius
    }

    public static isNearBody(mouse: Point, segment: LineSegment, tolerance: number) {
        return Geometry.distanceToSegment(mouse, segment) <= tolerance
    }
}
