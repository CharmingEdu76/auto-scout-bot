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

  if (loading) return <div className="text-center py-12 text-nic-gray font-nic-body">Lädt...</div>
  if (!prefs) return <div className="text-center py-12 text-nic-gray font-nic-body">Fehler beim Laden</div>

  return (
    <div className="nic-card max-w-2xl">
      <h2 className="text-2xl font-nic-heading font-bold text-nic-green mb-8 pb-4 border-b-4 border-nic-green">
        ⚙️ Suchkriterien
      </h2>

      <div className="space-y-8">
        {/* Auto Details */}
        <div>
          <h3 className="text-lg font-nic-heading font-bold text-nic-gray mb-4">Fahrzeug</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="nic-label">Marke</label>
              <input
                type="text"
                placeholder="z.B. BMW"
                value={prefs.brand || ''}
                onChange={(e) => setPrefs({ ...prefs, brand: e.target.value || null })}
                className="nic-input"
              />
            </div>
            <div>
              <label className="nic-label">Modell</label>
              <input
                type="text"
                placeholder="z.B. 3er"
                value={prefs.model || ''}
                onChange={(e) => setPrefs({ ...prefs, model: e.target.value || null })}
                className="nic-input"
              />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-nic-heading font-bold text-nic-gray mb-4">Preis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="nic-label">Mindestpreis (€)</label>
              <input
                type="number"
                value={prefs.minPrice || ''}
                onChange={(e) => setPrefs({ ...prefs, minPrice: e.target.value ? parseInt(e.target.value) : null })}
                className="nic-input"
              />
            </div>
            <div>
              <label className="nic-label">Höchstpreis (€)</label>
              <input
                type="number"
                value={prefs.maxPrice || ''}
                onChange={(e) => setPrefs({ ...prefs, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
                className="nic-input"
              />
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div>
          <h3 className="text-lg font-nic-heading font-bold text-nic-gray mb-4">Baujahr</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="nic-label">Von</label>
              <input
                type="number"
                value={prefs.minYear || ''}
                onChange={(e) => setPrefs({ ...prefs, minYear: e.target.value ? parseInt(e.target.value) : null })}
                className="nic-input"
              />
            </div>
            <div>
              <label className="nic-label">Bis</label>
              <input
                type="number"
                value={prefs.maxYear || ''}
                onChange={(e) => setPrefs({ ...prefs, maxYear: e.target.value ? parseInt(e.target.value) : null })}
                className="nic-input"
              />
            </div>
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label className="nic-label">Maximale Laufleistung (km)</label>
          <input
            type="number"
            value={prefs.maxMileage || ''}
            onChange={(e) => setPrefs({ ...prefs, maxMileage: e.target.value ? parseInt(e.target.value) : null })}
            className="nic-input"
          />
        </div>

        {/* Value Score Threshold */}
        <div className="border-t-2 border-nic-border pt-6">
          <label className="nic-label">
            Mindest Value-Score: <span className="text-nic-green font-bold">{prefs.minScoreThreshold.toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={prefs.minScoreThreshold}
            onChange={(e) => setPrefs({ ...prefs, minScoreThreshold: parseFloat(e.target.value) })}
            className="w-full accent-nic-green"
          />
          <p className="text-xs text-nic-lightgray-2 mt-2 font-nic-body">Nur Angebote mit besserer Bewertung benachrichtigen</p>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 bg-nic-green/5 p-4 rounded-lg">
          <input
            type="checkbox"
            checked={prefs.active}
            onChange={(e) => setPrefs({ ...prefs, active: e.target.checked })}
            className="w-5 h-5 accent-nic-green cursor-pointer"
          />
          <label className="font-nic-body font-semibold text-nic-gray cursor-pointer">
            Bot ist {prefs.active ? '🟢 aktiv' : '🔴 inaktiv'}
          </label>
        </div>

        {/* Save Button & Message */}
        {saved && (
          <div className="bg-nic-green/10 text-nic-green p-4 rounded-lg font-nic-body flex items-center gap-2">
            ✓ Einstellungen gespeichert!
          </div>
        )}

        <button onClick={handleSave} className="nic-btn-primary w-full">
          💾 Speichern
        </button>
      </div>
    </div>
  )
}
