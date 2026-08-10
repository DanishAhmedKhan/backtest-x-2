import { useEffect, useState } from 'react'

import { Toolbar } from './ui/Toolbar'
import { FloatingToolbar } from './ui/FloatingToolbar'
import { ToolbarButton } from './ui/ToolbarButton'
import { ToolbarSeparator } from './ui/ToolbarSeparator'
import { ToolbarDropdown } from './ui/ToolbarDropdown'
import { ToolbarGroup } from './ui/ToolbarGroup'

import type { ToolbarDropdownOption } from './ui/types'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import { replayController } from '../replay/ReplayController'
import svg from '../svg/svg'

import { DEFAULT_REPLAY_SPEED, REPLAY_SPEEDS, REPLAY_UPDATE_INTERVALS } from '../config/default/ReplayConfig'

export default function ReplayToolbar() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(DEFAULT_REPLAY_SPEED)
    const [updateInterval, setUpdateInterval] = useState(replayStore.updateIntervalSeconds)

    const handleTogglePlay = () => {
        setIsPlaying((prev) => {
            const next = !prev

            replayStore.setPlaying(next)

            return next
        })
    }

    const handleForward = () => {
        replayController.forward()
    }

    const handleUpdateInterval = (option: ToolbarDropdownOption) => {
        const seconds = Number(option.id)

        replayStore.setUpdateIntervalSeconds(seconds)

        eventBus.emit('replayUpdateIntervalChanged', {
            seconds,
        })

        eventBus.emit('replayTimeChanged', {
            time: replayStore.marketTime!,
        })
    }

    const handleSpeedChange = (option: ToolbarDropdownOption) => {
        setSpeed(Number(option.id))
    }

    const handleExit = () => {
        setIsPlaying(false)
        replayStore.stop()

        eventBus.emit('replayStop')
    }

    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            replayController.forward()
        }, 1000 / speed)

        return () => clearInterval(interval)
    }, [isPlaying, speed])

    useEffect(() => {
        const unsubscribe = eventBus.on('replayUpdateIntervalChanged', ({ seconds }) => {
            setUpdateInterval(seconds)
        })

        return unsubscribe
    }, [])

    const updateIntervalOptions: ToolbarDropdownOption[] = REPLAY_UPDATE_INTERVALS.map((tf) => ({
        id: String(tf.toSeconds()),
        label: tf.label,
    }))

    const speedOptions: ToolbarDropdownOption[] = REPLAY_SPEEDS.map((value) => ({
        id: String(value),
        label: `${value}x`,
    }))

    return (
        <FloatingToolbar storageKey="replay-toolbar">
            <Toolbar direction="horizontal">
                <ToolbarGroup>
                    <ToolbarButton
                        icon={
                            <div
                                style={{ width: 28, height: 28 }}
                                dangerouslySetInnerHTML={{
                                    __html: svg.replay.selectBar,
                                }}
                            />
                        }
                    />
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarGroup>
                    <ToolbarButton
                        icon={
                            <div
                                style={{ width: 28, height: 28 }}
                                dangerouslySetInnerHTML={{
                                    __html: isPlaying ? svg.replay.pause : svg.replay.play,
                                }}
                            />
                        }
                        onClick={handleTogglePlay}
                    />

                    <ToolbarButton
                        icon={
                            <div
                                style={{ width: 28, height: 28 }}
                                dangerouslySetInnerHTML={{
                                    __html: svg.replay.forward,
                                }}
                            />
                        }
                        onClick={handleForward}
                    />
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarGroup>
                    <ToolbarDropdown
                        selectedId={String(updateInterval)}
                        options={updateIntervalOptions}
                        onChange={handleUpdateInterval}
                    />

                    <ToolbarDropdown selectedId={String(speed)} options={speedOptions} onChange={handleSpeedChange} />
                </ToolbarGroup>

                <ToolbarSeparator />

                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{
                                __html: svg.replay.exit,
                            }}
                        />
                    }
                    onClick={handleExit}
                />
            </Toolbar>
        </FloatingToolbar>
    )
}
