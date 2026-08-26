import { Indicator, type IndicatorConfig } from './Indicator'

type Listener = () => void

class IndicatorStore {
    private indicators: Indicator[] = []
    private listeners = new Set<Listener>()

    private snapshots = new Map<string, Indicator[]>()
    private allSnapshot: Indicator[] = []

    public subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public getSnapshot(chartId: string): Indicator[] {
        return this.getAll(chartId)
    }

    public getAll(chartId?: string): Indicator[] {
        if (!chartId) {
            return this.allSnapshot
        }

        let snapshot = this.snapshots.get(chartId)

        if (!snapshot) {
            snapshot = this.indicators.filter((indicator) => indicator.chartId === chartId)

            this.snapshots.set(chartId, snapshot)
        }

        return snapshot
    }

    public get(id: string): Indicator | undefined {
        return this.indicators.find((indicator) => indicator.id === id)
    }

    public add(config: IndicatorConfig) {
        if (this.indicators.some((indicator) => indicator.id === config.id)) {
            return
        }

        const indicator = new Indicator(config)

        this.indicators = [...this.indicators, indicator]

        this.rebuildSnapshots()
        this.notify()
    }

    public remove(id: string) {
        const exists = this.indicators.some((indicator) => indicator.id === id)

        if (!exists) return

        this.indicators = this.indicators.filter((indicator) => indicator.id !== id)

        this.rebuildSnapshots()
        this.notify()
    }

    public update(id: string, changes: Partial<Omit<IndicatorConfig, 'id' | 'type'>>) {
        const indicator = this.get(id)

        if (!indicator) return

        indicator.update(changes)

        this.indicators = [...this.indicators]

        this.rebuildSnapshots()
        this.notify()
    }

    public updateSetting(id: string, key: string, value: unknown) {
        const indicator = this.get(id)

        if (!indicator) return

        if (key === 'visible') {
            indicator.setVisible(Boolean(value))
        } else {
            indicator.setSetting(key, value)
        }

        this.indicators = [...this.indicators]

        this.rebuildSnapshots()
        this.notify()
    }

    public setVisible(id: string, visible: boolean) {
        const indicator = this.get(id)

        if (!indicator) return

        indicator.setVisible(visible)

        this.indicators = [...this.indicators]

        this.rebuildSnapshots()
        this.notify()
    }

    public toggleVisibility(id: string) {
        const indicator = this.get(id)

        if (!indicator) return

        indicator.setVisible(!indicator.isVisible())

        this.indicators = [...this.indicators]

        this.rebuildSnapshots()
        this.notify()
    }

    public clear() {
        if (!this.indicators.length) return

        this.indicators = []

        this.rebuildSnapshots()
        this.notify()
    }

    private rebuildSnapshots() {
        this.allSnapshot = this.indicators

        const chartIds = new Set(this.indicators.map((indicator) => indicator.chartId))

        this.snapshots.clear()

        for (const chartId of chartIds) {
            this.snapshots.set(
                chartId,
                this.indicators.filter((indicator) => indicator.chartId === chartId),
            )
        }
    }

    private notify() {
        this.listeners.forEach((listener) => listener())
    }
}

export const indicatorStore = new IndicatorStore()
