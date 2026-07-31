import { useEffect, useRef, useState } from 'react'
import type { ToolbarDropdownBaseProps } from './types'

export function ToolbarDropdown({
    selectedId,
    renderTrigger,
    options,
    tooltip,
    width,
    dropdown,
    onChange,
}: ToolbarDropdownBaseProps) {
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const [position, setPosition] = useState({
        left: 0,
        top: 0,
    })

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

    useEffect(() => {
        if (!open) return

        const trigger = ref.current
        const popup = popupRef.current

        if (!trigger || !popup) return

        const triggerRect = trigger.getBoundingClientRect()
        const popupRect = popup.getBoundingClientRect()

        const margin = 8

        let left = triggerRect.left
        let top = triggerRect.bottom + 4

        if (left + popupRect.width > window.innerWidth - margin) {
            left = window.innerWidth - popupRect.width - margin
        }

        if (left < margin) {
            left = margin
        }

        if (top + popupRect.height > window.innerHeight - margin) {
            top = triggerRect.top - popupRect.height - 4
        }

        if (top < margin) {
            top = margin
        }

        setPosition({
            left,
            top,
        })
    }, [open])

    return (
        <div ref={ref} className="toolbar-dropdown" style={{ width }}>
            <button
                className={`toolbar-main ${open ? 'active' : ''}`}
                title={tooltip}
                onClick={() => setOpen((v) => !v)}
            >
                {renderTrigger ? (
                    renderTrigger({
                        selected,
                        open,
                    })
                ) : (
                    <>
                        {selected?.icon}
                        <span className="toolbar-dropdown-label">{selected?.label}</span>
                    </>
                )}
            </button>

            {open && (
                <div
                    ref={popupRef}
                    className="toolbar-dropdown-menu"
                    style={{
                        position: 'fixed',
                        left: position.left,
                        top: position.top,
                    }}
                >
                    {dropdown
                        ? dropdown({
                              selectedId,
                              close: () => setOpen(false),
                              select: (option) => {
                                  onChange?.(option)
                                  setOpen(false)
                              },
                          })
                        : options?.map((option) => (
                              <button
                                  key={option.id}
                                  className={`toolbar-dropdown-option ${option.id === selected?.id ? 'selected' : ''}`}
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
            )}
        </div>
    )
}
