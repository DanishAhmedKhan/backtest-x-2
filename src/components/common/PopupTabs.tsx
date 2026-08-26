import { useState } from 'react'

export type PopupTab = {
    id: string
    label: string
    content: React.ReactNode
}

type Props = {
    tabs: PopupTab[]
    defaultTab?: string
}

export function PopupTabs({ tabs, defaultTab }: Props) {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id)

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)

    if (tabs.length === 0) {
        return null
    }

    return (
        <div className="popup-tabs">
            <div className="popup-tabs-header">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={activeTab === tab.id ? 'popup-tab active' : 'popup-tab'}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="popup-tab-content">{activeTabContent?.content}</div>
        </div>
    )
}
