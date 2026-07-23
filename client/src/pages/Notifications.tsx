import { useState, useEffect } from 'react'
import EmptyState from '../components/EmptyState'

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

  if (loading) {
    return <EmptyState icon="⏳" title="Lädt..." />
  }

  return (
    <div className="card">
      <h2 className="mb-8">🔔 Benachrichtigungsverlauf</h2>

      {notifications.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Keine Benachrichtigungen vorhanden"
          description="Benachrichtigungen erscheinen hier wenn der Bot interessante Angebote findet"
        />
      ) : (
        <div className="space-y-4 max-w-4xl">
          {notifications.map((notif) => {
            const date = new Date(notif.sentAt)
            const formattedDate = date.toLocaleDateString('de-DE', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={notif.id}
                className="card-hover border-l-4 border-nic-green"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-nic-gray mb-1 font-nic-heading">
                      {notif.listing.brand} {notif.listing.model}
                    </h3>
                    <p className="text-sm text-nic-lightgray-1 font-nic-body mb-3 truncate">
                      {notif.listing.title}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-nic-lightgray-1 font-nic-body">
                      <span>📍 {notif.listing.location}</span>
                      <span>🛣️ {notif.listing.mileage.toLocaleString()} km</span>
                      <span>📅 {notif.listing.year}</span>
                      <span className="text-nic-lightgray-2">⏰ {formattedDate}</span>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap flex-shrink-0">
                    <p className="text-3xl font-bold text-nic-green font-nic-heading">
                      €{notif.listing.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
