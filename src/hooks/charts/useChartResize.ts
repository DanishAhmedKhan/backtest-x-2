import { useEffect } from 'react'
import type { IChartApi } from 'lightweight-charts'

type Props = {
    containerRef: React.RefObject<HTMLDivElement | null>
    chartRef: React.RefObject<IChartApi | null>
    onResized?: () => void
}

export function useChartResize({ containerRef, chartRef, onResized }: Props) {
    useEffect(() => {
        const chart = chartRef.current
        const container = containerRef.current

        if (!chart || !container) return

        const resize = () => {
            chart.resize(container.clientWidth, container.clientHeight, true)

            onResized?.()
        }

        const observer = new ResizeObserver(resize)

        observer.observe(container)

        resize()

        return () => {
            observer.disconnect()
        }
    }, [chartRef, containerRef, onResized])
}
