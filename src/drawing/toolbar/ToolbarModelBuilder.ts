import type { DrawingAction } from '../actions/DrawingAction'

import { ToolbarItemType, type ToolbarItem } from './ToolbarItem'

export class ToolbarModelBuilder {
    public build(actions: DrawingAction[]): ToolbarItem[] {
        return actions.map((action) => {
            switch (action.id) {
                case 'delete':
                    return {
                        id: action.id,
                        type: ToolbarItemType.Button,
                        tooltip: action.label,
                        execute: action.execute,
                    }

                case 'settings':
                    return {
                        id: action.id,
                        type: ToolbarItemType.Button,
                        tooltip: action.label,
                        execute: action.execute,
                    }

                case 'color':
                    return {
                        id: action.id,
                        type: ToolbarItemType.Color,
                        tooltip: action.label,
                        value: action.value,
                        execute: () => {},
                        onChange: (value) => action.execute(value as string),
                    }

                case 'line-width':
                    return {
                        id: action.id,
                        type: ToolbarItemType.Width,
                        tooltip: action.label,
                        value: action.value,
                        execute: () => {},
                        onChange: (value) => action.execute(value as number),
                    }

                case 'style':
                    return {
                        id: action.id,
                        type: ToolbarItemType.Style,
                        tooltip: action.label,
                        value: action.value,
                        execute: () => {},
                        onChange: (value) => action.execute(value as string),
                    }
            }
        })
    }
}
