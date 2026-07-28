import type { Point } from './Point'
import type { LineSegment } from './LineSegment'

export class Geometry {
    public static distanceSquared(a: Point, b: Point) {
        const dx = b.x - a.x
        const dy = b.y - a.y

        return dx * dx + dy * dy
    }

    public static distance(a: Point, b: Point) {
        return Math.sqrt(this.distanceSquared(a, b))
    }

    public static distanceToSegment(point: Point, segment: LineSegment) {
        const { start, end } = segment

        const dx = end.x - start.x
        const dy = end.y - start.y

        if (dx === 0 && dy === 0) {
            return Geometry.distance(point, start)
        }

        const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)))

        const projection: Point = {
            x: start.x + t * dx,
            y: start.y + t * dy,
        }

        return Geometry.distance(point, projection)
    }
}
