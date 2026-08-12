import type { Drawing } from '../drawings/Drawing'
import type { CursorType } from '../../core/cursor/CursorType'

export enum HitTarget {
    None = 'none',

    Body = 'body',
    StartHandle = 'start-handle',
    EndHandle = 'end-handle',

    TopLeft = 'top-left',
    Top = 'top',
    TopRight = 'top-right',
    Right = 'right',
    BottomRight = 'bottom-right',
    Bottom = 'bottom',
    BottomLeft = 'bottom-left',
    Left = 'left',
}

export interface HitTestResult {
    drawing: Drawing
    target: HitTarget
    cursor: CursorType
}
