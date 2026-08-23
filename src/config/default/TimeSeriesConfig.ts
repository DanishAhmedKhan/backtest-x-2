import type { CandlestickStyleOptions, DeepPartial, SeriesOptionsCommon } from 'lightweight-charts'

export const TIME_SERIES_CONFIG: DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon> = {
    upColor: '#26a69a',
    downColor: '#ef5350',
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    borderVisible: false,
}
