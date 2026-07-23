import { useState, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import Dashboard from './pages/Dashboard'
import Preferences from './pages/Preferences'
import Notifications from './pages/Notifications'

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

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-nic-bg">
        <p className="text-nic-gray font-nic-body">Lädt...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nic-green/10 to-white flex items-center justify-center p-4">
        <div className="card w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🚗</div>
            <h1 className="text-4xl mb-3">Auto-Scout Bot</h1>
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
            <div className="form-group">
              <label className="form-label">E-Mail Adresse</label>
              <input
                type="email"
                placeholder="deine@email.com"
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Anmelden
            </button>
          </form>

          <p className="text-center text-hint mt-6">
            Geben Sie Ihre E-Mail ein, um zu beginnen
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nic-bg">
      <AppHeader
        email={user.email}
        currentTab={currentPage}
        onTabChange={(tab) => setCurrentPage(tab as Page)}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <Dashboard userId={user.id} />}
        {currentPage === 'preferences' && <Preferences userId={user.id} />}
        {currentPage === 'notifications' && <Notifications userId={user.id} />}
      </main>
    </div>
  )
}

export default App
