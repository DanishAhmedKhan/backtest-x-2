import { useEffect, useRef } from 'react'

import type { CandlestickData, IChartApi, Time } from 'lightweight-charts'
import { IndicatorManager } from '../../indicators/core/IndicatorManager'
import { toIndicatorCandles } from '../../indicators/core/toIndicatorCandles'

import { eventBus } from '../../event/EventBus'

type Props = {
    chartRef: React.RefObject<IChartApi | null>
    displayedCandlesRef: React.RefObject<CandlestickData<Time>[]>
    chartReady: boolean
}

export function useIndicators({ chartRef, displayedCandlesRef, chartReady }: Props) {
    const managerRef = useRef<IndicatorManager | null>(null)

    useEffect(() => {
        const chart = chartRef.current

        if (!chart || !chartReady) {
            return
        }

        const manager = new IndicatorManager(chart)

        managerRef.current = manager

        manager.addSMA('sma-20', 20, 'close')

        const update = () => {
            const displayedCandles = displayedCandlesRef.current

            if (!displayedCandles.length) {
                manager.update([])
                return
            }

            const candles = toIndicatorCandles(displayedCandles)

            manager.update(candles)
        }

        update()

        const unsubscribe = eventBus.on('chartDataChanged', update)

        return () => {
            unsubscribe()

            manager.dispose()
            managerRef.current = null
        }
    }, [chartReady, chartRef, displayedCandlesRef])

    return managerRef
}
