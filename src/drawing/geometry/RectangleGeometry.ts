import type { Point } from './Point'

export class RectangleGeometry {
    public static isNearBoundary(point: Point, start: Point, end: Point, tolerance: number): boolean {
        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)
        const top = Math.min(start.y, end.y)
        const bottom = Math.max(start.y, end.y)

        const nearTop = point.x >= left && point.x <= right && Math.abs(point.y - top) <= tolerance
        const nearBottom = point.x >= left && point.x <= right && Math.abs(point.y - bottom) <= tolerance
        const nearLeft = point.y >= top && point.y <= bottom && Math.abs(point.x - left) <= tolerance
        const nearRight = point.y >= top && point.y <= bottom && Math.abs(point.x - right) <= tolerance

        return nearTop || nearBottom || nearLeft || nearRight
    }

    public static contains(point: Point, start: Point, end: Point): boolean {
        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)
        const top = Math.min(start.y, end.y)
        const bottom = Math.max(start.y, end.y)

        return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
    }
}
