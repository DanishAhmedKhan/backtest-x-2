import { forwardRef } from 'react'

const DrawingCanvas = forwardRef<HTMLCanvasElement, React.CanvasHTMLAttributes<HTMLCanvasElement>>((props, ref) => {
    return (
        <canvas
            ref={ref}
            {...props}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 99,
                ...props.style,
            }}
        />
    )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas
