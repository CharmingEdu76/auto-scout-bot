import { useState, useEffect } from 'react'
import EmptyState from '../components/EmptyState'

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

  if (loading) return <EmptyState icon="⏳" title="Lädt..." />
  if (!prefs) return <EmptyState icon="⚠️" title="Fehler beim Laden" />

  return (
    <div className="max-w-2xl">
      <div className="card">
        <h2 className="mb-8">⚙️ Suchkriterien</h2>

        <div className="space-y-8">
          {/* Fahrzeug */}
          <div>
            <h3 className="section-title">Fahrzeug</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Marke</label>
                <input
                  type="text"
                  placeholder="z.B. BMW"
                  value={prefs.brand || ''}
                  onChange={(e) => setPrefs({ ...prefs, brand: e.target.value || null })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Modell</label>
                <input
                  type="text"
                  placeholder="z.B. 3er"
                  value={prefs.model || ''}
                  onChange={(e) => setPrefs({ ...prefs, model: e.target.value || null })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Preis */}
          <div>
            <h3 className="section-title">Preis</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Mindestpreis (€)</label>
                <input
                  type="number"
                  value={prefs.minPrice || ''}
                  onChange={(e) => setPrefs({ ...prefs, minPrice: e.target.value ? parseInt(e.target.value) : null })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Höchstpreis (€)</label>
                <input
                  type="number"
                  value={prefs.maxPrice || ''}
                  onChange={(e) => setPrefs({ ...prefs, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Baujahr */}
          <div>
            <h3 className="section-title">Baujahr</h3>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Von</label>
                <input
                  type="number"
                  value={prefs.minYear || ''}
                  onChange={(e) => setPrefs({ ...prefs, minYear: e.target.value ? parseInt(e.target.value) : null })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bis</label>
                <input
                  type="number"
                  value={prefs.maxYear || ''}
                  onChange={(e) => setPrefs({ ...prefs, maxYear: e.target.value ? parseInt(e.target.value) : null })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Laufleistung */}
          <div>
            <h3 className="section-title">Laufleistung</h3>
            <div className="form-group">
              <label className="form-label">Maximale km</label>
              <input
                type="number"
                value={prefs.maxMileage || ''}
                onChange={(e) => setPrefs({ ...prefs, maxMileage: e.target.value ? parseInt(e.target.value) : null })}
                className="form-input"
              />
            </div>
          </div>

          <div className="divider" />

          {/* Value Score */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="form-label m-0">Mindest Value-Score</label>
              <span className="text-lg font-bold text-nic-green">{prefs.minScoreThreshold.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={prefs.minScoreThreshold}
              onChange={(e) => setPrefs({ ...prefs, minScoreThreshold: parseFloat(e.target.value) })}
              className="w-full accent-nic-green h-2 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-hint mt-2">Nur Angebote mit besserer Bewertung benachrichtigen</p>
          </div>

          <div className="divider" />

          {/* Bot Status */}
          <div className="flex items-center gap-3 p-4 bg-nic-green/5 rounded-lg border border-nic-green/20">
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

          {/* Success Message */}
          {saved && (
            <div className="p-4 bg-nic-green/10 text-nic-green rounded-lg font-nic-body flex items-center gap-2 border border-nic-green/20">
              <span className="text-lg">✓</span>
              <span>Einstellungen erfolgreich gespeichert!</span>
            </div>
          )}

          {/* Save Button */}
          <button onClick={handleSave} className="btn-primary w-full">
            💾 Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
