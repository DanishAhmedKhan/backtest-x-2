type ToolIconProps = {
    className?: string
    svg: string
    width?: number
    height?: number
}

export function ToolIcon({ className = '', svg, width = 28, height = 28 }: ToolIconProps) {
    return <div className={className} style={{ width, height }} dangerouslySetInnerHTML={{ __html: svg }} />
}
