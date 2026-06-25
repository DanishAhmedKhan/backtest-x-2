import { useEffect, useState } from 'react'
import TopBar from './TopBar'
import ChartWindow from './ChartWindow'
import ToolBar from './ToolBar'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'
import ReplayToolbar from './ReplayToolbar'
import { replayStore } from '../replay/ReplayStore'
import { LocalStorageProvider } from '../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../storage/key'
import type { AppConfig } from '../types/AppConfig'
import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'

const storage = new LocalStorageProvider()

const loadConfig = () => {
    const config = storage.get<AppConfig>(STORAGE_KEYS.APP_CONFIG)

    if (!config) {
        return {
            layout: '2x1' as LayoutType,
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
    }

    return config
}

const createCharts = (charts): ChartState[] => {
    return charts.map((chart, i) => ({
        id: `chart-${i}`,
        ticker: Ticker.parse(chart.ticker),
        timeframe: Timeframe.parse(chart.timeframe),
    }))
}

export default function Main() {
    const config = loadConfig()

    const [layout, setLayout] = useState<LayoutType>(config.layout)
    const [charts, setCharts] = useState<ChartState[]>(createCharts(config.charts))
    const [activeChartId, setActiveChartId] = useState('chart-1')
    const [showReplayToolbar, setShowReplayToolbar] = useState(false)

    const activeChart = charts.find((c) => c.id === activeChartId)!

    const updateActiveChart = (partial: Partial<ChartState>) => {
        setCharts((prev) => prev.map((c) => (c.id === activeChartId ? { ...c, ...partial } : c)))
    }

    const handleLayoutChange = (newLayout: LayoutType) => {
        setLayout(newLayout)

        const countMap = {
            '1x1': 1,
            '2x1': 2,
            '2x2': 4,
        }

        const newCount = countMap[newLayout]

        setCharts(createCharts(newCount))
        setActiveChartId('chart-1')
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
