import type { ScreenPoint } from '../renderer/CoordinateTransformer'
import type { PointerAnchor } from './PointerAnchor'

export type ChartPointerEvent = {
    screen: ScreenPoint
    // anchor: DrawingAnchor
    anchor: PointerAnchor
    shiftKey: boolean
    ctrlKey: boolean
    altKey: boolean
}
