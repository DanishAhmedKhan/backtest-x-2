import { Candle } from '../core/Candle'

type CacheKey = string

class CandleCache {
    private cache = new Map<CacheKey, Candle[]>()

    public get(key: CacheKey) {
        return this.cache.get(key)
    }

    public set(key: CacheKey, data: Candle[]) {
        this.cache.set(key, data)
    }

    public has(key: CacheKey) {
        return this.cache.has(key)
    }
}

export const candleCache = new CandleCache()
