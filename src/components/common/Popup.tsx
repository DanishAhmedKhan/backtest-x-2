import { useEffect, useRef } from 'react'

import { ToolbarIcon } from '../ui/ToolbarIcon'

import svg from '../../svg/svg'

type Props = {
    open: boolean
    width?: number
    height?: number
    title?: string
    onClose: () => void
    content: React.ReactNode
}

export function Popup({ open, width, height, title, onClose, content }: Props) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) {
            return
        }

        const handleMouseDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                onClose()
            }
        }

        window.addEventListener('mousedown', handleMouseDown)

        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
        }
    }, [open, onClose])

    if (!open) {
        return null
    }

    const size: React.CSSProperties = {}

    if (width) {
        size.width = `${width}px`
    }

    if (height) {
        size.height = `${height}px`
    }

    return (
        <div ref={ref} className="popup" style={size}>
            <div className="popup-header">
                <div className="popup-title">{title ?? 'Popup Header'}</div>

                <button type="button" className="popup-close" onClick={onClose} aria-label="Close">
                    <ToolbarIcon width={18} height={18} svg={svg.close} />
                </button>
            </div>

            <div className="popup-content">{content}</div>
        </div>
    )
}
