import { forwardRef } from 'react'

const DrawingCanvas = forwardRef<HTMLCanvasElement>((props, ref) => {
    return (
        <canvas
            ref={ref}
            {...props}
            style={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 99,
            }}
        />
    )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas
