import type { PersistedDrawing } from './PersistedDrawing'
import type { DrawingManager } from '../managers/DrawingManager'

import { serializeDrawing } from './serializeDrawing'
import { deserializeDrawing } from './deserializeDrawing'

export class DrawingPersistence {
    private unsubscribe: (() => void) | null = null

    constructor(private readonly drawingManager: DrawingManager, private readonly ticker: string) {}

    public start() {
        this.load()

        this.unsubscribe = this.drawingManager.subscribeChanged(() => {
            this.save()
        })
    }

    public stop() {
        this.unsubscribe?.()
        this.unsubscribe = null
    }

    private getStorageKey() {
        return `backtest-x:drawings:${this.ticker}`
    }

    private save() {
        const drawings = this.drawingManager.getDrawings().map((drawing) => serializeDrawing(drawing))

        localStorage.setItem(this.getStorageKey(), JSON.stringify(drawings))
    }

    private load() {
        const raw = localStorage.getItem(this.getStorageKey())

        if (!raw) {
            return
        }

        try {
            const stored = JSON.parse(raw) as PersistedDrawing[]

            for (const data of stored) {
                const drawing = deserializeDrawing(data)

                if (drawing) {
                    this.drawingManager.addDrawing(drawing)
                }
            }
        } catch (error) {
            console.error('Failed to load drawings:', error)
        }
    }
}
