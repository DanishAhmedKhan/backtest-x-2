import { useEffect, useRef, useState } from 'react'
import type { ToolbarDropdownItem } from './types'

export function ToolbarDropdown({
    selectedId,
    render,
    options,
    tooltip,
    width,
    dropdown,
    onChange,
}: ToolbarDropdownItem) {
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement>(null)

    const selected = options?.find((o) => o.id === selectedId)

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
                className={`toolbar-main ${open ? 'active' : ''}`}
                title={tooltip}
                onClick={() => setOpen((v) => !v)}
            >
                {render ? (
                    render(selected)
                ) : (
                    <>
                        {selected?.icon}
                        <span className="toolbar-dropdown-label">{selected?.label}</span>
                    </>
                )}
            </button>

            {open &&
                (dropdown ? (
                    dropdown({
                        selectedId,
                        close: () => setOpen(false),
                        select: (option) => {
                            onChange?.(option)
                            setOpen(false)
                        },
                    })
                ) : (
                    <div className="toolbar-dropdown-menu">
                        {options?.map((option) => (
                            <button
                                key={option.id}
                                className={`toolbar-dropdown-option ${option.id === selected.id ? 'selected' : ''}`}
                                disabled={option.disabled}
                                onClick={() => {
                                    onChange?.(option)
                                    setOpen(false)
                                }}
                            >
                                {option.icon}

                                <div className="toolbar-dropdown-text">
                                    <div>{option.label}</div>

                                    {option.subLabel && (
                                        <div className="toolbar-dropdown-subtitle">{option.subLabel}</div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
        </div>
    )
}
