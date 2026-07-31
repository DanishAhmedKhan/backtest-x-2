import { forwardRef } from 'react'

type Props = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
    paneWidth: number
    paneHeight: number
}

const DrawingCanvas = forwardRef<HTMLCanvasElement, Props>(({ paneWidth, paneHeight, style, ...props }, ref) => {
    return (
        <canvas
            ref={ref}
            {...props}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,

                width: paneWidth,
                height: paneHeight,

                pointerEvents: 'none',
                zIndex: 99,
                ...style,
            }}
        />
    )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas
