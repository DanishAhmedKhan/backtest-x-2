import { useEffect, useRef } from 'react'

type PopupPlacement = 'bottom' | 'top' | 'left' | 'right'

type Props = {
    open: boolean
    placement?: PopupPlacement
    onClose: () => void
    children: React.ReactNode
}

export function Popup({ open, placement = 'bottom', onClose, children }: Props) {
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

    const position = getPlacementStyle(placement)

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',

                ...position,

                background: '#1f1f1f',
                border: '1px solid #444',
                borderRadius: 6,

                padding: 4,

                display: 'flex',
                flexDirection: 'column',
                gap: 2,

                boxShadow: '0 4px 12px rgba(0,0,0,.4)',

                zIndex: 1000,
            }}
        >
            {children}
        </div>
    )
}

function getPlacementStyle(placement: PopupPlacement): React.CSSProperties {
    switch (placement) {
        case 'bottom':
            return {
                top: '110%',
                left: 0,
            }

        case 'top':
            return {
                bottom: '110%',
                left: 0,
            }

        case 'left':
            return {
                right: '110%',
                top: 0,
            }

        case 'right':
            return {
                left: '110%',
                top: 0,
            }
    }
}
