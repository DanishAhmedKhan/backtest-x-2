import { useRef, useState } from 'react'
import { LocalStorageProvider } from '../../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../../storage/key'
import svg from '../../svg/svg'

type Props = {
    children: React.ReactNode
    storageKey: string
    initialX?: number
    initialY?: number
    className?: string
}

type FloatingToolbarPosition = {
    x: number
    y: number
}

const storage = new LocalStorageProvider()

export function FloatingToolbar({
    children,
    storageKey,
    initialX = window.innerWidth / 2 - 200,
    initialY = 80,
    className,
}: Props) {
    const savedPositions =
        storage.get<Record<string, FloatingToolbarPosition>>(STORAGE_KEYS.FLOATING_TOOLBAR_POSITIONS) ?? {}

    const savedPosition = savedPositions[storageKey]

    const initialPosition = {
        x: savedPosition?.x ?? initialX,
        y: savedPosition?.y ?? initialY,
    }

    const [position, setPosition] = useState(initialPosition)

    const positionRef = useRef(initialPosition)
    const draggingRef = useRef(false)

    const offsetRef = useRef({
        x: 0,
        y: 0,
    })

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        draggingRef.current = true

        offsetRef.current = {
            x: e.clientX - positionRef.current.x,
            y: e.clientY - positionRef.current.y,
        }

        const handleMouseMove = (event: MouseEvent) => {
            if (!draggingRef.current) return

            const nextPosition = {
                x: event.clientX - offsetRef.current.x,
                y: event.clientY - offsetRef.current.y,
            }

            positionRef.current = nextPosition
            setPosition(nextPosition)
        }

        const handleMouseUp = () => {
            draggingRef.current = false

            const positions =
                storage.get<Record<string, FloatingToolbarPosition>>(STORAGE_KEYS.FLOATING_TOOLBAR_POSITIONS) ?? {}

            positions[storageKey] = positionRef.current

            storage.set(STORAGE_KEYS.FLOATING_TOOLBAR_POSITIONS, positions)

            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <div
            className={`floating-toolbar ${className ?? ''}`}
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <div
                className="floating-toolbar-handle"
                onMouseDown={handleMouseDown}
                style={{ width: 28, height: 28 }}
                dangerouslySetInnerHTML={{
                    __html: svg.drag,
                }}
            />

            <div className="floating-toolbar-content">{children}</div>
        </div>
    )
}
