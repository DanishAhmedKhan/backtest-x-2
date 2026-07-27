import type { Drawing } from '../drawings/Drawing'
import type { HitTarget } from '../hitTest/HitTestResult'

export interface EditTarget {
    drawing: Drawing

    target: HitTarget
}
