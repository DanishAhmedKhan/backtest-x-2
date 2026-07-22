import type { Drawing } from './Drawing'

export class TrendLineDrawing implements Drawing {
    constructor(
        public readonly id: string,

        public startTime: number,

        public startPrice: number,

        public endTime: number,

        public endPrice: number,
    ) {}

    public destroy() {}
}
