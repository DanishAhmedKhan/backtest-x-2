import type { PaneLayout } from '../drawing/renderer/PaneLayout'
import svg from '../svg/svg'

type Props = {
    x: number
    y: number | null
    pane: PaneLayout
}

export default function ReplayOverlay({ x, y, pane }: Props) {
    const overlayWidth = Math.max(0, pane.left + pane.width - (x + 2))

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    left: x,
                    top: pane.top,
                    width: 2,
                    height: pane.height,
                    background: '#2962ff',
                    pointerEvents: 'none',
                    zIndex: 1000,
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    left: x + 2,
                    top: pane.top,
                    width: overlayWidth,
                    height: pane.height,
                    background: 'rgba(255, 255, 255, 0.45)',
                    pointerEvents: 'none',
                    zIndex: 999,
                }}
            />

            {y !== null && (
                <div
                    style={{
                        position: 'absolute',
                        left: x + 1,
                        top: y,
                        transform: 'translate(-50%, -50%) rotate(-90deg)',
                        width: 24,
                        height: 24,
                        pointerEvents: 'none',
                        zIndex: 1001,
                    }}
                    dangerouslySetInnerHTML={{
                        __html: svg.scissor,
                    }}
                />
            )}
        </>
    )
}
