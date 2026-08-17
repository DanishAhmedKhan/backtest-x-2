import type { ToolType } from '../drawing/tools/ToolType'

type EventMap = {
    crosshairMove: {
        time: number | null
        sourceId: string
    }

    replayPreviewMove: {
        time: number
    }

    replayStart: void

    replayStop: void

    replayNextCandle: void

    replayPositionChanged: void

    replayTimeChanged: {
        time: number
    }

    replayUpdateIntervalChanged: {
        seconds: number
    }

    jumpTo: {
        timestamp: number
    }

    chartDragEnded: void

    toolChanged: {
        tool: ToolType
        clearSelection?: boolean
    }

    drawingCompleted: void
}

type EventKey = keyof EventMap

class EventBus {
    private listeners = new Map<EventKey, Set<(payload: unknown) => void>>()

    public on<K extends EventKey>(event: K, callback: (payload: EventMap[K]) => void) {
        let eventListeners = this.listeners.get(event)

        if (!eventListeners) {
            eventListeners = new Set()
            this.listeners.set(event, eventListeners)
        }

        eventListeners.add(callback as (payload: unknown) => void)

        return () => {
            eventListeners.delete(callback as (payload: unknown) => void)
        }
    }

    public emit<K extends EventKey>(event: K, ...args: EventMap[K] extends void ? [] : [EventMap[K]]) {
        const payload = args[0]

        this.listeners.get(event)?.forEach((cb) => {
            cb(payload)
        })
    }
}

export const eventBus = new EventBus()
