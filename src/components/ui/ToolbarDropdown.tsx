import { useEffect, useRef, useState } from 'react'
// import { ChevronDown } from 'lucide-react'
import type { ToolbarDropdownItem } from './types'

export function ToolbarDropdown({ selectedId, options, tooltip, width, onChange }: ToolbarDropdownItem) {
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement>(null)

    const selected = options.find((o) => o.id === selectedId)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!ref.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={ref} className="toolbar-dropdown" style={{ width }}>
            <button
                className={`toolbar-btn ${open ? 'active' : ''}`}
                title={tooltip}
                onClick={() => setOpen((v) => !v)}
            >
                {selected?.icon}

                <span className="toolbar-dropdown-label">{selected?.label}</span>

                {/* <ChevronDown size={14} /> */}
            </button>

            {open && (
                <div className="toolbar-dropdown-menu">
                    {options.map((option) => (
                        <button
                            key={option.id}
                            className={`toolbar-dropdown-option ${option.id === selectedId ? 'selected' : ''}`}
                            disabled={option.disabled}
                            onClick={() => {
                                onChange?.(option)
                                setOpen(false)
                            }}
                        >
                            {option.icon}

                            <div className="toolbar-dropdown-text">
                                <div>{option.label}</div>

                                {option.subLabel && <div className="toolbar-dropdown-subtitle">{option.subLabel}</div>}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
