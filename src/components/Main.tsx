import { useEffect, useState } from 'react'

import TopToolbar from './TopToolbar'
import ChartWindow from './ChartWindow'
import JumpTo from './JumpTo'
import IndicatorSelector from './IndicatorSelector'
import DrawingToolbar from './DrawingToolbar'
import ReplayToolbar from './ReplayToolbar'
import DrawingPropertiesToolbar from './DrawingPropertiesToolbar'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

import type { Indicator } from '../indicators/core/Indicator'
import IndicatorSettings from './IndicatorSettings'
import { indicatorRegistry } from '../indicators/core/IndicatorRegistry'

import type { ChartState } from '../types/ChartState'
import { LAYOUTS, type LayoutType } from '../types/Layout'
import { LocalStorageProvider } from '../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../storage/storageKeys'
import type { AppConfig, ChartConfig } from '../types/AppConfig'
import { eventBus } from '../event/EventBus'
import { useReplayController } from '../hooks/charts/useReplayController'
import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'

import { replayStore } from '../replay/ReplayStore'
import { indicatorStore } from '../indicators/core/IndicatorStore'

import '../../styles/index.css'

const storage = new LocalStorageProvider()

const DEFAULT_CONFIG: AppConfig = {
    layout: '2x1',
    charts: [
        {
            ticker: 'EURUSD',
            timeframe: '1m',
        },
        {
            ticker: 'EURUSD',
            timeframe: '5m',
        },
    ],
}

const loadConfig = () => storage.get<AppConfig>(STORAGE_KEYS.APP_CONFIG) ?? DEFAULT_CONFIG

const createCharts = (charts: ChartConfig[]): ChartState[] => {
    return charts.map((chart, i) => ({
        id: `chart-${i}`,
        ticker: Ticker.parse(chart.ticker),
        timeframe: Timeframe.parse(chart.timeframe),
    }))
}

const createNewCharts = (count: number, nextChartIndex: number = 0): ChartState[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `chart-${nextChartIndex + i}`,
        ticker: TickerRegistry.getDefault(),
        timeframe: TimeframeRegistry.getDefault(),
    }))
}

const getChartCount = (layout: LayoutType) => LAYOUTS[layout]

export default function Main() {
    const config = loadConfig()
    const initialCharts = createCharts(config.charts)

    const [layout, setLayout] = useState<LayoutType>(config.layout)
    const [charts, setCharts] = useState<ChartState[]>(initialCharts)
    const [activeChartId, setActiveChartId] = useState(initialCharts[0]?.id ?? '')
    const [showReplayToolbar, setShowReplayToolbar] = useState(false)

    const [jumpOpen, setJumpOpen] = useState(false)
    const [indicatorListOpen, setIndicatorListOpen] = useState(false)
    const [indicatorSettingsOpen, setIndicatorSettingsOpen] = useState(false)

    const [selectedIndicatorId, setSelectedIndicatorId] = useState<string | null>(null)

    const [drawingToolbarManager, setDrawingToolbarManager] = useState<DrawingToolbarManager | null>(null)

    const activeChart = charts.find((c) => c.id === activeChartId) ?? charts[0]

    const updateActiveChart = (partial: Partial<ChartState>) => {
        setCharts((prev) => prev.map((c) => (c.id === activeChartId ? { ...c, ...partial } : c)))
    }

    const handleLayoutChange = (newLayout: LayoutType) => {
        setLayout(newLayout)

        const newChartCount = getChartCount(newLayout)

        let newCharts = charts

        if (charts.length < newChartCount) {
            newCharts = [...charts, ...createNewCharts(newChartCount - charts.length, charts.length)]
        } else if (charts.length > newChartCount) {
            newCharts = charts.slice(0, newChartCount)
        }

        setCharts(newCharts)

        if (!newCharts.some((c) => c.id === activeChartId)) {
            setActiveChartId(newCharts[0].id)
        }
    }

    const handleIndicatorSettings = (indicator: Indicator) => {
        setSelectedIndicatorId(indicator.id)
        setIndicatorSettingsOpen(true)
    }

    useEffect(() => {
        const config = {
            layout: layout,
            charts: charts.map((chart) => ({
                ticker: Ticker.stringify(chart.ticker),
                timeframe: Timeframe.stringfy(chart.timeframe),
            })),
        }

        storage.set(STORAGE_KEYS.APP_CONFIG, config)
    }, [layout, charts])

    useEffect(() => {
        const unsubscribe = eventBus.on('replayStart', () => {
            setShowReplayToolbar(true)
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        const unsub = eventBus.on('replayStop', () => {
            setShowReplayToolbar(false)
        })

        return unsub
    }, [])

    useReplayController()

    const selectedIndicator = selectedIndicatorId !== null ? indicatorStore.get(selectedIndicatorId) ?? null : null

    return (
        <div className="main">
            <div className="main-toptoolbar">
                <TopToolbar
                    ticker={activeChart.ticker}
                    timeframe={activeChart.timeframe}
                    layout={layout}
                    onTickerChange={(t) => updateActiveChart({ ticker: t })}
                    onTimeframeChange={(tf) => updateActiveChart({ timeframe: tf })}
                    onLayoutChange={handleLayoutChange}
                    onIndicatorClick={() => setIndicatorListOpen(true)}
                    onReplayClick={() => {
                        replayStore.isSelecting = true
                        setShowReplayToolbar(false)
                    }}
                    onJumpToClick={() => setJumpOpen(true)}
                />
            </div>
            <div className="main-drawingtoolbar">
                <DrawingToolbar />
            </div>

            <ChartWindow
                charts={charts}
                activeChartId={activeChartId}
                onSelectChart={setActiveChartId}
                layout={layout}
                onDrawingToolbarManagerReady={setDrawingToolbarManager}
                onIndicatorSettings={handleIndicatorSettings}
            />

            <JumpTo
                open={jumpOpen}
                onClose={() => setJumpOpen(false)}
                onGo={(timestamp) => {
                    eventBus.emit('jumpTo', {
                        timestamp,
                    })

                    setJumpOpen(false)
                }}
            />

            <IndicatorSelector
                open={indicatorListOpen}
                onClose={() => setIndicatorListOpen(false)}
                onIndicatorClick={(indicator) => {
                    const definition = indicatorRegistry.get(indicator.type)

                    if (definition) {
                        indicatorStore.add({
                            id: definition.type + '-' + crypto.randomUUID(),
                            chartId: activeChartId + '',
                            type: definition.type,
                            settings: indicatorRegistry.createDefaultSettings(definition.type),
                        })
                    }
                }}
            />

            <IndicatorSettings
                open={indicatorSettingsOpen}
                onClose={() => {
                    setIndicatorSettingsOpen(false)
                    setSelectedIndicatorId(null)
                }}
                indicator={selectedIndicator}
            />

            {showReplayToolbar && <ReplayToolbar />}
            <DrawingPropertiesToolbar manager={drawingToolbarManager} />
        </div>
    )
}
