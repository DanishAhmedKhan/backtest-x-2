import type { ChartNode, LayoutNode, SplitNode } from '../types/Layout'

export const HANDLE_SIZE = 6

export interface Rect {
    left: number
    top: number
    width: number
    height: number
}

export interface ChartLayout {
    node: ChartNode
    rect: Rect
}

export interface SplitLayout {
    node: SplitNode
    rect: Rect
}

export interface LayoutRects {
    charts: ChartLayout[]
    splits: SplitLayout[]
}

export type SplitState = Record<string, number>

export function computeLayoutRects(
    root: LayoutNode,
    width: number,
    height: number,
    splitState: SplitState = {},
): LayoutRects {
    const charts: ChartLayout[] = []
    const splits: SplitLayout[] = []

    function visit(node: LayoutNode, rect: Rect) {
        if (node.type === 'chart') {
            charts.push({
                node,
                rect,
            })

            return
        }

        splits.push({
            node,
            rect,
        })

        // Use overridden ratio if present
        const split = splitState[node.id] ?? node.split

        if (node.direction === 'vertical') {
            const availableWidth = rect.width - HANDLE_SIZE

            const firstWidth = Math.round(availableWidth * split)

            const secondWidth = availableWidth - firstWidth

            visit(node.first, {
                left: rect.left,
                top: rect.top,
                width: firstWidth,
                height: rect.height,
            })

            visit(node.second, {
                left: rect.left + firstWidth + HANDLE_SIZE,
                top: rect.top,
                width: secondWidth,
                height: rect.height,
            })

            return
        }

        const availableHeight = rect.height - HANDLE_SIZE

        const firstHeight = Math.round(availableHeight * split)

        const secondHeight = availableHeight - firstHeight

        visit(node.first, {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: firstHeight,
        })

        visit(node.second, {
            left: rect.left,
            top: rect.top + firstHeight + HANDLE_SIZE,
            width: rect.width,
            height: secondHeight,
        })
    }

    visit(root, {
        left: 0,
        top: 0,
        width,
        height,
    })

    return {
        charts,
        splits,
    }
}
