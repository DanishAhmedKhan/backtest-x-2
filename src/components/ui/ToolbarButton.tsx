export type ToolbarButtonProps = {
    icon?: React.ReactNode
    label?: string
    tooltip?: string
    active?: boolean
    onClick?: () => void
}

export function ToolbarButton({ icon, label, tooltip, active, onClick }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            className={active ? 'toolbar-btn active' : 'toolbar-btn'}
            title={tooltip}
            onClick={onClick}
        >
            {icon && <span className="toolbar-icon">{icon}</span>}

            {label && <span className="toolbar-label">{label}</span>}
        </button>
    )
}
