import { useState } from 'react'
import Icon from './Icon'

interface SidebarProps {
  email: string
  currentTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'preferences', label: 'Einstellungen', icon: 'settings' },
  { id: 'notifications', label: 'Benachrichtigungen', icon: 'bell' },
]

export default function Sidebar({ email, currentTab, onTabChange, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
          <Icon name="car" className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold text-gray-900">Auto-Scout</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id)
                setMobileOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand/10 text-brand-dark'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand-dark">
            {email.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{email}</p>
            <p className="text-xs text-gray-400">Angemeldet</p>
          </div>
          <button
            onClick={onLogout}
            className="flex-shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="Abmelden"
          >
            <Icon name="logout" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Icon name="car" className="h-4 w-4" />
          </div>
          <span className="font-semibold text-gray-900">Auto-Scout</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="Menü öffnen"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 rounded-md p-1.5 text-gray-400 hover:bg-gray-100"
              aria-label="Menü schließen"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
