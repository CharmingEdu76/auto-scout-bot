interface AppHeaderProps {
  email: string
  currentTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

export default function AppHeader({ email, currentTab, onTabChange, onLogout }: AppHeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'preferences', label: 'Einstellungen', icon: '⚙️' },
    { id: 'notifications', label: 'Benachrichtigungen', icon: '🔔' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-nic-green shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚗</div>
            <div>
              <h1 className="text-2xl font-nic-heading font-bold text-nic-green">
                Auto-Scout Bot
              </h1>
              <p className="text-sm text-nic-lightgray-1 font-nic-body">{email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-nic-body text-nic-lightgray-1 hover:text-nic-green transition-colors"
          >
            Abmelden
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 border-t border-nic-border pt-4 pb-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 rounded-t-lg font-nic-body text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                currentTab === tab.id
                  ? 'bg-nic-green text-white border-b-4 border-nic-green'
                  : 'text-nic-lightgray-1 border-b-4 border-transparent hover:text-nic-green hover:bg-nic-green/5'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
