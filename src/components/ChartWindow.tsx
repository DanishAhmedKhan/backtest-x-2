import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import ChartFrame from './ChartFrame'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'
import { createLayout } from '../layout/layoutTemplates'
import { computeLayoutRects, HANDLE_SIZE } from '../layout/layoutEngine'
import { useLayoutResize } from '../hooks/useLayoutResize'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
}

export default function ChartWindow({ charts, activeChartId, onSelectChart, layout }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const [size, setSize] = useState({
        width: 0,
        height: 0,
    })

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

    const { splits, startDrag } = useLayoutResize()

    const root = useMemo(() => {
        return createLayout(layout)
    }, [layout])

    const rects = useMemo(() => {
        return computeLayoutRects(root, size.width, size.height, splits)
    }, [root, size.width, size.height, splits])

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
            {rects.charts.map(({ node, rect }) => {
                const chart = charts[node.chartIndex]

                if (!chart) return null

                return (
                    <div
                        key={node.id}
                        style={{
                            position: 'absolute',
                            left: rect.left,
                            top: rect.top,
                            width: rect.width,
                            height: rect.height,
                            minWidth: 0,
                            minHeight: 0,
                        }}
                    >
                        <ChartFrame
                            id={node.id}
                            chart={chart}
                            isActive={chart.id === activeChartId}
                            onSelect={() => onSelectChart(chart.id)}
                        />
                    </div>
                )
            })}

            {rects.splits.map(({ node, rect }) => {
                const split = splits[node.id] ?? node.split

                if (node.direction === 'vertical') {
                    const x = rect.left + (rect.width - HANDLE_SIZE) * split

                    return (
                        <div
                            key={node.id}
                            onMouseDown={startDrag(node.id, 'vertical', rect)}
                            style={{
                                position: 'absolute',
                                left: x,
                                top: rect.top,
                                width: HANDLE_SIZE,
                                height: rect.height,
                                background: '#3a3a3a',
                                cursor: 'col-resize',
                                zIndex: 100,
                            }}
                        />
                    )
                }

                const y = rect.top + (rect.height - HANDLE_SIZE) * split

                return (
                    <div
                        key={node.id}
                        onMouseDown={startDrag(node.id, 'horizontal', rect)}
                        style={{
                            position: 'absolute',
                            left: rect.left,
                            top: y,
                            width: rect.width,
                            height: HANDLE_SIZE,
                            background: '#3a3a3a',
                            cursor: 'row-resize',
                            zIndex: 100,
                        }}
                    />
                )
            })}
        </div>
    )
}
