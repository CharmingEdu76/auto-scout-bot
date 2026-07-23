export default function Spinner({ label = 'Lädt…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
