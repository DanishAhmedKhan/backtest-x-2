type Props = {
    x: number
}

export default function ReplayOverlay({ x }: Props) {
    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    left: x,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: '#2962ff',
                    pointerEvents: 'none',
                    zIndex: 1000,
                }}
            />

            <div
                style={{
                    position: 'absolute',
                    left: x + 2,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.45)',
                    pointerEvents: 'none',
                    zIndex: 999,
                }}
            />
        </>
    )
}
