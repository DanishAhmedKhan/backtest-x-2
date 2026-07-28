import type { Drawing } from '../drawings/Drawing'
import type { CursorType } from '../CursorType'

export enum HitTarget {
    None = 'none',
    Body = 'body',
    StartHandle = 'start-handle',
    EndHandle = 'end-handle',
}

export interface HitTestResult {
    drawing: Drawing
    target: HitTarget
    cursor: CursorType
}
