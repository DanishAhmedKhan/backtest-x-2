import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ToolbarDropdownContent, ToolbarDropdownOption, ToolbarDropdownRenderContext } from './types'
import { createPortal } from 'react-dom'

export interface ToolbarDropdownProps {
    selectedId: string
    options?: ToolbarDropdownOption[]
    renderTrigger?: (context: ToolbarDropdownRenderContext) => React.ReactNode
    width?: number | string
    tooltip?: string
    dropdown?: ToolbarDropdownContent
    onChange?: (option: ToolbarDropdownOption) => void
    triggerClassName?: string
}

export function ToolbarDropdown({
    selectedId,
    renderTrigger,
    options,
    width,
    dropdown,
    onChange,
    triggerClassName,
}: ToolbarDropdownProps) {
    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const [position, setPosition] = useState({
        left: 0,
        top: 0,
    })

    const openDropdown = () => setOpen(true)
    const closeDropdown = () => setOpen(false)
    const toggleDropdown = () => setOpen((v) => !v)

    const selected = options?.find((o) => o.id === selectedId)

    useEffect(() => {
        function handleMouseDownOutside(event: MouseEvent) {
            const target = event.target as Node

            if (!ref.current?.contains(target) && !popupRef.current?.contains(target)) {
                closeDropdown()
            }
        }

        document.addEventListener('mousedown', handleMouseDownOutside)

        return () => {
            document.removeEventListener('mousedown', handleMouseDownOutside)
        }
    }, [])

    useLayoutEffect(() => {
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
            {renderTrigger ? (
                renderTrigger({
                    selected,
                    open,
                    openDropdown,
                    closeDropdown,
                    toggleDropdown,
                })
            ) : (
                <button
                    type="button"
                    className={`toolbar-trigger ${triggerClassName ?? ''} ${open ? 'active' : ''}`}
                    onClick={toggleDropdown}
                >
                    {selected?.icon}

                    <span className="toolbar-dropdown-label">{selected?.label}</span>
                </button>
            )}

            {open &&
                createPortal(
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
                                  close: closeDropdown,
                                  select: (option) => {
                                      onChange?.(option)
                                      closeDropdown()
                                  },
                              })
                            : options?.map((option) => (
                                  <button
                                      type="button"
                                      key={option.id}
                                      className={`toolbar-dropdown-option ${
                                          option.id === selected?.id ? 'selected' : ''
                                      }`}
                                      disabled={option.disabled}
                                      onClick={() => {
                                          onChange?.(option)
                                          closeDropdown()
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
                    </div>,
                    document.body,
                )}
        </div>
    )
}
