import type { Ticker } from '../core/Ticker'

type Props = {
    ticker: Ticker
}

function ChartNoData({ ticker }: Props) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                fontSize: 14,
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 400,
                    marginBottom: 20,
                }}
            >
                {ticker.toString()}
            </div>

            <div
                style={{
                    fontSize: 15,
                }}
            >
                This symbol data does not exist
            </div>
        </div>
    )
}

export default ChartNoData
