import svg from '../../svg/svg'
import { ToolbarIcon } from './ToolbarIcon'
import { ToolbarDropdown, type ToolbarDropdownOption } from './ToolbarDropdown'

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
                    <ToolbarIcon className="toolbar-arrow" svg={svg.dropdown} width={8} height={4} />
                </div>
            )}
        />
    )
}
