import { useState } from 'react'

import { ToolbarIcon } from './ui/ToolbarIcon'
import CalendarPicker from './CalendarPicker'

import svg from '../svg/svg'

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

export default function JumpToDialog({ open, initialDate = new Date(), onClose, onGo }: Props) {
    const [date, setDate] = useState(() => toDateInputValue(initialDate))
    const [time, setTime] = useState(() => toTimeInputValue(initialDate))
    const [activeTab, setActiveTab] = useState<'date' | 'range'>('date')

    if (!open) return null

    const selectedDate = fromDateTime(date, time)

    const handleCalendarChange = (nextDate: Date) => {
        setDate(toDateInputValue(nextDate))
    }

    const handleGo = () => {
        if (isNaN(selectedDate.getTime())) return

        onGo(selectedDate.getTime() / 1000)
        onClose()
    }

    return (
        <>
            <div className="go-to-backdrop" onMouseDown={onClose} />

            <div className="go-to-dialog">
                <div className="go-to-header">
                    <div className="go-to-title">Go to</div>

                    <button type="button" className="go-to-close" onClick={onClose} aria-label="Close">
                        {/* <div style={{ width: 18, height: 18 }} dangerouslySetInnerHTML={{ __html: svg.close }} /> */}
                        <ToolbarIcon width={18} height={18} svg={svg.close}></ToolbarIcon>
                    </button>
                </div>

                <div className="go-to-tabs">
                    <button
                        type="button"
                        className={`go-to-tab ${activeTab === 'date' ? 'active' : ''}`}
                        onClick={() => setActiveTab('date')}
                    >
                        Date
                    </button>

                    <button
                        type="button"
                        className={`go-to-tab ${activeTab === 'range' ? 'active' : ''}`}
                        onClick={() => setActiveTab('range')}
                    >
                        Custom range
                    </button>
                </div>

                {activeTab === 'date' && (
                    <>
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
                    </>
                )}

                {activeTab === 'range' && <div className="go-to-range-placeholder">Custom range</div>}

                <div className="go-to-footer">
                    <button type="button" className="go-to-cancel" onClick={onClose}>
                        Cancel
                    </button>

                    <button type="button" className="go-to-submit" onClick={handleGo}>
                        Go to
                    </button>
                </div>
            </div>
        </>
    )
}
