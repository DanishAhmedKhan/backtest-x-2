import type { ChartPoint } from './ChartPoint'

export type ChartPointerEvent = {
    screen: {
        x: number
        y: number
    }
    point: ChartPoint
    shiftKey: boolean
    ctrlKey: boolean
    altKey: boolean
}
