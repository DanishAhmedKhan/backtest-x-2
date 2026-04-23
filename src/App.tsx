import Chart from './components/Chart'
import TopBar from './components/TopBar'
import { TickerRegistry } from './core/TickerRegstry'
import { TimeframeRegistry } from './core/TimeframeRegistry'

function App() {
    const symbol = {
        ticker: TickerRegistry.getDefault(),
        timeframe: TimeframeRegistry.getDefault(),
    }

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
            <TopBar symbol={symbol} />

            <Chart />
        </div>
    )
}

export default App
