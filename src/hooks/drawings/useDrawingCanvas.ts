import { useEffect } from 'react'

type Params = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>

    containerRef: React.RefObject<HTMLDivElement | null>
}

export function useDrawingCanvas({ canvasRef, containerRef }: Params) {
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current

        if (!canvas || !container) {
            return
        }

        const resize = () => {
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight

            const ctx = canvas.getContext('2d')

            if (!ctx) {
                return
            }

            // ctx.fillStyle = 'red'
            // ctx.fillRect(20, 20, 120, 80)
        }

        resize()

        const observer = new ResizeObserver(resize)

        observer.observe(container)

        return () => observer.disconnect()
    }, [canvasRef, containerRef])
}
