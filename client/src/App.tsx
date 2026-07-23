import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Preferences from './pages/Preferences'
import Notifications from './pages/Notifications'
import './App.css'

type Page = 'dashboard' | 'preferences' | 'notifications'

interface User {
  id: string
  email: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) {
      setUser({ id: userId, email: localStorage.getItem('userEmail') || '' })
    }
    setLoading(false)
  }, [])

  const handleRegister = async (email: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Registration failed')
      const data = await res.json()
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userEmail', email)
      setUser({ id: data.user.id, email })
    } catch (err) {
      alert(`Fehler: ${err}`)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-nic-gray">Lädt...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nic-green/5 to-nic-gray/5 flex items-center justify-center p-4">
        <div className="nic-card w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚗</div>
            <h1 className="text-3xl font-nic-heading font-bold text-nic-green mb-2 border-b-4 border-nic-green pb-3">
              Auto-Scout Bot
            </h1>
            <p className="text-nic-lightgray-1 font-nic-body text-sm">
              Finde die besten Auto-Deals automatisch
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const email = (e.currentTarget.elements[0] as HTMLInputElement).value
              handleRegister(email)
            }}
            className="space-y-4"
          >
            <div>
              <label className="nic-label">E-Mail Adresse</label>
              <input
                type="email"
                placeholder="deine@email.com"
                required
                className="nic-input"
              />
            </div>
            <button type="submit" className="nic-btn-primary w-full">
              Anmelden
            </button>
          </form>

          <p className="text-center text-xs text-nic-lightgray-2 mt-6 font-nic-body">
            Geben Sie Ihre E-Mail ein, um zu beginnen
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nic-bg">
      {/* Header */}
      <header className="bg-white border-b-4 border-nic-green shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🚗</div>
              <div>
                <h1 className="text-xl font-nic-heading font-bold text-nic-green">Auto-Scout Bot</h1>
                <p className="text-xs text-nic-lightgray-1 font-nic-body">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('userId')
                localStorage.removeItem('userEmail')
                setUser(null)
              }}
              className="text-sm text-nic-lightgray-1 hover:text-nic-green transition font-nic-body"
            >
              Abmelden
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex gap-2 border-t border-nic-border pt-4">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: '📊' },
              { key: 'preferences', label: 'Einstellungen', icon: '⚙️' },
              { key: 'notifications', label: 'Benachrichtigungen', icon: '🔔' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentPage(item.key as Page)}
                className={`px-4 py-2 rounded-t-lg font-nic-body text-sm transition border-b-2 ${
                  currentPage === item.key
                    ? 'bg-nic-green text-white border-b-nic-green'
                    : 'text-nic-lightgray-1 border-b-transparent hover:text-nic-green'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <Dashboard userId={user.id} />}
        {currentPage === 'preferences' && <Preferences userId={user.id} />}
        {currentPage === 'notifications' && <Notifications userId={user.id} />}
      </main>
    </div>
  )
}

export default App
