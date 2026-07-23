import { useState, useEffect } from 'react'

interface UserPreferences {
  id: string
  brand: string | null
  model: string | null
  minPrice: number | null
  maxPrice: number | null
  minYear: number | null
  maxYear: number | null
  maxMileage: number | null
  minScoreThreshold: number
  active: boolean
}

export default function Preferences({ userId }: { userId: string }) {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [userId])

  const fetchPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences/${userId}`)
      setPrefs(await res.json())
    } catch (err) {
      console.error('Error loading preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!prefs) return
    try {
      await fetch(`/api/preferences/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Error saving preferences:', err)
    }
  }

  if (loading) return <div className="text-center py-8">Lädt...</div>
  if (!prefs) return <div className="text-center py-8">Fehler beim Laden</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Suchkriterien</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Marke (optional)</label>
            <input
              type="text"
              placeholder="z.B. BMW"
              value={prefs.brand || ''}
              onChange={(e) => setPrefs({ ...prefs, brand: e.target.value || null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Modell (optional)</label>
            <input
              type="text"
              placeholder="z.B. 3er"
              value={prefs.model || ''}
              onChange={(e) => setPrefs({ ...prefs, model: e.target.value || null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Mindestpreis (€)</label>
            <input
              type="number"
              value={prefs.minPrice || ''}
              onChange={(e) => setPrefs({ ...prefs, minPrice: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Höchstpreis (€)</label>
            <input
              type="number"
              value={prefs.maxPrice || ''}
              onChange={(e) => setPrefs({ ...prefs, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Baujahr von</label>
            <input
              type="number"
              value={prefs.minYear || ''}
              onChange={(e) => setPrefs({ ...prefs, minYear: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Baujahr bis</label>
            <input
              type="number"
              value={prefs.maxYear || ''}
              onChange={(e) => setPrefs({ ...prefs, maxYear: e.target.value ? parseInt(e.target.value) : null })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Maximale Laufleistung (km)</label>
          <input
            type="number"
            value={prefs.maxMileage || ''}
            onChange={(e) => setPrefs({ ...prefs, maxMileage: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Mindest Value-Score: {prefs.minScoreThreshold.toFixed(1)}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={prefs.minScoreThreshold}
            onChange={(e) => setPrefs({ ...prefs, minScoreThreshold: parseFloat(e.target.value) })}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">Nur Angebote mit besserer Bewertung benachrichtigen</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.active}
            onChange={(e) => setPrefs({ ...prefs, active: e.target.checked })}
            className="w-4 h-4"
          />
          <label className="text-sm font-semibold">Bot aktiv</label>
        </div>

        {saved && <div className="bg-green-100 text-green-800 p-3 rounded-lg">✓ Einstellungen gespeichert!</div>}

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Speichern
        </button>
      </div>
    </div>
  )
}
