export const CursorType = {
    None: 'none',
    Default: 'default',
    Pointer: 'pointer',
    Move: 'move',
    Crosshair: 'crosshair',
    Grab: 'grab',
    Grabbing: 'grabbing',
    NS: 'ns-resize',
    EW: 'ew-resize',
    NWSE: 'nwse-resize',
    NESW: 'nesw-resize',
} as const

export type CursorType = (typeof CursorType)[keyof typeof CursorType]
