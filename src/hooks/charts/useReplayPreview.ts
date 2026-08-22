import { useCallback, useEffect, useRef, useState } from 'react'
import type { IChartApi, Time } from 'lightweight-charts'
import { eventBus } from '../../event/EventBus'

type Props = {
    chartRef: React.RefObject<IChartApi | null>
}

export function useReplayPreview({ chartRef }: Props) {
    const [previewTime, setPreviewTime] = useState<number | null>(null)
    const [previewX, setPreviewX] = useState<number | null>(null)

    const previewTimeRef = useRef<number | null>(null)

    useEffect(() => {
        const unsubscribe = eventBus.on('replayPreviewMove', ({ time }) => {
            previewTimeRef.current = time
            setPreviewTime(time)
        })

        return unsubscribe
    }, [])

    const updatePreviewX = useCallback(() => {
        const chart = chartRef.current
        const time = previewTimeRef.current

        if (!chart || time === null) {
            setPreviewX(null)
            return
        }

        const x = chart.timeScale().timeToCoordinate(time as Time)

        setPreviewX(x ?? null)
    }, [chartRef])

    useEffect(() => {
        updatePreviewX()
    }, [previewTime, updatePreviewX])

    useEffect(() => {
        const chart = chartRef.current

        if (!chart) return

        const timeScale = chart.timeScale()

        timeScale.subscribeVisibleLogicalRangeChange(updatePreviewX)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(updatePreviewX)
        }
    }, [chartRef, updatePreviewX])

    return {
        previewTime,
        previewX,
        updatePreviewX,

        clearPreview: () => {
            previewTimeRef.current = null
            setPreviewTime(null)
            setPreviewX(null)
        },
    }
}
