import { useState } from "react"
import type { ToolbarSplitButtonItem } from "./types"

export function ToolbarSplitButton({
    icon,
    label,
    active,
    tooltip,
    onClick,
    dropdown,
}: ToolbarSplitButtonItem) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`toolbar-split ${active ? 'active' : ''}`}>
            <button
                className="toolbar-split-main"
                title={tooltip}
                onClick={onClick}
            >
                {icon}
                {label && <span>{label}</span>}
            </button>

            <button
                className="toolbar-split-arrow"
                onClick={() => setOpen(v => !v)}
            >
                <DropdownArrow open={open} />
            </button>

            {open && (
                <Popover>
                    {dropdown(...)}
                </Popover>
            )}
        </div>
    )
}