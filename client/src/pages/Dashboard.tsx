import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import OfferItem from '../components/OfferItem'
import EmptyState from '../components/EmptyState'

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-nic-gray font-nic-body">Lädt Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleTestScan}
          disabled={scanning}
          className="btn-primary disabled:opacity-50"
        >
          {scanning ? '⏳ Scanne...' : '🧪 Test Scan'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid-3">
        <StatCard
          label="Benachrichtigungen"
          value={stats?.notificationsSent || 0}
          icon="🔔"
          sublabel="Gesendete Alerts"
        />
        <StatCard
          label="Inserate gescannt"
          value={stats?.totalListings || 0}
          icon="📊"
          sublabel="Gesamt analysiert"
        />
        <StatCard
          label="Status"
          value="🟢 Aktiv"
          icon="✓"
          sublabel="24/7 läuft"
          highlight
        />
      </div>

      {/* Listings Section */}
      <div className="card">
        <h2 className="mb-8">Neueste Angebote</h2>

        {listings.length === 0 ? (
          <EmptyState
            icon="📭"
            title="Keine Angebote gefunden"
            description="Starten Sie einen Scan, um Angebote zu sehen"
          />
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <OfferItem
                key={listing.id}
                title={listing.title}
                brand={listing.brand}
                model={listing.model}
                price={listing.price}
                mileage={listing.mileage}
                year={listing.year}
                location={listing.location}
                score={listing.analyzedScore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
