import type { PaneLayout } from '../drawing/renderer/PaneLayout'

type Props = {
    x: number
    pane: PaneLayout
}

export default function ReplayOverlay({ x, pane }: Props) {
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
                    background: 'rgba(255,255,255,0.45)',
                    pointerEvents: 'none',
                    zIndex: 999,
                }}
            />
        </>
    )
}
