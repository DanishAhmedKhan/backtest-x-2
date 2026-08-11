import type { Drawing } from '../drawings/Drawing'

type Listener = () => void

export class PreviewDrawingManager {
    private drawing: Drawing | null = null

    private readonly listeners = new Set<Listener>()

    private notify() {
        for (const listener of this.listeners) {
            listener()
        }
    }

    public subscribeChanged(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public set(drawing: Drawing | null) {
        this.drawing = drawing

        this.notify()
    }

    public clear() {
        this.drawing = null

        this.notify()
    }

    public get() {
        return this.drawing
    }
}
