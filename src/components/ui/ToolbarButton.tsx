import type { ToolbarButtonItem } from './types'

export function ToolbarButton({ icon, label, tooltip, active, onClick }: ToolbarButtonItem) {
    return (
        <button className={active ? 'toolbar-btn active' : 'toolbar-btn'} title={tooltip} onClick={onClick}>
            {icon && <span className="toolbar-icon">{icon}</span>}
            {label && <span className="toolbar-label">{label}</span>}
        </button>
    )
}
