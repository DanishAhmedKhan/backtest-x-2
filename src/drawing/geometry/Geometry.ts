export class Geometry {
    public static distanceSquared(x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1
        const dy = y2 - y1

        return dx * dx + dy * dy
    }

    public static distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Geometry.distanceSquared(x1, y1, x2, y2))
    }

    public static distanceToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
        const dx = x2 - x1
        const dy = y2 - y1

        if (dx === 0 && dy === 0) {
            return Geometry.distance(px, py, x1, y1)
        }

        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))

        const sx = x1 + t * dx
        const sy = y1 + t * dy

        return Geometry.distance(px, py, sx, sy)
    }
}
