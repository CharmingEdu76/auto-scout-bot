import Icon from './Icon'

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
  const hasScore = score !== null && score !== undefined
  const isGood = hasScore && score > 0

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 hover:bg-gray-50/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-gray-900">
            {brand} {model}
          </h3>
          {hasScore && (
            <span
              className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isGood ? 'bg-brand/10 text-brand-dark' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Icon name={isGood ? 'trending-up' : 'minus'} className="h-3 w-3" />
              {isGood ? 'Guter Deal' : 'Neutral'}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500">{title}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="map-pin" className="h-4 w-4" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="gauge" className="h-4 w-4" />
            {mileage.toLocaleString('de-DE')} km
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4" />
            {year}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xl font-semibold text-gray-900">
          {price.toLocaleString('de-DE')} €
        </p>
        {hasScore && (
          <p className={`text-sm font-medium ${isGood ? 'text-brand-dark' : 'text-gray-400'}`}>
            {isGood ? '+' : ''}
            {score.toFixed(1)} %
          </p>
        )}
      </div>
    </div>
  )
}
