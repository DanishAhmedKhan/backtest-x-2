type ToolbarIconProps = {
    className?: string
    svg: string
    width?: number
    height?: number
}

export function ToolbarIcon({ className = '', svg, width = 28, height = 28 }: ToolbarIconProps) {
    return <div className={className} style={{ width, height }} dangerouslySetInnerHTML={{ __html: svg }} />
}
