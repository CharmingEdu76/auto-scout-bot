import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'

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

  if (loading) return <Spinner />
  if (!prefs) return <EmptyState icon="alert" title="Fehler beim Laden" />

  const num = (v: string) => (v ? parseInt(v) : null)

  return (
    <div className="max-w-3xl">
      <PageHeader title="Einstellungen" subtitle="Definiere deine Suchkriterien für den Bot" />

      <div className="space-y-6">
        {/* Fahrzeug */}
        <section className="card">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Fahrzeug</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Marke</label>
              <input
                type="text"
                placeholder="z.B. BMW"
                value={prefs.brand || ''}
                onChange={(e) => setPrefs({ ...prefs, brand: e.target.value || null })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Modell</label>
              <input
                type="text"
                placeholder="z.B. 3er"
                value={prefs.model || ''}
                onChange={(e) => setPrefs({ ...prefs, model: e.target.value || null })}
                className="input"
              />
            </div>
          </div>
        </section>

        {/* Preis & Baujahr */}
        <section className="card">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Preis & Baujahr</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Mindestpreis (€)</label>
              <input
                type="number"
                placeholder="0"
                value={prefs.minPrice ?? ''}
                onChange={(e) => setPrefs({ ...prefs, minPrice: num(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Höchstpreis (€)</label>
              <input
                type="number"
                placeholder="Beliebig"
                value={prefs.maxPrice ?? ''}
                onChange={(e) => setPrefs({ ...prefs, maxPrice: num(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Baujahr von</label>
              <input
                type="number"
                placeholder="z.B. 2015"
                value={prefs.minYear ?? ''}
                onChange={(e) => setPrefs({ ...prefs, minYear: num(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Baujahr bis</label>
              <input
                type="number"
                placeholder="z.B. 2024"
                value={prefs.maxYear ?? ''}
                onChange={(e) => setPrefs({ ...prefs, maxYear: num(e.target.value) })}
                className="input"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Maximale Laufleistung (km)</label>
            <input
              type="number"
              placeholder="z.B. 150000"
              value={prefs.maxMileage ?? ''}
              onChange={(e) => setPrefs({ ...prefs, maxMileage: num(e.target.value) })}
              className="input"
            />
          </div>
        </section>

        {/* Value Score */}
        <section className="card">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Mindest Value-Score</h2>
            <span className="rounded-md bg-brand/10 px-2.5 py-1 text-sm font-semibold text-brand-dark">
              {prefs.minScoreThreshold.toFixed(0)} %
            </span>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Nur Angebote mit besserer Bewertung lösen eine Benachrichtigung aus.
          </p>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={prefs.minScoreThreshold}
            onChange={(e) =>
              setPrefs({ ...prefs, minScoreThreshold: parseFloat(e.target.value) })
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-brand"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-400">
            <span>0 %</span>
            <span>50 %</span>
          </div>
        </section>

        {/* Status */}
        <section className="card flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Bot-Aktivität</h2>
            <p className="mt-1 text-sm text-gray-500">
              {prefs.active
                ? 'Der Bot sucht aktiv nach neuen Angeboten.'
                : 'Der Bot ist pausiert.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.active}
            onClick={() => setPrefs({ ...prefs, active: !prefs.active })}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
              prefs.active ? 'bg-brand' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                prefs.active ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button onClick={handleSave} className="btn-primary">
            <Icon name="check" className="h-4 w-4" />
            Speichern
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark">
              <Icon name="check" className="h-4 w-4" />
              Gespeichert
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
