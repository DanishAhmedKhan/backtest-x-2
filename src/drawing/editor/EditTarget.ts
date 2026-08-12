import type { Drawing } from '../drawings/Drawing'
import type { HitTarget } from '../hitTest/HitTarget'

export type EditTarget = {
    drawing: Drawing
    target: HitTarget
    handle: null
}
