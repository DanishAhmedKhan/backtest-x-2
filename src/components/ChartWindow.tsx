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

    const root = useMemo(() => createLayout(layout), [layout])

    const rects = useMemo(
        () => computeLayoutRects(root, size.width, size.height, splits),
        [root, size.width, size.height, splits],
    )

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
            {/* Charts */}

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

            {/* Resize Handles */}

            {rects.splits.map(({ node, rect }) => {
                if (node.direction === 'vertical') {
                    const availableWidth = rect.width - HANDLE_SIZE

                    const firstWidth = splits[node.id] ?? Math.round(availableWidth * node.split)

                    return (
                        <div
                            key={node.id}
                            onMouseDown={startDrag(node.id, 'vertical', rect, firstWidth)}
                            style={{
                                position: 'absolute',
                                left: rect.left + firstWidth,
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

                const availableHeight = rect.height - HANDLE_SIZE

                const firstHeight = splits[node.id] ?? Math.round(availableHeight * node.split)

                return (
                    <div
                        key={node.id}
                        onMouseDown={startDrag(node.id, 'horizontal', rect, firstHeight)}
                        style={{
                            position: 'absolute',
                            left: rect.left,
                            top: rect.top + firstHeight,
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
