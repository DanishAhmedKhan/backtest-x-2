import { useState } from 'react'
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

    const startDrag = (e: React.MouseEvent) => {
        const startX = e.clientX

        const onMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX
            const newSplit = Math.min(80, Math.max(20, split + dx * 0.1))
            setSplit(newSplit)
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
            <ChartFrame
                chart={charts[0]}
                isActive={charts[0].id === activeChartId}
                onSelect={() => onSelectChart(charts[0].id)}
            />
        )
    }

    if (layout === '2x1') {
        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ width: `${split}%`, height: '100%' }}>
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
                        background: '#2a2a2a',
                    }}
                />

                <div style={{ flex: 1, height: '100%' }}>
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
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    height: '100%',
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
