import { useState, useEffect } from 'react'

interface Listing {
  id: string
  title: string
  price: number
  mileage: number
  brand: string
  model: string
  year: number
  analyzedScore: number | null
  location: string
}

interface Stats {
  notificationsSent: number
  totalListings: number
  topDeals: Listing[]
}

export default function Dashboard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      const [statsRes, listingsRes] = await Promise.all([
        fetch(`/api/stats/${userId}`),
        fetch('/api/listings?limit=10'),
      ])
      setStats(await statsRes.json())
      setListings(await listingsRes.json())
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTestScan = async () => {
    setScanning(true)
    try {
      const res = await fetch(`/api/test-scan/${userId}`, { method: 'POST' })
      const data = await res.json()
      alert(data.message)
      await fetchData()
    } catch (err) {
      console.error('Test scan failed:', err)
      alert('Test Scan fehlgeschlagen')
    } finally {
      setScanning(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-nic-gray font-nic-body">Lädt Dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleTestScan}
          disabled={scanning}
          className="nic-btn-primary disabled:opacity-50"
        >
          {scanning ? '⏳ Scanne...' : '🧪 Test Scan'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notifications Card */}
        <div className="nic-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-nic-lightgray-1 font-nic-body mb-2">Benachrichtigungen</p>
              <p className="text-4xl font-bold text-nic-green font-nic-heading">
                {stats?.notificationsSent || 0}
              </p>
            </div>
            <div className="text-4xl">🔔</div>
          </div>
          <p className="text-xs text-nic-lightgray-2 mt-3 font-nic-body">Gesendete Alerts</p>
        </div>

        {/* Listings Card */}
        <div className="nic-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-nic-lightgray-1 font-nic-body mb-2">Inserate gescannt</p>
              <p className="text-4xl font-bold text-nic-green font-nic-heading">
                {stats?.totalListings || 0}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <p className="text-xs text-nic-lightgray-2 mt-3 font-nic-body">Gesamt analysiert</p>
        </div>

        {/* Status Card */}
        <div className="nic-card bg-gradient-to-br from-nic-green/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-nic-lightgray-1 font-nic-body mb-2">Status</p>
              <p className="text-2xl font-bold text-nic-green font-nic-heading">🟢 Aktiv</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
          <p className="text-xs text-nic-lightgray-2 mt-3 font-nic-body">24/7 läuft</p>
        </div>
      </div>

      {/* Listings Section */}
      <div className="nic-card">
        <h2 className="text-2xl font-nic-heading font-bold text-nic-green mb-6 pb-4 border-b-4 border-nic-green">
          Neueste Angebote
        </h2>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-nic-lightgray-1 font-nic-body">Keine Angebote gefunden</p>
            <p className="text-sm text-nic-lightgray-2 mt-2 font-nic-body">
              Starten Sie einen Scan, um Angebote zu sehen
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border-l-4 border-nic-green p-4 bg-nic-bg hover:bg-white transition rounded"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-nic-gray mb-1 font-nic-heading">{listing.title}</h3>
                    <div className="flex gap-4 text-xs text-nic-lightgray-1 font-nic-body">
                      <span>📍 {listing.location}</span>
                      <span>🛣️ {listing.mileage.toLocaleString()} km</span>
                      <span>📅 {listing.year}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-nic-green font-nic-heading">€{listing.price.toLocaleString()}</p>
                    {listing.analyzedScore !== null && (
                      <p
                        className={`text-sm font-bold mt-1 ${
                          listing.analyzedScore > 0 ? 'text-nic-green' : 'text-nic-lightgray-2'
                        }`}
                      >
                        {listing.analyzedScore > 0 ? '✓ Gut' : '○ Neutral'} {Math.abs(listing.analyzedScore).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
