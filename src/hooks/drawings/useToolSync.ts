import { useEffect } from 'react'

import { eventBus } from '../../event/EventBus'
import { ToolController } from '../../drawing/ToolController'

type Params = {
    controllerRef: React.RefObject<ToolController | null>
}

export function useToolSync({ controllerRef }: Params) {
    useEffect(() => {
        return eventBus.on('toolChanged', ({ tool }) => {
            controllerRef.current?.setTool(tool)
        })
    }, [controllerRef])
}
