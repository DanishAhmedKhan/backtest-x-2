import Chart from './components/Chart'
import TopBar from './components/TopBar'
import { ConfigService } from './config/ConfigService'

function App() {
    const config = ConfigService.getConfig()

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
            <TopBar ticker={config.ticker} timeframe={config.timeframe} />

            <Chart ticker={config.ticker} timeframe={config.timeframe} />
        </div>
    )
}

export default App
