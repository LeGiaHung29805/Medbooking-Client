import { Users, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import type { Appointment, Patient, ScheduleDay } from  "@/lib/model"

interface ScheduleTabProps {
  currentWeek: Date
  setCurrentWeek: (date: Date) => void
  appointments: Appointment[]
  waitingPatients: Patient[]
  handleViewAppointmentDetail: (id: number) => void
  getStatusInfo: (status: string) => any
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
}

const ScheduleTab = ({
  currentWeek,
  setCurrentWeek,
  appointments,
  waitingPatients,
  handleViewAppointmentDetail,
  getStatusInfo,
  getPriorityColor,
  getPriorityText
}: ScheduleTabProps) => {
  const getWeekSchedule = (date: Date): ScheduleDay[] => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)

      const dayAppointments = appointments.filter(appt => {
        const apptDate = new Date(appt.appointmentTime).toDateString()
        return apptDate === day.toDateString()
      })

      return {
        id: i + 1,
        date: day.toISOString().split('T')[0],
        appointments: dayAppointments.length,
        timeSlots: ["08:00-12:00", "13:30-17:00"],
        appointmentsList: dayAppointments
      }
    })
  }

  const currentWeekSchedule = getWeekSchedule(currentWeek)

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6">
      {/* Header với điều hướng tuần */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lịch làm việc của tôi</h2>
          <p className="text-slate-600 mt-1">Quản lý lịch hẹn và thời gian làm việc</p>
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
            Hôm nay
          </button>
        </div>
      </div>

      {/* Lịch tuần - 7 cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {currentWeekSchedule.map((day, index) => {
          const isToday = new Date(day.date).toDateString() === new Date().toDateString()
          const isWeekend = index === 0 || index === 6

          return (
            <div
              key={day.id}
              className={`
                border rounded-xl p-4 min-h-[280px] transition-all duration-200
                ${isToday
                  ? 'bg-blue-50 border-blue-300 shadow-md transform scale-105'
                  : 'border-slate-200 hover:shadow-md hover:border-slate-300'
                }
                ${isWeekend ? 'bg-orange-50 border-orange-200' : ''}
              `}
            >
              {/* Header ngày */}
              <div className="text-center mb-4">
                <div className={`
                  text-sm font-semibold mb-1
                  ${isToday ? 'text-blue-800' : 'text-slate-700'}
                  ${isWeekend ? 'text-orange-700' : ''}
                `}>
                  {new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                </div>
                <div className={`
                  text-2xl font-bold
                  ${isToday ? 'text-blue-600' : 'text-slate-900'}
                  ${isWeekend ? 'text-orange-600' : ''}
                `}>
                  {new Date(day.date).getDate()}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date(day.date).toLocaleDateString('vi-VN', { month: 'short' })}
                </div>
              </div>

              {/* Thống kê */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                  <Users className="w-3 h-3 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {day.appointments} lịch hẹn
                  </span>
                </div>
              </div>

              {/* Khung giờ làm việc */}
              <div className="space-y-2 mb-4">
                {day.timeSlots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{slot}</span>
                  </div>
                ))}
              </div>

              {/* Danh sách lịch hẹn */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {day.appointmentsList.length > 0 ? (
                  day.appointmentsList.map(appointment => {
                    const fullPatient = waitingPatients.find(p => p.id === appointment.id)
                    const statusInfo = getStatusInfo(appointment.status)

                    return (
                      <div
                        key={appointment.id}
                        className={`
                          p-3 text-sm border rounded-lg cursor-pointer transition-all
                          ${appointment.status === 'in_progress'
                            ? 'bg-blue-100 border-blue-300 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                          }
                          ${appointment.status === 'checked_in' ? 'bg-green-50 border-green-200' : ''}
                        `}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewAppointmentDetail(appointment.id)
                        }}
                      >
                        <div className="font-semibold text-slate-900 truncate">
                          {appointment.patientName}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          {new Date(appointment.appointmentTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.cls}`}>
                            {statusInfo.icon}
                            <span className="text-xs">{statusInfo.text}</span>
                          </div>

                          {fullPatient && fullPatient.priority !== 'low' && (
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getPriorityColor(fullPatient.priority)}`}>
                              {getPriorityText(fullPatient.priority)}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6 text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Không có lịch hẹn</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
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
        </div>
      </div>
    </div>
  )
}

export default ScheduleTab