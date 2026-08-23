import type { Ticker } from './Ticker'

export type PriceFormat = {
    type: 'price'
    precision: number
    minMove: number
}

const DEFAULT_PRECISION = 5

const TICKER_PRECISIONS: Record<string, number> = {
    EURUSD: 5,
    GBPUSD: 5,
    USDJPY: 3,
    US100: 1,
}

export class TickerPriceFormat {
    public static getFormat(ticker: Ticker): PriceFormat {
        const precision = TICKER_PRECISIONS[ticker.value] ?? DEFAULT_PRECISION

        return {
            type: 'price',
            precision: precision,
            minMove: this.getMinMove(precision),
        }
    }

    private static getMinMove(precision: number): number {
        return 10 ** -precision
    }
}
