import type { Drawing } from '../drawings/Drawing'

export enum HitTarget {
    None = 'none',

    Body = 'body',

    StartHandle = 'start-handle',

    EndHandle = 'end-handle',
}

export interface HitTestResult {
    drawing: Drawing

    target: HitTarget
}
