import { Users, CheckCircle2, Clock, User } from "lucide-react"
import Stat from "./Stat"

interface DashboardStatsProps {
  stats: {
    totalAppointments: number
    completed: number
    waiting: number
    inProgress: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: "Tổng số lịch hẹn",
      value: stats.totalAppointments,
      icon: <Users />,
      colorFrom: "#60A5FA",
      colorTo: "#34D399"
    },
    {
      label: "Đã khám xong",
      value: stats.completed,
      icon: <CheckCircle2 />,
      colorFrom: "#34D399",
      colorTo: "#10B981",
    },
    {
      label: "Đang chờ",
      value: stats.waiting,
      icon: <Clock />,
      colorFrom: "#FDBA74",
      colorTo: "#FB923C",
    },
    {
      label: "Đang khám",
      value: stats.inProgress,
      icon: <User className="w-5 h-5" />,
      colorFrom: "#F59E0B",
      colorTo: "#D97706"
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat, i) => (
        <Stat key={i} {...stat} />
      ))}
    </section>
  )
}