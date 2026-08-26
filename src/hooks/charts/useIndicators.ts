import { useEffect, useRef } from 'react'

import type { CandlestickData, IChartApi, Time } from 'lightweight-charts'

import type { Timeframe } from '../../core/Timeframe'

import { IndicatorRenderer } from '../../indicators/rendering/IndicatorRenderer'
import { IndicatorManager } from '../../indicators/core/IndicatorManager'
import { indicatorStore } from '../../indicators/core/IndicatorStore'
import { toIndicatorCandles } from '../../indicators/core/toIndicatorCandles'

import { eventBus } from '../../event/EventBus'

type Props = {
    chartId: string
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    displayedCandlesRef: React.RefObject<CandlestickData<Time>[]>
    chartReady: boolean
}

export function useIndicators({ chartId, timeframe, chartRef, displayedCandlesRef, chartReady }: Props) {
    const managerRef = useRef<IndicatorManager | null>(null)

    useEffect(() => {
        const chart = chartRef.current

        if (!chart || !chartReady) return

        const renderer = new IndicatorRenderer(chart)
        const manager = new IndicatorManager(renderer, timeframe)

        managerRef.current = manager

        const updateData = () => {
            const displayedCandles = displayedCandlesRef.current

            const candles = toIndicatorCandles(displayedCandles)

            manager.update(candles)
        }

        const syncIndicators = () => {
            const indicators = indicatorStore.getAll(chartId)

            manager.sync(indicators)

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
    }, [chartId, chartReady, chartRef, displayedCandlesRef, timeframe])

    return managerRef
}
