import type { ToolbarButtonItem } from './types'

export function ToolbarButton({ icon, label, tooltip, active, onClick, popover }: ToolbarButtonItem) {
    return (
        <button className={active ? 'toolbar-btn active' : 'toolbar-btn'} title={tooltip} onClick={onClick}>
            {icon && <span className="toolbar-icon">{icon}</span>}
            {label && <span className="toolbar-label">{label}</span>}

            {popover && (
                <div className="toolbar-btn-popover">
                    <div className="">asda</div>
                    <div className="">huhge</div>
                    <div className="">eujnxiu</div>
                </div>
            )}
        </button>
    )
}
