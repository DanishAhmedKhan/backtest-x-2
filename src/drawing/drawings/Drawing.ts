import type { DrawingType } from '../DrawingType'

export interface Drawing {
    readonly id: string

    readonly type: DrawingType

    destroy(): void
}
