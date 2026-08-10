import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import ChartFrame from './ChartFrame'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'
import { createLayout } from '../layout/layoutTemplates'
import { computeLayoutRects, HANDLE_SIZE } from '../layout/layoutEngine'
import { useLayoutResize } from '../hooks/useLayoutResize'
import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
    onDrawingToolbarManagerReady?: (manager: DrawingToolbarManager) => void
}

export default function ChartWindow({
    charts,
    activeChartId,
    onSelectChart,
    layout,
    onDrawingToolbarManagerReady,
}: Props) {
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
        <div className="chart-window" ref={containerRef}>
            {rects.charts.map(({ node, rect }) => {
                const chart = charts[node.chartIndex]

                if (!chart) return null

                return (
                    <div
                        key={node.id}
                        className="chart-framw-wrapper"
                        style={{
                            left: rect.left,
                            top: rect.top,
                            width: rect.width,
                            height: rect.height,
                        }}
                    >
                        <ChartFrame
                            id={node.id}
                            chart={chart}
                            isActive={chart.id === activeChartId}
                            onSelect={() => onSelectChart(chart.id)}
                            onDrawingToolbarManagerReady={onDrawingToolbarManagerReady}
                        />
                    </div>
                )
            })}

            {rects.splits.map(({ node, rect }) => {
                if (node.direction === 'vertical') {
                    const availableWidth = rect.width - HANDLE_SIZE
                    const firstWidth = splits[node.id] ?? Math.round(availableWidth * node.split)

                    return (
                        <div
                            key={node.id}
                            className="chart-handle chart-vertical-handle"
                            onMouseDown={startDrag(node.id, 'vertical', rect, firstWidth)}
                            style={{
                                left: rect.left + firstWidth,
                                top: rect.top,
                                width: HANDLE_SIZE,
                                height: rect.height,
                            }}
                        />
                    )
                }

                const availableHeight = rect.height - HANDLE_SIZE
                const firstHeight = splits[node.id] ?? Math.round(availableHeight * node.split)

                return (
                    <div
                        key={node.id}
                        className="chart-handle chart-horizontal-handle "
                        onMouseDown={startDrag(node.id, 'horizontal', rect, firstHeight)}
                        style={{
                            left: rect.left,
                            top: rect.top + firstHeight,
                            width: rect.width,
                            height: HANDLE_SIZE,
                        }}
                    />
                )
            })}
        </div>
    )
}
