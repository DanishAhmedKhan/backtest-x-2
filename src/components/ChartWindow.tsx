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

    const renderChart = (chart: ChartState, frameId: string) => (
        <ChartFrame
            id={frameId}
            chart={chart}
            isActive={chart.id === activeChartId}
            onSelect={() => onSelectChart(chart.id)}
        />
    )

    const chartId = (index: number) => `${layout}-${index + 1}`

    const renderVerticalHandle = (onMouseDown: React.MouseEventHandler<HTMLDivElement>) => (
        <div
            onMouseDown={onMouseDown}
            style={{
                width: HANDLE_SIZE,
                background: '#3a3a3a',
                cursor: 'col-resize',
            }}
        />
    )

    const renderHorizontalHandle = (
        onMouseDown: React.MouseEventHandler<HTMLDivElement>,
        style?: React.CSSProperties,
    ) => (
        <div
            onMouseDown={onMouseDown}
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: HANDLE_SIZE,
                background: '#3a3a3a',
                cursor: 'row-resize',
                zIndex: 10,
                ...style,
            }}
        />
    )

    if (layout === '1x1') {
        return (
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
                {renderChart(charts[0], chartId(0))}
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
                <div style={{ width: leftPx, minWidth: 0 }}>{renderChart(charts[0], chartId(0))}</div>

                {renderVerticalHandle(resize.startDrag('vertical'))}

                <div style={{ width: rightPx, minWidth: 0 }}>{renderChart(charts[1], chartId(1))}</div>
            </div>
        )
    }

    if (layout === '2x2') {
        const leftPx = vertical.size ?? width / 2
        const rightPx = width - leftPx - HANDLE_SIZE

        const topPx = horizontal.size ?? height / 2
        const bottomPx = height - topPx

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
                    <div style={{ width: leftPx, minWidth: 0 }}>{renderChart(charts[0], chartId(0))}</div>

                    {renderVerticalHandle(resize.startDrag('vertical'))}

                    <div style={{ width: rightPx, minWidth: 0 }}>{renderChart(charts[1], chartId(1))}</div>
                </div>

                {renderHorizontalHandle(horizontal.startDrag('horizontal'), {
                    top: topPx,
                })}

                <div style={{ display: 'flex', height: bottomPx }}>
                    <div style={{ width: leftPx, minWidth: 0 }}>{renderChart(charts[2], chartId(2))}</div>

                    {renderVerticalHandle(resize.startDrag('vertical'))}

                    <div style={{ width: rightPx, minWidth: 0 }}>{renderChart(charts[3], chartId(3))}</div>
                </div>
            </div>
        )
    }

    if (layout === '3x1') {
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
                <div style={{ width: leftPx, minWidth: 0 }}>{renderChart(charts[0], chartId(0))}</div>

                {renderVerticalHandle(resize.startDrag('vertical'))}

                <div style={{ width: rightPx, minWidth: 0 }}>{renderChart(charts[1], chartId(1))}</div>

                {renderVerticalHandle(resize.startDrag('vertical'))}

                <div style={{ width: rightPx, minWidth: 0 }}>{renderChart(charts[2], chartId(2))}</div>
            </div>
        )
    }

    return null
}
