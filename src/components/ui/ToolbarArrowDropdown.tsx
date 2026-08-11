import svg from '../../svg/svg'
import { ToolIcon } from './ToolbarIcon'
import { ToolbarDropdown } from './ToolbarDropdown'
import type { ToolbarDropdownOption } from './types'

export interface ToolbarArrowDropdownProps {
    selectedId: string
    options: ToolbarDropdownOption[]
    width?: number | string
    tooltip?: string
    onChange?: (option: ToolbarDropdownOption) => void
}

export function ToolbarArrowDropdown({ selectedId, options, width, tooltip, onChange }: ToolbarArrowDropdownProps) {
    return (
        <ToolbarDropdown
            selectedId={selectedId}
            options={options}
            width={width}
            tooltip={tooltip}
            onChange={onChange}
            renderTrigger={({ open, toggleDropdown }) => (
                <div
                    className={`toolbar-trigger toolbar-arrow-trigger ${open ? 'active' : ''}`}
                    onClick={toggleDropdown}
                >
                    <ToolIcon className="toolbar-arrow" svg={svg.dropdown} width={8} height={4} />
                </div>
            )}
        />
    )
}
