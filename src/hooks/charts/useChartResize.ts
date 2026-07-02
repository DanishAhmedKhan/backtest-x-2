import { useEffect } from 'react'
import type { IChartApi } from 'lightweight-charts'

type Props = {
    containerRef: React.RefObject<HTMLDivElement | null>
    chartRef: React.RefObject<IChartApi | null>
}

export function useChartResize({ containerRef, chartRef }: Props) {
    useEffect(() => {
        const chart = chartRef.current
        const container = containerRef.current

        if (!chart || !container) {
            return
        }

        const resize = () => {
            chart.resize(container.clientWidth, container.clientHeight, true)
        }

        const observer = new ResizeObserver(resize)

        observer.observe(container)

        resize()

        return () => {
            observer.disconnect()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
