import { useEffect } from 'react'

type Params = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function useDrawingCanvas({ canvasRef }: Params) {
    useEffect(() => {
        const canvas = canvasRef.current

        if (!canvas) {
            return
        }

        const ctx = canvas.getContext('2d')

        if (!ctx) {
            return
        }

        const dpr = window.devicePixelRatio || 1

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }, [canvasRef])
}
