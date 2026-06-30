import { useRef, useState, useLayoutEffect } from 'react'
import ChartFrame from './ChartFrame'
import type { ChartState } from '../types/ChartState'
import type { LayoutNode, LayoutType } from '../types/Layout'
import { createLayout } from '../layout/layoutTemplates'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
}

const HANDLE_SIZE = 6

export default function ChartWindow({ charts, activeChartId, onSelectChart, layout }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const [, setSize] = useState({ width: 0, height: 0 })

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

    const renderChart = (chart: ChartState, frameId: string) => (
        <ChartFrame
            id={frameId}
            chart={chart}
            isActive={chart.id === activeChartId}
            onSelect={() => onSelectChart(chart.id)}
        />
    )

    const renderNode = (node: LayoutNode): React.ReactNode => {
        if (node.type === 'chart') {
            const chart = charts[node.chartIndex]

            return (
                <div
                    key={node.id}
                    style={{
                        width: '100%',
                        height: '100%',
                        minWidth: 0,
                        minHeight: 0,
                    }}
                >
                    {renderChart(chart, node.id)}
                </div>
            )
        }

        const firstPercent = node.split * 100
        const secondPercent = (1 - node.split) * 100

        if (node.direction === 'vertical') {
            return (
                <div
                    key={node.id}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: `calc(${firstPercent}% - ${HANDLE_SIZE / 2}px)`,
                            height: '100%',
                            minWidth: 0,
                        }}
                    >
                        {renderNode(node.first)}
                    </div>

                    <div
                        style={{
                            width: HANDLE_SIZE,
                            background: '#3a3a3a',
                            cursor: 'col-resize',
                            flexShrink: 0,
                        }}
                    />

                    <div
                        style={{
                            width: `calc(${secondPercent}% - ${HANDLE_SIZE / 2}px)`,
                            height: '100%',
                            minWidth: 0,
                        }}
                    >
                        {renderNode(node.second)}
                    </div>
                </div>
            )
        }

        return (
            <div
                key={node.id}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: `calc(${firstPercent}% - ${HANDLE_SIZE / 2}px)`,
                        minHeight: 0,
                    }}
                >
                    {renderNode(node.first)}
                </div>

                <div
                    style={{
                        height: HANDLE_SIZE,
                        background: '#3a3a3a',
                        cursor: 'row-resize',
                        flexShrink: 0,
                    }}
                />

                <div
                    style={{
                        height: `calc(${secondPercent}% - ${HANDLE_SIZE / 2}px)`,
                        minHeight: 0,
                    }}
                >
                    {renderNode(node.second)}
                </div>
            </div>
        )
    }

    const root = createLayout(layout)

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {renderNode(root)}
        </div>
    )
}
