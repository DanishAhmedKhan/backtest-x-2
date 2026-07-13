export type LayoutType = '1x1' | '2x1' | '1x2' | '2x2' | '3x1'

export const LAYOUTS = {
    '1x1': 1,
    '2x1': 2,
    '1x2': 2,
    '3x1': 3,
    '2x2': 4,
} as const satisfies Record<LayoutType, number>

export const LAYOUT_TYPES = Object.keys(LAYOUTS) as LayoutType[]

export type LayoutNode = ChartNode | SplitNode

export interface ChartNode {
    id: string
    type: 'chart'
    chartIndex: number
}

export interface SplitNode {
    id: string
    type: 'split'
    direction: 'horizontal' | 'vertical'
    split: number
    first: LayoutNode
    second: LayoutNode
}
