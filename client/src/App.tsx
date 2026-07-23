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
      console.log('Registering with email:', email)
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      console.log('Response status:', res.status)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Registration successful:', data)
      localStorage.setItem('userId', data.user.id)
      localStorage.setItem('userEmail', email)
      setUser({ id: data.user.id, email })
    } catch (err) {
      console.error('Registration failed:', err)
      alert(`Fehler: ${err}`)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Lädt...</div>

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">🚗 Auto-Scout</h1>
            <p className="text-gray-600">Finde die besten Auto-Deals automatisch</p>
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
              <input
                type="email"
                placeholder="deine@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Starten
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">🚗 Auto-Scout</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded transition ${
                currentPage === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('preferences')}
              className={`px-4 py-2 rounded transition ${
                currentPage === 'preferences'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Einstellungen
            </button>
            <button
              onClick={() => setCurrentPage('notifications')}
              className={`px-4 py-2 rounded transition ${
                currentPage === 'notifications'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Benachrichtigungen
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard userId={user.id} />}
        {currentPage === 'preferences' && <Preferences userId={user.id} />}
        {currentPage === 'notifications' && <Notifications userId={user.id} />}
      </main>
    </div>
  )
}

export default App
