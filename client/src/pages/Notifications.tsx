import { useState, useEffect } from 'react'

interface Notification {
  id: string
  sentAt: string
  listing: {
    title: string
    price: number
    mileage: number
    brand: string
    model: string
    year: number
    location: string
    analyzedScore: number | null
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

  if (loading) return <div className="text-center py-8">Lädt...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Benachrichtigungsverlauf</h2>

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          <p>Noch keine Benachrichtigungen gesendet.</p>
          <p className="text-sm mt-2">Der Bot scannt alle 2 Stunden auf gute Angebote.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{notif.listing.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(notif.sentAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">€{notif.listing.price.toLocaleString()}</p>
                  {notif.listing.analyzedScore !== null && (
                    <p className="text-sm font-semibold text-green-600">
                      ✓ {notif.listing.analyzedScore.toFixed(1)}% Wert
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Laufleistung</p>
                  <p className="font-semibold">{notif.listing.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-gray-600">Baujahr</p>
                  <p className="font-semibold">{notif.listing.year}</p>
                </div>
                <div>
                  <p className="text-gray-600">Ort</p>
                  <p className="font-semibold">{notif.listing.location}</p>
                </div>
                <div>
                  <p className="text-gray-600">Zustand</p>
                  <p className="font-semibold">Gebraucht</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
