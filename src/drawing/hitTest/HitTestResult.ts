import type { Drawing } from '../drawings/Drawing'
import type { CursorType } from '../../core/cursor/CursorType'
import type { HitTarget } from './HitTarget'

export type HitTestResult<THandle = null> = {
    drawing: Drawing
    target: HitTarget
    handle: THandle | null
    cursor: CursorType
}
