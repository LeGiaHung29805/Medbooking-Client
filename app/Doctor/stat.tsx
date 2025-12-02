import type React from "react"

function stat({
  label,
  value,
  icon,
  colorFrom = "#60A5FA",
  colorTo = "#34D399",
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  colorFrom?: string
  colorTo?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-semibold text-slate-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default stat