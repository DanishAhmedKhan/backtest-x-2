import { useState } from 'react'

import { ToolbarIcon } from './ui/ToolbarIcon'
import CalendarPicker from './CalendarPicker'

import svg from '../svg/svg'
import { Popup } from './common/Popup'
import { PopupTabs } from './common/PopupTabs'

type Props = {
    open: boolean
    initialDate?: Date
    onClose: () => void
    onGo: (date: number) => void
}

function toDateInputValue(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function toTimeInputValue(date: Date) {
    return date.toTimeString().slice(0, 5)
}

function fromDateTime(date: string, time: string) {
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)

    return new Date(year, month - 1, day, hours, minutes)
}

export default function JumpTo({ open, initialDate = new Date(), onClose, onGo }: Props) {
    const [date, setDate] = useState(() => toDateInputValue(initialDate))
    const [time, setTime] = useState(() => toTimeInputValue(initialDate))

    if (!open) return null

    const selectedDate = fromDateTime(date, time)

    const handleCalendarChange = (nextDate: Date) => {
        setDate(toDateInputValue(nextDate))
    }

    const handleGo = () => {
        if (isNaN(selectedDate.getTime())) return

        const setDebiggingDate = true
        if (setDebiggingDate) {
            const date = fromDateTime('2025-04-01', time)
            onGo(date.getTime() / 1000)
        } else {
            onGo(selectedDate.getTime() / 1000)
        }

        onClose()
    }

    return (
        <Popup
            open={open}
            onClose={onClose}
            title="Jump To"
            width={304}
            content={
                <>
                    <PopupTabs
                        tabs={[
                            {
                                id: 'date',
                                label: 'Date',
                                content: (
                                    <div>
                                        <div className="go-to-inputs">
                                            <div className="go-to-input-group">
                                                <input
                                                    type="text"
                                                    name="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    placeholder="YYYY-MM-DD"
                                                />

                                                <button type="button" className="go-to-input-icon">
                                                    <ToolbarIcon svg={svg.calendar} />
                                                </button>
                                            </div>

                                            <div className="go-to-input-group">
                                                <input
                                                    type="text"
                                                    name="time"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    placeholder="HH:MM"
                                                />

                                                <button type="button" className="go-to-input-icon">
                                                    <ToolbarIcon svg={svg.clock} />
                                                </button>
                                            </div>
                                        </div>

                                        <CalendarPicker value={selectedDate} onChange={handleCalendarChange} />
                                    </div>
                                ),
                            },
                            {
                                id: 'custom-range',
                                label: 'Custom range',
                                content: <div className="">Custom range</div>,
                            },
                        ]}
                    />
                    <div className="go-to-footer">
                        <button type="button" className="go-to-cancel" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="button" className="go-to-submit" onClick={handleGo}>
                            Go to
                        </button>
                    </div>
                </>
            }
        ></Popup>
    )
}
