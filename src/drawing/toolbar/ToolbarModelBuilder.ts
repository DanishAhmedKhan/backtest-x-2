import type { DrawingAction } from '../actions/DrawingAction'
import type { ToolbarItem } from './ToolbarItem'

export class ToolbarModelBuilder {
    public build(actions: DrawingAction[]): ToolbarItem[] {
        return actions.map((action) => {
            switch (action.id) {
                case 'delete':
                    return {
                        id: action.id,
                        type: 'button',
                        label: action.label,
                        action: action.execute,
                    }

                case 'settings':
                    return {
                        id: action.id,
                        type: 'button',
                        label: action.label,
                        action: action.execute,
                    }

                case 'color':
                    return {
                        id: action.id,
                        type: 'color',
                        label: action.label,
                        value: action.value,
                        action: () => {},
                        onChange: (value) => action.execute(value as string),
                    }

                case 'line-width':
                    return {
                        id: action.id,
                        type: 'line-width',
                        label: action.label,
                        value: action.value,
                        action: () => {},
                        onChange: (value) => action.execute(value as number),
                    }
            }
        })
    }
}
