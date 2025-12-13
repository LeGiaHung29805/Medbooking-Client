import { Users, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import type { Appointment, Patient, ScheduleDay } from  "@/lib/model"
import { useState } from "react" // THÊM useState nếu cần

interface ScheduleTabProps {
  currentWeek: Date
  setCurrentWeek: (date: Date) => void
  appointments: Appointment[]
  waitingPatients: Patient[]
  handleViewAppointmentDetail: (id: number) => void
  getStatusInfo: (status: string) => any
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
  doctorId?: number
  currentDoctor?: any
}

const ScheduleTab = ({
  currentWeek,
  setCurrentWeek,
  appointments,
  waitingPatients,
  handleViewAppointmentDetail,
  getStatusInfo,
  getPriorityColor,
  getPriorityText,
  doctorId, 
  currentDoctor 
}: ScheduleTabProps) => {
  // Hàm tính thời gian còn lại
  const calculateTimeRemaining = (appointmentTime: string): string => {
    try {
      const now = new Date()
      const apptTime = new Date(appointmentTime)
      
      // Kiểm tra nếu thời gian không hợp lệ
      if (isNaN(apptTime.getTime())) return "giờ không hợp lệ"
      
      const diffMs = apptTime.getTime() - now.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      
      if (diffMins < 0) return "quá hẹn"
      if (diffMins < 60) return `${diffMins} phút`
      
      const diffHours = Math.floor(diffMins / 60)
      return `${diffHours} giờ`
    } catch (error) {
      return "lỗi tính giờ"
    }
  }

  // Hàm lấy khung giờ làm việc
  const getTimeSlotsForDay = (date: Date): string[] => {
    const dayOfWeek = date.getDay()
    
    // Khung giờ mặc định
    const defaultSlots = ["08:00-12:00", "13:30-17:00"]
    
    // Nếu là cuối tuần
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return ["08:00-12:00"] // Chỉ làm buổi sáng cuối tuần
    }
    
    // Có thể lấy từ setting của bác sĩ
    if (currentDoctor?.workingHours) {
      return currentDoctor.workingHours
    }
    
    return defaultSlots
  }

  const getWeekSchedule = (date: Date): ScheduleDay[] => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)

      // Lọc lịch hẹn
      const dayAppointments = appointments.filter(appt => {
        try {
          const apptDate = new Date(appt.appointmentTime)
          
          // Kiểm tra cùng ngày
          const isSameDay = apptDate.toDateString() === day.toDateString()
          
          // Kiểm tra cùng bác sĩ 
          const isSameDoctor = !doctorId || appt.doctorId === doctorId
          
          return isSameDay && isSameDoctor
        } catch (error) {
          console.error("Lỗi xử lý lịch hẹn:", appt, error)
          return false
        }
      })

      return {
        id: i + 1,
        date: day.toISOString().split('T')[0],
        appointments: dayAppointments.length,
        timeSlots: getTimeSlotsForDay(day),
        appointmentsList: dayAppointments
      }
    })
  }

  const currentWeekSchedule = getWeekSchedule(currentWeek)

  // Thêm hàm xử lý lỗi thời gian
  const getSafeAppointmentTime = (appointmentTime: string): string => {
    try {
      const date = new Date(appointmentTime)
      if (isNaN(date.getTime())) return "Giờ không hợp lệ"
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Giờ không hợp lệ"
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6">
      {/* Header với điều hướng tuần */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lịch làm việc của tôi</h2>
          <p className="text-slate-600 mt-1">Quản lý lịch hẹn và thời gian làm việc</p>
          
          {/* Thêm thống kê */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Tổng: {appointments.length} lịch
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Tuần này: {currentWeekSchedule.reduce((sum, day) => sum + day.appointments, 0)}
            </div>
            <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              Hôm nay: {
                appointments.filter(appt => {
                  try {
                    const apptDate = new Date(appt.appointmentTime)
                    return apptDate.toDateString() === new Date().toDateString()
                  } catch {
                    return false
                  }
                }).length
              }
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <button
            onClick={() => {
              const newDate = new Date(currentWeek)
              newDate.setDate(currentWeek.getDate() - 7)
              setCurrentWeek(newDate)
            }}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="text-center">
            <span className="font-semibold text-slate-900 text-lg">
              Tuần {Math.ceil((currentWeek.getDate() + new Date(currentWeek.getFullYear(), currentWeek.getMonth(), 1).getDay()) / 7)}
            </span>
            <p className="text-sm text-slate-600">
              {currentWeekSchedule[0]?.date && new Date(currentWeekSchedule[0].date).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })} -
              {currentWeekSchedule[6]?.date && new Date(currentWeekSchedule[6].date).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          <button
            onClick={() => {
              const newDate = new Date(currentWeek)
              newDate.setDate(currentWeek.getDate() + 7)
              setCurrentWeek(newDate)
            }}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>

          <button
            onClick={() => setCurrentWeek(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
          </button>
        </div>
      </div>

      {/* Chú thích */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Hôm nay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded"></div>
            <span>Cuối tuần</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Đang khám</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span>Đã check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span>Đã hủy</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleTab