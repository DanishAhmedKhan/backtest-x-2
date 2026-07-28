type Listener = () => void

export class PopupController {
    private openPopupId: string | null = null

    private readonly listeners = new Set<Listener>()

    public subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    private notify() {
        for (const listener of this.listeners) {
            listener()
        }
    }

    public isOpen(id: string) {
        return this.openPopupId === id
    }

    public open(id: string) {
        if (this.openPopupId === id) {
            return
        }

        this.openPopupId = id
        this.notify()
    }

    public close() {
        if (this.openPopupId === null) {
            return
        }

        this.openPopupId = null
        this.notify()
    }

    public toggle(id: string) {
        if (this.openPopupId === id) {
            this.close()
            return
        }

        this.open(id)
    }
}
