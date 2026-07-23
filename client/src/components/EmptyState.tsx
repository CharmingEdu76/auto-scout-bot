interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
}

export default function EmptyState({ icon = '📭', title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-nic-heading font-bold text-nic-gray mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-nic-lightgray-2 font-nic-body max-w-md mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
