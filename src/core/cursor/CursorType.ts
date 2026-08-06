import svg from '../../svg/svg'

export const CursorType = {
    Default: 'default',
    Pointer: 'pointer',
    Move: 'move',
    Crosshair: 'crosshair',
    Grab: 'grab',
    Grabbing: 'grabbing',
    NsResize: 'ns-resize',
    EwResize: 'ew-resize',
    NwseResize: 'nwse-resize',
    ReplaySelection: `url("data:image/svg+xml,${encodeURIComponent(svg.cursor.scissor)}") 16 4, crosshair`,
} as const

export type CursorType = (typeof CursorType)[keyof typeof CursorType]
