import type { CursorApplier } from './CursorApplier'
import { CursorSource } from './CursorSource'

export class CursorController {
    private readonly requests = new Map<CursorSource, string>()

    constructor(private readonly cursorApplier: CursorApplier) {}

    private update() {
        if (this.requests.size === 0) {
            this.cursorApplier.reset()
            return
        }

        const last = Array.from(this.requests.values()).at(-1)

        if (last) {
            this.cursorApplier.set(last)
        }
    }

    public request(source: CursorSource, cursor: string) {
        this.requests.set(source, cursor)

        this.update()
    }

    public clear(source: CursorSource) {
        this.requests.delete(source)

        this.update()
    }
}
