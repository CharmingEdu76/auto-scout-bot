import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Preferences from './pages/Preferences'
import Notifications from './pages/Notifications'
import Icon from './components/Icon'

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
    setCurrentPage('dashboard')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand" />
      </div>
    )
  }

  // Login screen
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
              <Icon name="car" className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Auto-Scout Bot</h1>
            <p className="mt-1 text-sm text-gray-500">
              Finde automatisch die besten Auto-Deals
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const email = (e.currentTarget.elements[0] as HTMLInputElement).value
                handleRegister(email)
              }}
              className="space-y-4"
            >
              <div>
                <label className="label">E-Mail-Adresse</label>
                <input
                  type="email"
                  placeholder="deine@email.com"
                  required
                  className="input"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Anmelden
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Gib deine E-Mail ein, um zu starten
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        email={user.email}
        currentTab={currentPage}
        onTabChange={(tab) => setCurrentPage(tab as Page)}
        onLogout={handleLogout}
      />

      <div className="md:pl-64">
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
          {currentPage === 'dashboard' && <Dashboard userId={user.id} />}
          {currentPage === 'preferences' && <Preferences userId={user.id} />}
          {currentPage === 'notifications' && <Notifications userId={user.id} />}
        </main>
      </div>
    </div>
  )
}

export default App
