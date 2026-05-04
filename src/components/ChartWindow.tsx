import { useRef } from 'react'
import ChartFrame from './ChartFrame'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'
import { useResize } from '../hooks/useResize'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
}

const vHandle = {
    width: '6px',
    background: '#3a3a3a',
    cursor: 'col-resize',
}

const hHandle = {
    height: '6px',
    background: '#3a3a3a',
    cursor: 'row-resize',
}

export default function ChartWindow({ charts, activeChartId, onSelectChart, layout }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const resize = useResize(containerRef, 50)
    const vertical = useResize(containerRef, 50)
    const horizontal = useResize(containerRef, 50)

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
            <div ref={containerRef} style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                <div style={{ width: `${resize.split}%`, minWidth: 0 }}>
                    <ChartFrame
                        chart={charts[0]}
                        isActive={charts[0].id === activeChartId}
                        onSelect={() => onSelectChart(charts[0].id)}
                    />
                </div>

                <div onMouseDown={resize.startDrag('vertical')} style={vHandle} />

                <div style={{ flex: 1, minWidth: 0 }}>
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
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <div style={{ height: `${horizontal.split}%`, display: 'flex' }}>
                    <div style={{ width: `${vertical.split}%`, minWidth: 0 }}>
                        <ChartFrame
                            chart={charts[0]}
                            isActive={charts[0].id === activeChartId}
                            onSelect={() => onSelectChart(charts[0].id)}
                        />
                    </div>

                    <div onMouseDown={vertical.startDrag('vertical')} style={vHandle} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <ChartFrame
                            chart={charts[1]}
                            isActive={charts[1].id === activeChartId}
                            onSelect={() => onSelectChart(charts[1].id)}
                        />
                    </div>
                </div>

                <div
                    onMouseDown={horizontal.startDrag('horizontal')}
                    style={{
                        ...hHandle,
                        position: 'absolute',
                        top: `${horizontal.split}%`,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                    }}
                />

                <div style={{ height: `${100 - horizontal.split}%`, display: 'flex' }}>
                    <div style={{ width: `${vertical.split}%`, minWidth: 0 }}>
                        <ChartFrame
                            chart={charts[2]}
                            isActive={charts[2].id === activeChartId}
                            onSelect={() => onSelectChart(charts[2].id)}
                        />
                    </div>

                    <div onMouseDown={vertical.startDrag('vertical')} style={vHandle} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <ChartFrame
                            chart={charts[3]}
                            isActive={charts[3].id === activeChartId}
                            onSelect={() => onSelectChart(charts[3].id)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return null
}
