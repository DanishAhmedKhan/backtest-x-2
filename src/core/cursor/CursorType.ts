export const CursorType = {
    None: 'none',
    Default: 'default',
    Pointer: 'pointer',
    Move: 'move',
    Crosshair: 'crosshair',
    Grab: 'grab',
    Grabbing: 'grabbing',
    NsResize: 'ns-resize',
    EwResize: 'ew-resize',
    NwseResize: 'nwse-resize',
} as const

export type CursorType = (typeof CursorType)[keyof typeof CursorType]
