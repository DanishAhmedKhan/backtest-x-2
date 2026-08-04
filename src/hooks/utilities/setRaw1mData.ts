import type { Raw1mData } from '../../components/Chart'
import type { Candle } from '../../core/Candle'

export function setRaw1mData(ref: React.RefObject<Raw1mData>, candles: Candle[]) {
    ref.current = {
        candles,
        times: candles.map((c) => c.time),
    }
}
