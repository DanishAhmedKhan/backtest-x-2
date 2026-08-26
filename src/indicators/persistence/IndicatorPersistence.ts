import type { IndicatorConfig } from '../core/Indicator'
import { indicatorStore } from '../core/IndicatorStore'

import { LocalStorageProvider } from '../../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../../storage/storageKeys'

export class IndicatorPersistence {
    private unsubscribe: (() => void) | null = null

    private readonly storage = new LocalStorageProvider()

    private lastSerialized: IndicatorConfig[] | null = null

    constructor(private readonly chartId: string) {}

    public start() {
        this.load()

        this.lastSerialized = this.getSerializedIndicators()

        this.unsubscribe = indicatorStore.subscribe(() => {
            this.saveIfChanged()
        })
    }

    public stop() {
        this.unsubscribe?.()
        this.unsubscribe = null
    }

    private getStorageKey() {
        return `${STORAGE_KEYS.INDICATOR_ITEMS}:${this.chartId}`
    }

    private getSerializedIndicators(): IndicatorConfig[] {
        return indicatorStore.getAll(this.chartId).map((indicator) => indicator.getConfig())
    }

    private saveIfChanged() {
        const indicators = this.getSerializedIndicators()

        const serialized = JSON.stringify(indicators)
        const previous = JSON.stringify(this.lastSerialized)

        if (serialized === previous) {
            return
        }

        this.storage.set(this.getStorageKey(), indicators)

        this.lastSerialized = indicators
    }

    private load() {
        const indicators = this.storage.get<IndicatorConfig[]>(this.getStorageKey())

        if (!indicators) {
            return
        }

        for (const config of indicators) {
            indicatorStore.add(config)
        }
    }
}
