import type { Ticker } from '../core/Ticker'

type Props = {
    ticker: Ticker
}

function ChartNoData({ ticker }: Props) {
    return (
        <div className="chart-no-data ">
            <div className="chart-no-data-title">{ticker.toString()}</div>

            <div className="chart-no-data-description">This symbol data does not exist</div>
        </div>
    )
}

export default ChartNoData
