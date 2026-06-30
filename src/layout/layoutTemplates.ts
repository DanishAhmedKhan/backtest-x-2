import type { ChartNode, LayoutNode, LayoutType, SplitNode } from '../types/Layout'

type NodeFactory = {
    chart(index: number): ChartNode
    split(direction: 'horizontal' | 'vertical', split: number, first: LayoutNode, second: LayoutNode): SplitNode
}

type LayoutBuilder = (f: NodeFactory) => LayoutNode

const BUILDERS: Record<LayoutType, LayoutBuilder> = {
    '1x1': ({ chart }) => chart(0),

    '2x1': ({ chart, split }) => split('vertical', 0.5, chart(0), chart(1)),

    '3x1': ({ chart, split }) => split('vertical', 1 / 3, chart(0), split('vertical', 0.5, chart(1), chart(2))),

    '2x2': ({ chart, split }) =>
        split(
            'horizontal',
            0.5,
            split('vertical', 0.5, chart(0), chart(1)),
            split('vertical', 0.5, chart(2), chart(3)),
        ),
}

export const createLayout = (type: LayoutType): LayoutNode => {
    let nextId = 0

    const factory: NodeFactory = {
        chart(index) {
            return {
                id: `node-${nextId++}`,
                type: 'chart',
                chartIndex: index,
            }
        },

        split(direction, split, first, second) {
            return {
                id: `node-${nextId++}`,
                type: 'split',
                direction,
                split,
                first,
                second,
            }
        },
    }

    return BUILDERS[type](factory)
}
