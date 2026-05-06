import { useRef, useState, useLayoutEffect } from 'react'
import ChartFrame from './ChartFrame'
import { useResize } from '../hooks/useResize'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
}

const HANDLE_SIZE = 6

export default function ChartWindow({ charts, activeChartId, onSelectChart, layout }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const [size, setSize] = useState({ width: 0, height: 0 })

    const resize = useResize(containerRef)
    const vertical = useResize(containerRef)
    const horizontal = useResize(containerRef)

    useLayoutEffect(() => {
        const el = containerRef.current
        if (!el) return

        const updateSize = () => {
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        updateSize()

        const observer = new ResizeObserver(updateSize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [])

    const { width, height } = size

    if (layout === '1x1') {
        return (
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
                <ChartFrame
                    id="1x1-1"
                    chart={charts[0]}
                    isActive={charts[0].id === activeChartId}
                    onSelect={() => onSelectChart(charts[0].id)}
                />
            </div>
        )
    }

    if (layout === '2x1') {
        const leftPx = resize.size ?? width / 2
        const rightPx = width - leftPx - HANDLE_SIZE

        return (
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <div style={{ width: leftPx, minWidth: 0 }}>
                    <ChartFrame
                        id="2x1-1"
                        chart={charts[0]}
                        isActive={charts[0].id === activeChartId}
                        onSelect={() => onSelectChart(charts[0].id)}
                    />
                </div>

                <div
                    onMouseDown={resize.startDrag('vertical')}
                    style={{
                        width: HANDLE_SIZE,
                        background: '#3a3a3a',
                        cursor: 'col-resize',
                    }}
                />

                <div style={{ width: rightPx, minWidth: 0 }}>
                    <ChartFrame
                        id="2x1-2"
                        chart={charts[1]}
                        isActive={charts[1].id === activeChartId}
                        onSelect={() => onSelectChart(charts[1].id)}
                    />
                </div>
            </div>
        )
    }

    if (layout === '2x2') {
        const leftPx = vertical.size ?? width / 2
        const rightPx = width - leftPx - HANDLE_SIZE

        const topPx = horizontal.size ?? height / 2
        const bottomPx = height - topPx - HANDLE_SIZE

        return (
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <div style={{ display: 'flex', height: topPx }}>
                    <div style={{ width: leftPx, minWidth: 0 }}>
                        <ChartFrame
                            id="2x2-1"
                            chart={charts[0]}
                            isActive={charts[0].id === activeChartId}
                            onSelect={() => onSelectChart(charts[0].id)}
                        />
                    </div>

                    <div
                        onMouseDown={vertical.startDrag('vertical')}
                        style={{
                            width: HANDLE_SIZE,
                            background: '#3a3a3a',
                            cursor: 'col-resize',
                        }}
                    />

                    <div style={{ width: rightPx, minWidth: 0 }}>
                        <ChartFrame
                            id="2x2-2"
                            chart={charts[1]}
                            isActive={charts[1].id === activeChartId}
                            onSelect={() => onSelectChart(charts[1].id)}
                        />
                    </div>
                </div>

                <div
                    onMouseDown={horizontal.startDrag('horizontal')}
                    style={{
                        position: 'absolute',
                        top: topPx,
                        left: 0,
                        right: 0,
                        height: HANDLE_SIZE,
                        background: '#3a3a3a',
                        cursor: 'row-resize',
                        zIndex: 10,
                    }}
                />

                <div style={{ display: 'flex', height: bottomPx }}>
                    <div style={{ width: leftPx, minWidth: 0 }}>
                        <ChartFrame
                            id="2x2-3"
                            chart={charts[2]}
                            isActive={charts[2].id === activeChartId}
                            onSelect={() => onSelectChart(charts[2].id)}
                        />
                    </div>

                    <div
                        onMouseDown={vertical.startDrag('vertical')}
                        style={{
                            width: HANDLE_SIZE,
                            background: '#3a3a3a',
                            cursor: 'col-resize',
                        }}
                    />

                    <div style={{ width: rightPx, minWidth: 0 }}>
                        <ChartFrame
                            id="2x2-4"
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
