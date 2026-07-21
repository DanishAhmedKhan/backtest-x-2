import type { ChartPoint } from './ChartPoint'

export interface ChartPointerEvent {
    point: ChartPoint

    shiftKey: boolean

    ctrlKey: boolean

    altKey: boolean
}
