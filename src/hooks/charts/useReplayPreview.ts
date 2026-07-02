import { useEffect, useState } from 'react'
import type { IChartApi, Time } from 'lightweight-charts'
import { eventBus } from '../../event/EventBus'

type Props = {
    chartRef: React.RefObject<IChartApi | null>
}

export function useReplayPreview({ chartRef }: Props) {
    const [previewTime, setPreviewTime] = useState<number | null>(null)
    const [previewX, setPreviewX] = useState<number | null>(null)

    useEffect(() => {
        const unsubscribe = eventBus.on('replayPreviewMove', ({ time }) => {
            setPreviewTime(time)
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        const chart = chartRef.current

        if (!chart || previewTime === null) {
            setPreviewX(null)
            return
        }

        const x = chart.timeScale().timeToCoordinate(previewTime as Time)

        setPreviewX(x ?? null)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewTime])

    return {
        previewTime,
        previewX,
        clearPreview: () => {
            setPreviewTime(null)
            setPreviewX(null)
        },
    }
}
