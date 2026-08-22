import type { ScreenPoint } from '../renderer/CoordinateTransformer'
import type { PointerAnchor } from './PointerAnchor'

export type ChartPointerEvent = {
    screen: ScreenPoint
    anchor: PointerAnchor
    shiftKey: boolean
    ctrlKey: boolean
    altKey: boolean
}
