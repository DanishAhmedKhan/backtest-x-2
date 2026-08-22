import { useMemo, useState } from 'react'
import { ToolbarIcon } from './ui/ToolbarIcon'
import svg from '../svg/svg'

type Props = {
    value: Date
    onChange: (date: Date) => void
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getDaysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function getMondayOffset(date: Date) {
    const day = date.getDay()
    return day === 0 ? 6 : day - 1
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isSameMonth(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function formatMonth(date: Date) {
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })
}

export default function CalendarPicker({ value, onChange }: Props) {
    const [month, setMonth] = useState(() => startOfMonth(value))

    const days = useMemo(() => {
        const daysInMonth = getDaysInMonth(month)
        const offset = getMondayOffset(month)

        const result: Array<Date | null> = []

        for (let i = 0; i < offset; i++) {
            result.push(null)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            result.push(new Date(month.getFullYear(), month.getMonth(), day))
        }

        while (result.length < 42) {
            result.push(null)
        }

        return result
    }, [month])

    const previousMonth = () => {
        setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
    }

    const handleSelect = (date: Date) => {
        onChange(date)
    }

    const today = new Date()

    return (
        <div className="calendar-picker">
            <div className="calendar-header">
                <button type="button" className="calendar-nav" onClick={previousMonth} aria-label="Previous month">
                    <ToolbarIcon svg={svg.left}></ToolbarIcon>
                </button>

                <div className="calendar-month">{formatMonth(month)}</div>

                <button type="button" className="calendar-nav" onClick={nextMonth} aria-label="Next month">
                    <ToolbarIcon svg={svg.right}></ToolbarIcon>
                </button>
            </div>

            <div className="calendar-weekdays">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-days">
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={`empty-${index}`} />
                    }

                    const isToday = isSameDay(date, today)
                    const selected = isSameDay(date, value)
                    const currentMonth = isSameMonth(date, month)

                    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

                    const isFuture = dateOnly > todayOnly

                    return (
                        <button
                            key={date.getDate()}
                            type="button"
                            disabled={isFuture}
                            className={[
                                'calendar-day',
                                selected ? 'selected' : '',
                                isToday ? 'today' : '',
                                currentMonth ? '' : 'outside',
                                isFuture ? 'future' : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            onClick={() => {
                                if (!isFuture) {
                                    handleSelect(date)
                                }
                            }}
                        >
                            {date.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
