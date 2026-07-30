import type { ScreenPoint } from '../renderer/CoordinateTransformer'
import type { DrawingAnchor } from './DrawingAnchor'

export type ChartPointerEvent = {
    screen: ScreenPoint
    anchor: DrawingAnchor
    shiftKey: boolean
    ctrlKey: boolean
    altKey: boolean
}
