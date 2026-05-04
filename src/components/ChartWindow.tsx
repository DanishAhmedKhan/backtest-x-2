import { useState, useRef } from 'react'
import ChartFrame from './ChartFrame'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
}

export default function ChartWindow({ charts, activeChartId, onSelectChart, layout }: Props) {
    const [split, setSplit] = useState(50)

    const containerRef = useRef<HTMLDivElement | null>(null)

    const startDrag = (e: React.MouseEvent) => {
        e.preventDefault()

        const container = containerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()

        const onMove = (moveEvent: MouseEvent) => {
            const x = moveEvent.clientX - rect.left
            const percentage = (x / rect.width) * 100

            const clamped = Math.min(80, Math.max(20, percentage))
            setSplit(clamped)
        }

        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    if (layout === '1x1') {
        return (
            <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
                <ChartFrame
                    chart={charts[0]}
                    isActive={charts[0].id === activeChartId}
                    onSelect={() => onSelectChart(charts[0].id)}
                />
            </div>
        )
    }

    if (layout === '2x1') {
        return (
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <div style={{ width: `${split}%`, height: '100%', minWidth: 0 }}>
                    <ChartFrame
                        chart={charts[0]}
                        isActive={charts[0].id === activeChartId}
                        onSelect={() => onSelectChart(charts[0].id)}
                    />
                </div>

                <div
                    onMouseDown={startDrag}
                    style={{
                        width: '6px',
                        cursor: 'col-resize',
                        position: 'relative',
                        background: 'transparent',
                    }}
                >
                    {/* <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: '50%',
                            width: '2px',
                            transform: 'translateX(-50%)',
                            background: '#444',
                        }}
                    /> */}
                </div>

                <div style={{ flex: 1, height: '100%', minWidth: 0 }}>
                    <ChartFrame
                        chart={charts[1]}
                        isActive={charts[1].id === activeChartId}
                        onSelect={() => onSelectChart(charts[1].id)}
                    />
                </div>
            </div>
        )
    }

    if (layout === '2x2') {
        return (
            <div
                ref={containerRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                {charts.map((chart) => (
                    <ChartFrame
                        key={chart.id}
                        chart={chart}
                        isActive={chart.id === activeChartId}
                        onSelect={() => onSelectChart(chart.id)}
                    />
                ))}
            </div>
        )
    }

    return null
}
