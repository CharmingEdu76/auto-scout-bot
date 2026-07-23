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
    try {
      const res = await fetch(`/api/test-scan/${userId}`, {
        method: 'POST',
      })
      const data = await res.json()
      alert(data.message)
      fetchData()
    } catch (err) {
      console.error('Test scan failed:', err)
    }
  }

  if (loading) return <div className="text-center py-8">Lädt...</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleTestScan}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          🧪 Test Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Benachrichtigungen</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.notificationsSent || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Inserate gescannt</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalListings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Status</h3>
          <p className="text-lg font-bold text-green-600">🟢 Aktiv</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Neueste Angebote</h2>
        <div className="space-y-4">
          {listings.length === 0 ? (
            <p className="text-gray-500">Keine Angebote gefunden. Starten Sie einen Scan!</p>
          ) : (
            listings.map((listing) => (
              <div key={listing.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{listing.title}</h3>
                    <p className="text-gray-600">{listing.location}</p>
                    <p className="text-sm text-gray-500">
                      {listing.mileage.toLocaleString()} km • {listing.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">€{listing.price.toLocaleString()}</p>
                    {listing.analyzedScore !== null && (
                      <p
                        className={`text-sm font-semibold ${
                          listing.analyzedScore > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {listing.analyzedScore > 0 ? '✓' : '✗'} {Math.abs(listing.analyzedScore).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
