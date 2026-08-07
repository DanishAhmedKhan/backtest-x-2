import { useCallback, useEffect, useState } from 'react'
import type { IChartApi } from 'lightweight-charts'

import type { PaneGeometry } from '../../drawing/renderer/PaneGeometry'
import type { PaneLayout } from '../../drawing/renderer/PaneLayout'

type Props = {
    containerRef: React.RefObject<HTMLDivElement | null>
    chartRef: React.RefObject<IChartApi | null>
    paneGeometryRef: React.RefObject<PaneGeometry | null>
}

// export function useChartLayout({ containerRef, chartRef, paneGeometryRef }: Props) {
//     const [paneLayout, setPaneLayout] = useState<PaneLayout | null>(null)

//     useEffect(() => {
//         const chart = chartRef.current
//         const container = containerRef.current

//         if (!chart || !container) return

//         const resize = () => {
//             chart.resize(container.clientWidth, container.clientHeight, true)

//             const pane = paneGeometryRef.current?.calculate()

//             if (!pane) {
//                 return
//             }

//             setPaneLayout((previous) => {
//                 if (
//                     previous &&
//                     previous.left === pane.left &&
//                     previous.top === pane.top &&
//                     previous.width === pane.width &&
//                     previous.height === pane.height
//                 ) {
//                     return previous
//                 }

//                 return pane
//             })
//         }

//         const observer = new ResizeObserver(resize)
//         observer.observe(container)

//         resize()

//         return () => {
//             observer.disconnect()
//         }
//     }, [chartRef, containerRef, paneGeometryRef])

//     return paneLayout
// }

export function useChartLayout({ containerRef, chartRef, paneGeometryRef }: Props) {
    const [paneLayout, setPaneLayout] = useState<PaneLayout | null>(null)

    const refreshPaneLayout = useCallback(() => {
        const pane = paneGeometryRef.current?.calculate()

        if (!pane) {
            return
        }

        setPaneLayout((previous) => {
            if (
                previous &&
                previous.left === pane.left &&
                previous.top === pane.top &&
                previous.width === pane.width &&
                previous.height === pane.height
            ) {
                return previous
            }

            return pane
        })
    }, [paneGeometryRef])

    useEffect(() => {
        const chart = chartRef.current
        const container = containerRef.current

        if (!chart || !container) return

        const resize = () => {
            chart.resize(container.clientWidth, container.clientHeight, true)
            refreshPaneLayout()
        }

        const observer = new ResizeObserver(resize)

        observer.observe(container)

        resize()

        return () => {
            observer.disconnect()
        }
    }, [chartRef, containerRef, refreshPaneLayout])

    return {
        paneLayout,
        refreshPaneLayout,
    }
}
