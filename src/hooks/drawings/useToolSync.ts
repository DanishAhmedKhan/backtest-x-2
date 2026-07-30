import { useEffect } from 'react'

import { eventBus } from '../../event/EventBus'
import type { ChartRuntime } from '../../drawing/runtime/ChartRuntime'

type Params = {
    runtimeRef: React.RefObject<ChartRuntime | null>
}

export function useToolSync({ runtimeRef }: Params) {
    useEffect(() => {
        return eventBus.on('toolChanged', ({ tool }) => {
            runtimeRef?.current.toolController.setTool(tool)
        })
    }, [runtimeRef])
}
