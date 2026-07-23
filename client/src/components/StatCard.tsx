interface StatCardProps {
  label: string
  value: number | string
  icon: string
  sublabel?: string
  highlight?: boolean
}

export default function StatCard({ label, value, icon, sublabel, highlight = false }: StatCardProps) {
  return (
    <div className={`card ${highlight ? 'bg-gradient-to-br from-nic-green/10 to-transparent' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-nic-lightgray-1 font-nic-body mb-3">{label}</p>
          <p className="text-4xl font-bold text-nic-green font-nic-heading">{value}</p>
          {sublabel && (
            <p className="text-xs text-nic-lightgray-2 font-nic-body mt-3">{sublabel}</p>
          )}
        </div>
        <div className="text-5xl leading-none">{icon}</div>
      </div>
    </div>
  )
}
