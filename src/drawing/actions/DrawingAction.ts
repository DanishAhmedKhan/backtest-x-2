export type DrawingActionMap = {
    delete: {
        label: string
        execute: () => void
    }

    color: {
        label: string
        value: string
        execute: (value: string) => void
    }

    'line-width': {
        label: string
        value: number
        execute: (value: number) => void
    }

    style: {
        label: string
        value: string
        execute: (value: string) => void
    }

    background: {
        label: string
        value: string
        execute: (value: string) => void
    }

    settings: {
        label: string
        execute: () => void
    }
}

export type DrawingAction = {
    [K in keyof DrawingActionMap]: {
        id: K
    } & DrawingActionMap[K]
}[keyof DrawingActionMap]
