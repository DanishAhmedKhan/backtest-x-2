import { useEffect, useRef } from 'react'

import type { CandlestickData, IChartApi, Time } from 'lightweight-charts'

import { IndicatorManager } from '../../indicators/core/IndicatorManager'
import { indicatorStore } from '../../indicators/core/IndicatorStore'
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

        const updateData = () => {
            const displayedCandles = displayedCandlesRef.current

            const candles = toIndicatorCandles(displayedCandles)

            manager.update(candles)
        }

        const syncIndicators = () => {
            const configs = indicatorStore.getAll()

            manager.sync(configs)

            updateData()
        }

        syncIndicators()

        const unsubscribeStore = indicatorStore.subscribe(syncIndicators)

        const unsubscribeChartData = eventBus.on('chartDataChanged', updateData)

        return () => {
            unsubscribeStore()
            unsubscribeChartData()

            manager.dispose()
            managerRef.current = null
        }
    }, [chartReady, chartRef, displayedCandlesRef])

    return managerRef
}
