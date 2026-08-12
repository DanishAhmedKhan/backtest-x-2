import type { Point } from './Point'

export class RectangleGeometry {
    public static isNearBoundary(
        point: Point,
        left: number,
        top: number,
        right: number,
        bottom: number,
        tolerance: number,
    ): boolean {
        const nearTop = point.x >= left && point.x <= right && Math.abs(point.y - top) <= tolerance
        const nearBottom = point.x >= left && point.x <= right && Math.abs(point.y - bottom) <= tolerance
        const nearLeft = point.y >= top && point.y <= bottom && Math.abs(point.x - left) <= tolerance
        const nearRight = point.y >= top && point.y <= bottom && Math.abs(point.x - right) <= tolerance

        return nearTop || nearBottom || nearLeft || nearRight
    }
}
