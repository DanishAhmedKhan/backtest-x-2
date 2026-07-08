import { useState } from 'react'

type Props = {
    open: boolean
    initialDate?: Date
    onClose: () => void
    onGo: (date: Date) => void
}

function toDateInputValue(date: Date) {
    return date.toISOString().split('T')[0]
}

function toTimeInputValue(date: Date) {
    return date.toTimeString().slice(0, 5)
}

export default function JumpToDialog({ open, initialDate = new Date(), onClose, onGo }: Props) {
    const [date, setDate] = useState(toDateInputValue(initialDate))
    const [time, setTime] = useState(toTimeInputValue(initialDate))

    if (!open) return null

    const handleGo = () => {
        const selected = new Date(`${date}T${time}:00`)

        if (isNaN(selected.getTime())) return

        onGo(selected)
        onClose()
    }

    return (
        <>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.35)',
                    zIndex: 1000,
                }}
            />

            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 320,
                    background: '#fff',
                    borderRadius: 8,
                    padding: 20,
                    boxShadow: '0 8px 30px rgba(0,0,0,.25)',
                    zIndex: 1001,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}
            >
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                    }}
                >
                    Jump To
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                    }}
                >
                    <label>Date</label>

                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                    }}
                >
                    <label>Time</label>

                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10,
                        marginTop: 10,
                    }}
                >
                    <button onClick={onClose}>Cancel</button>

                    <button onClick={handleGo}>Go</button>
                </div>
            </div>
        </>
    )
}
