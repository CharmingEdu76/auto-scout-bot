import { useState, useEffect } from 'react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import Icon from '../components/Icon'

interface Notification {
  id: string
  listingId: string
  sentAt: string
  listing: {
    title: string
    price: number
    mileage: number
    year: number
    location: string
    brand: string
    model: string
  }
}

export default function Notifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [userId])

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications/${userId}`)
      setNotifications(await res.json())
    } catch (err) {
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Benachrichtigungen"
        subtitle="Alle Angebote, über die dich der Bot informiert hat"
      />

      {notifications.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="bell"
            title="Keine Benachrichtigungen"
            description="Sobald der Bot ein interessantes Angebot findet, erscheint es hier."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const formattedDate = new Date(notif.sentAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={notif.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50/50"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {notif.listing.brand} {notif.listing.model}
                  </h3>
                  <p className="mt-0.5 truncate text-sm text-gray-500">{notif.listing.title}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="map-pin" className="h-4 w-4" />
                      {notif.listing.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="gauge" className="h-4 w-4" />
                      {notif.listing.mileage.toLocaleString('de-DE')} km
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="calendar" className="h-4 w-4" />
                      {notif.listing.year}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xl font-semibold text-gray-900">
                    {notif.listing.price.toLocaleString('de-DE')} €
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{formattedDate}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
