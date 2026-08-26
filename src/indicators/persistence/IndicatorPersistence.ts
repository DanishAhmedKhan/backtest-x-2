import type { IndicatorConfig } from '../core/Indicator'
import { indicatorStore } from '../core/IndicatorStore'

import { LocalStorageProvider } from '../../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../../storage/storageKeys'

export class IndicatorPersistence {
    private unsubscribe: (() => void) | null = null

    private readonly storage = new LocalStorageProvider()

    constructor(private readonly chartId: string) {}

    public start() {
        this.load()

        this.unsubscribe = indicatorStore.subscribe(() => {
            this.save()
        })
    }

    public stop() {
        this.unsubscribe?.()
        this.unsubscribe = null
    }

    private getStorageKey() {
        return `${STORAGE_KEYS.INDICATOR_ITEMS}:${this.chartId}`
    }

    private save() {
        const indicators = indicatorStore.getAll(this.chartId).map((indicator) => indicator.getConfig())

        this.storage.set(this.getStorageKey(), indicators)
    }

    private load() {
        const indicators = this.storage.get<IndicatorConfig[]>(this.getStorageKey())

        if (!indicators) return

        for (const config of indicators) {
            indicatorStore.add(config)
        }
    }
}
