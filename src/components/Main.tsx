import { useEffect, useState } from 'react'
import TopBar from './TopBar'
import ChartWindow from './ChartWindow'
import ToolBar from './ToolBar'
import ReplayToolbar from './ReplayToolbar'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'
import { replayStore } from '../replay/ReplayStore'
import { LocalStorageProvider } from '../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../storage/key'
import type { AppConfig, ChartConfig } from '../types/AppConfig'
import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

const storage = new LocalStorageProvider()

const loadConfig = () => {
    const config = storage.get<AppConfig>(STORAGE_KEYS.APP_CONFIG)

    if (!config) {
        return {
            layout: '2x1' as LayoutType,
            charts: [
                { ticker: 'EURUSD', timeframe: '1m' },
                { ticker: 'EURUSD', timeframe: '5m' },
            ],
        }
    }

    return config
}

const createCharts = (charts: ChartConfig[]): ChartState[] => {
    return charts.map((chart, i) => ({
        id: `chart-${i}`,
        ticker: Ticker.parse(chart.ticker),
        timeframe: Timeframe.parse(chart.timeframe),
    }))
}

const createNewCharts = (count: number, startIndex: number = 0): ChartState[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `chart-${startIndex + i}`,
        ticker: TickerRegistry.getDefault(),
        timeframe: TimeframeRegistry.getDefault(),
    }))
}

export default function Main() {
    const config = loadConfig()

    const [layout, setLayout] = useState<LayoutType>(config.layout)
    const [charts, setCharts] = useState<ChartState[]>(createCharts(config.charts))
    const [activeChartId, setActiveChartId] = useState('chart-1')
    const [showReplayToolbar, setShowReplayToolbar] = useState(false)

    const activeChart = charts.find((c) => c.id === activeChartId) ?? charts[0]

    const updateActiveChart = (partial: Partial<ChartState>) => {
        setCharts((prev) => prev.map((c) => (c.id === activeChartId ? { ...c, ...partial } : c)))
    }

    const handleLayoutChange = (newLayout: LayoutType) => {
        const oldLayout = layout
        setLayout(newLayout)

        const countMap = {
            '1x1': 1,
            '2x1': 2,
            '2x2': 4,
        }

        const oldChartCount = countMap[oldLayout]
        const newChartCount = countMap[newLayout]

        let newCharts = []

        if (newChartCount > oldChartCount) {
            newCharts = [...charts, ...createNewCharts(newChartCount - charts.length, charts.length)]
        } else if (newChartCount < oldChartCount) {
            newCharts = charts.slice(0, newChartCount)
        }

        setCharts(newCharts)
        setActiveChartId(newCharts[0].id)
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

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: '50px 1fr',
                gridTemplateColumns: '60px 1fr',
                gap: '10px',
                height: '100vh',
                overflow: 'hidden',
                backgroundColor: '#aaa',
            }}
        >
            <div style={{ gridColumn: '1 / span 2' }}>
                <TopBar
                    ticker={activeChart.ticker}
                    timeframe={activeChart.timeframe}
                    layout={layout}
                    onTickerChange={(t) => updateActiveChart({ ticker: t })}
                    onTimeframeChange={(tf) => updateActiveChart({ timeframe: tf })}
                    onLayoutChange={handleLayoutChange}
                    onReplayClick={() => {
                        replayStore.isSelecting = true
                        replayStore.openToolbar()
                        setShowReplayToolbar(true)
                    }}
                />
            </div>

            <ToolBar />

            <ChartWindow
                charts={charts}
                activeChartId={activeChartId}
                onSelectChart={setActiveChartId}
                layout={layout}
            />

            {showReplayToolbar && <ReplayToolbar />}
        </div>
    )
}
