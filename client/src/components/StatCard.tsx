import type { ReactNode } from 'react'
import Icon from './Icon'

interface StatCardProps {
  label: string
  value: ReactNode
  icon: string
  sublabel?: string
  accent?: boolean
}

export default function StatCard({ label, value, icon, sublabel, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            accent ? 'bg-brand/10 text-brand-dark' : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-semibold text-gray-900">{value}</div>
      {sublabel && <p className="mt-1 text-sm text-gray-400">{sublabel}</p>}
    </div>
  )
}
