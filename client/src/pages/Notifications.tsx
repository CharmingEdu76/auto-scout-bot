import { useState, useEffect } from 'react'

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
    return <div className="text-center py-12 text-nic-gray font-nic-body">Lädt...</div>
  }

  return (
    <div className="nic-card">
      <h2 className="text-2xl font-nic-heading font-bold text-nic-green mb-8 pb-4 border-b-4 border-nic-green">
        🔔 Benachrichtigungsverlauf
      </h2>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-nic-lightgray-1 font-nic-body">Keine Benachrichtigungen vorhanden</p>
          <p className="text-sm text-nic-lightgray-2 mt-2 font-nic-body">
            Benachrichtigungen erscheinen hier wenn der Bot interessante Angebote findet
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
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
                className="border-l-4 border-nic-green p-4 bg-nic-bg hover:bg-white transition rounded"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-nic-gray mb-1 font-nic-heading">
                      {notif.listing.brand} {notif.listing.model}
                    </h3>
                    <p className="text-sm text-nic-lightgray-1 font-nic-body mb-2">
                      {notif.listing.title}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-nic-lightgray-1 font-nic-body">
                      <span>📍 {notif.listing.location}</span>
                      <span>🛣️ {notif.listing.mileage.toLocaleString()} km</span>
                      <span>📅 {notif.listing.year}</span>
                      <span className="text-nic-lightgray-2">⏰ {formattedDate}</span>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-2xl font-bold text-nic-green font-nic-heading">
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
