interface OfferItemProps {
  title: string
  brand: string
  model: string
  price: number
  mileage: number
  year: number
  location: string
  score?: number | null
}

export default function OfferItem({
  title,
  brand,
  model,
  price,
  mileage,
  year,
  location,
  score,
}: OfferItemProps) {
  const scoreColor = score && score > 0 ? 'text-nic-green' : 'text-nic-lightgray-2'
  const scoreText = score && score > 0 ? '✓ Gut' : '○ Neutral'

  return (
    <div className="card-hover border-l-4 border-nic-green">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-nic-gray mb-1 font-nic-heading">
            {brand} {model}
          </h3>
          <p className="text-sm text-nic-lightgray-1 font-nic-body mb-3 truncate">{title}</p>
          <div className="flex flex-wrap gap-4 text-xs text-nic-lightgray-1 font-nic-body">
            <span className="flex items-center gap-1">
              📍 {location}
            </span>
            <span className="flex items-center gap-1">
              🛣️ {mileage.toLocaleString()} km
            </span>
            <span className="flex items-center gap-1">
              📅 {year}
            </span>
          </div>
        </div>
        <div className="text-right whitespace-nowrap flex-shrink-0">
          <p className="text-3xl font-bold text-nic-green font-nic-heading">
            €{price.toLocaleString()}
          </p>
          {score !== null && score !== undefined && (
            <p className={`text-sm font-bold mt-2 ${scoreColor}`}>
              {scoreText} {Math.abs(score).toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
