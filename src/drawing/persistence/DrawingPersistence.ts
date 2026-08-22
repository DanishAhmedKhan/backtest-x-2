import type { PersistedDrawing } from './PersistedDrawing'
import type { DrawingManager } from '../managers/DrawingManager'

import { serializeDrawing } from './serializeDrawing'
import { deserializeDrawing } from './deserializeDrawing'
import { LocalStorageProvider } from '../../storage/LocalStorageProvider'
import { STORAGE_KEYS } from '../../storage/storageKeys'

export class DrawingPersistence {
    private unsubscribe: (() => void) | null = null

    private storage = new LocalStorageProvider()

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
        return `${STORAGE_KEYS.DRAWING_ITEMS}:${this.ticker}`
    }

    private save() {
        const drawings = this.drawingManager.getDrawings().map((drawing) => serializeDrawing(drawing))

        this.storage.set(this.getStorageKey(), drawings)
    }

    private load() {
        const allDrawings = this.storage.get<PersistedDrawing[]>(this.getStorageKey())

        if (!allDrawings) return

        for (const data of allDrawings) {
            const drawing = deserializeDrawing(data)

            if (drawing) {
                this.drawingManager.addDrawing(drawing)
            }
        }
    }
}
