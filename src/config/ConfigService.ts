import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import { LocalStorageProvider } from '../storage/LocalStorageProvider'
import type { Config } from './Config'

const storage = new LocalStorageProvider()

const DEFAULT_CONFIG: Config = {
    ticker: TickerRegistry.getDefault(),
    timeframe: TimeframeRegistry.getDefault(),
}

const CONFIG_KEY = 'config_key'

export class ConfigService {
    public static getConfig(): Config {
        const saved = storage.get<Config>(CONFIG_KEY)

        return {
            ...DEFAULT_CONFIG,
            ...saved,
        }
    }

    public static updateConfig(partial: Partial<Config>) {
        const current = this.getConfig()

        const updated = {
            ...current,
            ...partial,
        }

        storage.set(CONFIG_KEY, updated)
    }

    public static reset() {
        storage.remove(CONFIG_KEY)
    }
}
