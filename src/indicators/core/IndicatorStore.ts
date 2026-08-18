import { Indicator, type IndicatorConfig } from './Indicator'

type Listener = () => void

class IndicatorStore {
    private indicators: Indicator[] = []
    private listeners = new Set<Listener>()

    public subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public getAll(): Indicator[] {
        return this.indicators
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

        this.notify()
    }

    public remove(id: string) {
        const exists = this.indicators.some((indicator) => indicator.id === id)

        if (!exists) {
            return
        }

        this.indicators = this.indicators.filter((indicator) => indicator.id !== id)

        this.notify()
    }

    public update(id: string, changes: Partial<Omit<IndicatorConfig, 'id' | 'type'>>) {
        const indicator = this.get(id)

        if (!indicator) {
            return
        }

        indicator.update(changes)

        this.indicators = [...this.indicators]

        this.notify()
    }

    public setVisible(id: string, visible: boolean) {
        const indicator = this.get(id)

        if (!indicator) {
            return
        }

        indicator.setVisible(visible)

        this.indicators = [...this.indicators]

        this.notify()
    }

    public toggleVisibility(id: string) {
        const indicator = this.get(id)

        if (!indicator) {
            return
        }

        indicator.setVisible(!indicator.isVisible())

        this.indicators = [...this.indicators]

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
