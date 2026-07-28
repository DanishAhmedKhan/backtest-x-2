export class CursorManager {
    constructor(private readonly container: HTMLElement) {}

    private current = ''

    public set(cursor: string) {
        if (this.current === cursor) {
            return
        }

        this.current = cursor
        this.container.style.cursor = cursor
    }

    public reset() {
        this.set('default')
    }
}
