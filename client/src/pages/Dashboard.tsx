import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import OfferItem from '../components/OfferItem'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import Icon from '../components/Icon'

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

  if (loading) return <Spinner label="Lädt Dashboard…" />

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Übersicht über deine gefundenen Angebote"
        action={
          <button onClick={handleTestScan} disabled={scanning} className="btn-primary">
            <Icon name="search" className="h-4 w-4" />
            {scanning ? 'Scanne…' : 'Scan starten'}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Benachrichtigungen"
          value={stats?.notificationsSent ?? 0}
          icon="bell"
          sublabel="Gesendete Alerts"
        />
        <StatCard
          label="Inserate gescannt"
          value={stats?.totalListings ?? 0}
          icon="dashboard"
          sublabel="Gesamt analysiert"
        />
        <StatCard
          label="Bot-Status"
          value={
            <span className="inline-flex items-center gap-2 text-2xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
              Aktiv
            </span>
          }
          icon="activity"
          sublabel="Läuft rund um die Uhr"
          accent
        />
      </div>

      {/* Listings */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Neueste Angebote</h2>
        {listings.length === 0 ? (
          <div className="card">
            <EmptyState
              icon="search"
              title="Noch keine Angebote"
              description="Starte einen Scan, um passende Fahrzeuge zu finden."
            />
          </div>
        ) : (
          <div className="space-y-3">
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
