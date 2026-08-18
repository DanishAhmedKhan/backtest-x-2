import type { IndicatorConfig } from './Indicator'

type Listener = () => void

class IndicatorStore {
    private indicators: IndicatorConfig[] = []
    private listeners = new Set<Listener>()

    public subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public getAll(): IndicatorConfig[] {
        return this.indicators
    }

    public add(config: IndicatorConfig) {
        if (this.indicators.some((indicator) => indicator.id === config.id)) {
            return
        }

        this.indicators.push(config)

        this.notify()
    }

    public remove(id: string) {
        const index = this.indicators.findIndex((indicator) => indicator.id === id)

        if (index === -1) {
            return
        }

        this.indicators.splice(index, 1)

        this.notify()
    }

    public update(id: string, changes: Partial<Omit<IndicatorConfig, 'id'>>) {
        const indicator = this.indicators.find((item) => item.id === id)

        if (!indicator) {
            return
        }

        Object.assign(indicator, changes)

        this.notify()
    }

    public clear() {
        if (!this.indicators.length) {
            return
        }

        this.indicators = []

        this.notify()
    }

    private notify() {
        this.listeners.forEach((listener) => listener())
    }
}

export const indicatorStore = new IndicatorStore()
