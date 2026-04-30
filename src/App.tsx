import { useEffect, useState } from 'react'
import Chart from './components/Chart'
import TopBar from './components/TopBar'
import { ConfigService } from './config/ConfigService'
import type { Ticker } from './core/Ticker'
import type { Timeframe } from './core/Timeframe'

function App() {
    const [ticker, setTicker] = useState<Ticker>(ConfigService.getConfig().ticker)
    const [timeframe, setTimeframe] = useState<Timeframe>(ConfigService.getConfig().timeframe)

    useEffect(() => {
        ConfigService.updateConfig({ ticker, timeframe })
    }, [ticker, timeframe])

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gridTemplateRows: '50px 1fr',
            }}
        >
            <TopBar ticker={ticker} timeframe={timeframe} onTickerChange={setTicker} onTimeframeChange={setTimeframe} />

            <Chart ticker={ticker} timeframe={timeframe} />
        </div>
    )
}

export default App
