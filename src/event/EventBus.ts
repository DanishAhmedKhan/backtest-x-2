type EventMap = {
    crosshairMove: {
        time: number | null
        sourceId: string
    }

    replayPreviewMove: {
        time: number
    }

    replayStart: {
        time: number
    }

    replayStop: {
        time: number
    }
}

type EventKey = keyof EventMap

class EventBus {
    private listeners: {
        [K in EventKey]?: Set<(payload: EventMap[K]) => void>
    } = {}

    public on<K extends EventKey>(event: K, callback: (payload: EventMap[K]) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set()
        }

        this.listeners[event]!.add(callback)

        return () => {
            this.listeners[event]!.delete(callback)
        }
    }

    public emit<K extends EventKey>(event: K, payload: EventMap[K]) {
        this.listeners[event]?.forEach((cb) => cb(payload))
    }
}

export const eventBus = new EventBus()
