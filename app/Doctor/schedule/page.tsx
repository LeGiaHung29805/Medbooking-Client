"use client";

import { useState, useEffect, useCallback } from "react"
import { 
  Calendar, 
  Download, 
  Printer, 
  Filter, 
  RefreshCw, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Users
} from "lucide-react"
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  startOfDay, 
  endOfDay,
  addDays,
  isToday,
  isSameDay,
  parseISO,
  isWeekend,
  getDay,
  getWeek,
  getMonth,
  getYear
} from 'date-fns'
import { vi } from 'date-fns/locale'
import type { Appointment, Patient } from "@/lib/model"

// ==================== MOCK DATA GENERATORS ====================
const generateMockPatients = (): Patient[] => {
  const patients: Patient[] = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      age: 35,
      gender: "male",
      phone: "0912345678",
      symptoms: "Sốt cao, đau đầu, ho khan 3 ngày",
      appointmentTime: "2025-12-10T08:30:00",
      status: "checked_in",
      checkInTime: "08:15",
      priority: "high",
      allergies: ["Penicillin", "Aspirin"],
      medicalHistory: ["Tiểu đường type 2", "Cao huyết áp"]
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      age: 42,
      gender: "female",
      phone: "0923456789",
      symptoms: "Đau bụng, buồn nôn, chóng mặt",
      appointmentTime: "2025-12-10T09:15:00",
      status: "waiting",
      checkInTime: "09:00",
      priority: "medium",
      allergies: ["Cephalosporin"],
      medicalHistory: ["Viêm dạ dày mãn tính"]
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      age: 28,
      gender: "male",
      phone: "0934567890",
      symptoms: "Đau ngực trái, khó thở khi vận động",
      appointmentTime: "2025-12-10T10:00:00",
      status: "in_progress",
      checkInTime: "09:45",
      priority: "emergency",
      allergies: ["Không có"],
      medicalHistory: ["Viêm phế quản cấp"]
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      age: 55,
      gender: "female",
      phone: "0945678901",
      symptoms: "Đau khớp gối, sưng đỏ 1 tuần",
      appointmentTime: "2025-12-11T08:30:00",
      status: "waiting",
      checkInTime: "",
      priority: "low",
      allergies: ["Ibuprofen"],
      medicalHistory: ["Thoái hóa khớp", "Loãng xương"]
    },
    {
      id: 5,
      name: "Hoàng Văn Đức",
      age: 50,
      gender: "male",
      phone: "0956789012",
      symptoms: "Mệt mỏi, chán ăn, vàng da nhẹ",
      appointmentTime: "2025-12-11T09:30:00",
      status: "waiting",
      checkInTime: "",
      priority: "medium",
      allergies: ["Không có"],
      medicalHistory: ["Viêm gan B", "Rối loạn mỡ máu"]
    },
    {
      id: 6,
      name: "Vũ Thị Hương",
      age: 33,
      gender: "female",
      phone: "0967890123",
      symptoms: "Đau họng, nuốt vướng, sốt nhẹ",
      appointmentTime: "2025-12-12T10:15:00",
      status: "waiting",
      checkInTime: "",
      priority: "low",
      allergies: ["Amoxicillin"],
      medicalHistory: ["Viêm họng mãn tính"]
    },
    {
      id: 7,
      name: "Đỗ Văn Hải",
      age: 60,
      gender: "male",
      phone: "0978901234",
      symptoms: "Hoa mắt, chóng mặt, tê bì chân tay",
      appointmentTime: "2025-12-12T11:00:00",
      status: "completed",
      checkInTime: "10:45",
      priority: "high",
      allergies: ["Không có"],
      medicalHistory: ["Tăng huyết áp", "Tiểu đường"]
    },
    {
      id: 8,
      name: "Bùi Thị Kim",
      age: 25,
      gender: "female",
      phone: "0989012345",
      symptoms: "Đau bụng kinh dữ dội",
      appointmentTime: "2025-12-13T08:45:00",
      status: "cancelled",
      checkInTime: "",
      priority: "medium",
      allergies: ["Không có"],
      medicalHistory: ["Rối loạn kinh nguyệt"]
    },
    {
      id: 9,
      name: "Nguyễn Quốc Bảo",
      age: 45,
      gender: "male",
      phone: "0990123456",
      symptoms: "Đau lưng, tê chân trái",
      appointmentTime: "2025-12-13T14:30:00",
      status: "waiting",
      checkInTime: "",
      priority: "low",
      allergies: ["Không có"],
      medicalHistory: ["Thoát vị đĩa đệm"]
    },
    {
      id: 10,
      name: "Trần Văn Đạt",
      age: 38,
      gender: "male",
      phone: "0901234567",
      symptoms: "Mất ngủ, căng thẳng kéo dài",
      appointmentTime: "2025-12-14T15:00:00",
      status: "waiting",
      checkInTime: "",
      priority: "medium",
      allergies: ["Không có"],
      medicalHistory: ["Rối loạn lo âu"]
    }
  ];
  
  return patients;
};

const generateMockAppointments = (patients: Patient[]): Appointment[] => {
  return patients.map(patient => ({
    id: patient.id,
    patientId: patient.id,
    patientName: patient.name,
    patientAge: patient.age,
    patientPhone: patient.phone,
    patientGender: patient.gender,
    symptoms: patient.symptoms,
    appointmentTime: patient.appointmentTime,
    status: patient.status,
    checkInTime: patient.checkInTime,
    appointmentId: patient.id,
    priority: patient.priority,
    serviceName: "Khám tổng quát"
  }));
};

// ==================== COMPONENTS ====================
function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  )
}

function AppointmentDetailModal({
  appointment,
  onClose,
  onStartExam,
}: {
  appointment: Appointment | null
  onClose: () => void
  onStartExam: (id: number) => void
}) {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info")
  const [patientHistory, setPatientHistory] = useState<any[]>([])

  useEffect(() => {
    if (appointment) {
      // Mock patient history
      const mockHistory = [
        {
          id: 1,
          date: "2025-10-15",
          diagnosis: "Viêm họng cấp",
          treatment: "Kháng sinh 5 ngày, nghỉ ngơi",
          prescriptions: [
            { medicine: "Amoxicillin", dosage: "500mg", frequency: "3 lần/ngày" },
            { medicine: "Paracetamol", dosage: "500mg", frequency: "Khi sốt" }
          ]
        },
        {
          id: 2,
          date: "2025-08-22",
          diagnosis: "Rối loạn tiêu hóa",
          treatment: "Men tiêu hóa, ăn uống điều độ",
          prescriptions: [
            { medicine: "Smecta", dosage: "1 gói", frequency: "3 lần/ngày" }
          ]
        }
      ];
      setPatientHistory(mockHistory);
    }
  }, [appointment])

  if (!appointment) return null

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "checked_in":
        return { 
          cls: "bg-green-100 text-green-800 border-green-200", 
          icon: <Clock className="w-4 h-4" />,
          text: "Đã check-in" 
        }
      case "in_progress":
        return { 
          cls: "bg-blue-100 text-blue-800 border-blue-200", 
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: "Đang khám" 
        }
      case "completed":
        return { 
          cls: "bg-gray-100 text-gray-800 border-gray-200", 
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Hoàn thành" 
        }
      case "cancelled":
        return { 
          cls: "bg-red-100 text-red-800 border-red-200", 
          icon: <XCircle className="w-4 h-4" />,
          text: "Đã hủy" 
        }
      default:
        return { 
          cls: "bg-yellow-100 text-yellow-800 border-yellow-200", 
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Chờ" 
        }
    }
  }

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "emergency":
        return { cls: "bg-red-100 text-red-800 border-red-200", text: "🚨 Cấp cứu" }
      case "high":
        return { cls: "bg-orange-100 text-orange-800 border-orange-200", text: "⚠️ Ưu tiên cao" }
      case "medium":
        return { cls: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Ưu tiên trung bình" }
      case "low":
        return { cls: "bg-blue-100 text-blue-800 border-blue-200", text: "Ưu tiên thấp" }
      default:
        return { cls: "bg-gray-100 text-gray-800 border-gray-200", text: "Bình thường" }
    }
  }

  const statusInfo = getStatusInfo(appointment.status)
  const priorityInfo = getPriorityInfo(appointment.priority || "medium")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết lịch hẹn</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "info" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông tin
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "history" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lịch sử khám
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "info" ? (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {appointment.patientName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                  <p className="text-gray-600">
                    {appointment.patientAge} tuổi • {appointment.patientGender === 'male' ? 'Nam' : 'Nữ'}
                  </p>
                  <p className="text-gray-600">📞 {appointment.patientPhone}</p>
                </div>
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${statusInfo.cls}`}>
                    {statusInfo.icon}
                    <span className="font-medium">{statusInfo.text}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Mức độ ưu tiên</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${priorityInfo.cls}`}>
                    <span className="font-medium">{priorityInfo.text}</span>
                  </div>
                </div>
              </div>

              {/* Appointment Time */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Thời gian hẹn</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">
                    {format(parseISO(appointment.appointmentTime), 'EEEE, dd/MM/yyyy', { locale: vi })}
                  </p>
                  <p className="text-gray-600">
                    {format(parseISO(appointment.appointmentTime), 'HH:mm')}
                    {appointment.checkInTime && ` • Check-in: ${appointment.checkInTime}`}
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Triệu chứng/Lý do khám</p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-800">{appointment.symptoms}</p>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Dịch vụ</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">{appointment.serviceName || "Khám tổng quát"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {patientHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chưa có lịch sử khám</p>
                </div>
              ) : (
                patientHistory.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">{record.diagnosis}</span>
                      <span className="text-sm text-gray-500">
                        {format(parseISO(record.date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{record.treatment}</p>
                    {record.prescriptions?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Đơn thuốc:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {record.prescriptions.map((p: any, idx: number) => (
                            <li key={idx} className="flex gap-2">
                              <span>• {p.medicine}</span>
                              <span className="text-gray-500">({p.dosage} - {p.frequency})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          {(appointment.status === "checked_in" || appointment.status === "waiting") && (
            <button
              onClick={() => {
                onStartExam(appointment.id)
                onClose()
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              Bắt đầu khám
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function SchedulePage() {
  // ==================== STATES ====================
  const [loading, setLoading] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [actionType, setActionType] = useState<"refresh" | "export" | "print" | "">("")

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    const mockPatients = generateMockPatients()
    setPatients(mockPatients)
    
    const mockAppointments = generateMockAppointments(mockPatients)
    setAppointments(mockAppointments)
    setFilteredAppointments(mockAppointments)
  }, [])

  // ==================== FILTERING ====================
  useEffect(() => {
    let filtered = [...appointments]
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(appt => appt.status === filterStatus)
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(appt => 
        appt.patientName.toLowerCase().includes(term) ||
        appt.patientPhone.includes(term) ||
        appt.symptoms.toLowerCase().includes(term)
      )
    }
    
    // Filter by date based on view mode
    filtered = filtered.filter(appt => {
      const apptDate = parseISO(appt.appointmentTime)
      
      if (viewMode === "day") {
        return isSameDay(apptDate, currentWeek)
      } else if (viewMode === "week") {
        const weekStart = startOfWeek(currentWeek, { locale: vi })
        const weekEnd = endOfWeek(currentWeek, { locale: vi })
        return apptDate >= weekStart && apptDate <= weekEnd
      } else {
        // month view
        return (
          getMonth(apptDate) === getMonth(currentWeek) &&
          getYear(apptDate) === getYear(currentWeek)
        )
      }
    })
    
    // Sort by appointment time
    filtered.sort((a, b) => 
      parseISO(a.appointmentTime).getTime() - parseISO(b.appointmentTime).getTime()
    )
    
    setFilteredAppointments(filtered)
  }, [appointments, filterStatus, searchTerm, viewMode, currentWeek])

  // ==================== EVENT HANDLERS ====================
  const handlePreviousWeek = () => {
    if (viewMode === "day") {
      setCurrentWeek(prev => addDays(prev, -1))
    } else if (viewMode === "week") {
      setCurrentWeek(prev => subWeeks(prev, 1))
    } else {
      // month
      const newDate = new Date(currentWeek)
      newDate.setMonth(newDate.getMonth() - 1)
      setCurrentWeek(newDate)
    }
  }

  const handleNextWeek = () => {
    if (viewMode === "day") {
      setCurrentWeek(prev => addDays(prev, 1))
    } else if (viewMode === "week") {
      setCurrentWeek(prev => addWeeks(prev, 1))
    } else {
      // month
      const newDate = new Date(currentWeek)
      newDate.setMonth(newDate.getMonth() + 1)
      setCurrentWeek(newDate)
    }
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
  }

  const handleRefresh = () => {
    setActionType("refresh")
    setShowConfirmation(true)
  }

  const handlePrint = () => {
    setActionType("print")
    setShowConfirmation(true)
  }

  const handleExport = () => {
    setActionType("export")
    setShowConfirmation(true)
  }

  const confirmAction = () => {
    setLoading(true)
    
    setTimeout(() => {
      switch (actionType) {
        case "refresh":
          // Simulate refresh
          const refreshedPatients = generateMockPatients()
          const refreshedAppointments = generateMockAppointments(refreshedPatients)
          setPatients(refreshedPatients)
          setAppointments(refreshedAppointments)
          break
          
        case "print":
          window.print()
          break
          
        case "export":
          exportToJSON()
          break
      }
      
      setLoading(false)
      setShowConfirmation(false)
      setActionType("")
    }, 1000)
  }

  const handleViewAppointmentDetail = (id: number) => {
    const appointment = appointments.find(a => a.id === id)
    if (appointment) {
      setSelectedAppointment(appointment)
      setShowDetailModal(true)
    }
  }

  const handleStartExam = (id: number) => {
    setAppointments(prev => 
      prev.map(appt => 
        appt.id === id 
          ? { ...appt, status: "in_progress" as const }
          : appt
      )
    )
  }

  // ==================== HELPER FUNCTIONS ====================
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "checked_in":
        return { 
          cls: "bg-green-100 text-green-800 border-green-200", 
          icon: <Clock className="w-4 h-4" />,
          text: "Đã check-in",
          bg: "bg-green-50"
        }
      case "in_progress":
        return { 
          cls: "bg-blue-100 text-blue-800 border-blue-200", 
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: "Đang khám",
          bg: "bg-blue-50"
        }
      case "completed":
        return { 
          cls: "bg-gray-100 text-gray-800 border-gray-200", 
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Hoàn thành",
          bg: "bg-gray-50"
        }
      case "cancelled":
        return { 
          cls: "bg-red-100 text-red-800 border-red-200", 
          icon: <XCircle className="w-4 h-4" />,
          text: "Đã hủy",
          bg: "bg-red-50"
        }
      default:
        return { 
          cls: "bg-yellow-100 text-yellow-800 border-yellow-200", 
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Chờ",
          bg: "bg-yellow-50"
        }
    }
  }

  const getPriorityInfo = (priority?: string) => {
    switch (priority) {
      case "emergency":
        return { cls: "bg-red-100 text-red-800", text: "🚨 Cấp cứu" }
      case "high":
        return { cls: "bg-orange-100 text-orange-800", text: "⚠️ Ưu tiên cao" }
      case "medium":
        return { cls: "bg-yellow-100 text-yellow-800", text: "Ưu tiên trung" }
      case "low":
        return { cls: "bg-blue-100 text-blue-800", text: "Ưu tiên thấp" }
      default:
        return { cls: "bg-gray-100 text-gray-800", text: "Bình thường" }
    }
  }

  const exportToJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      viewMode,
      currentDate: currentWeek.toISOString(),
      totalAppointments: filteredAppointments.length,
      appointments: filteredAppointments.map(appt => ({
        id: appt.id,
        patient: appt.patientName,
        age: appt.patientAge,
        phone: appt.patientPhone,
        symptoms: appt.symptoms,
        appointmentTime: appt.appointmentTime,
        status: appt.status,
        service: appt.serviceName
      }))
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lich-lam-viec-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDateRangeText = () => {
    if (viewMode === "day") {
      return format(currentWeek, "EEEE, dd/MM/yyyy", { locale: vi })
    } else if (viewMode === "week") {
      const start = startOfWeek(currentWeek, { locale: vi })
      const end = endOfWeek(currentWeek, { locale: vi })
      return `${format(start, 'dd/MM')} - ${format(end, 'dd/MM/yyyy')}`
    } else {
      return format(currentWeek, "MMMM yyyy", { locale: vi })
    }
  }

  // ==================== RENDER ====================
  if (loading && appointments.length === 0) {
    return <LoadingState message="Đang tải lịch làm việc..." />
  }

  const stats = {
    total: filteredAppointments.length,
    checkedIn: filteredAppointments.filter(a => a.status === "checked_in").length,
    inProgress: filteredAppointments.filter(a => a.status === "in_progress").length,
    waiting: filteredAppointments.filter(a => a.status === "waiting").length,
    completed: filteredAppointments.filter(a => a.status === "completed").length,
    cancelled: filteredAppointments.filter(a => a.status === "cancelled").length
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              Lịch làm việc
            </h1>
            <p className="text-gray-600 mt-2">Quản lý và theo dõi lịch hẹn bệnh nhân</p>

            <div className="mt-4 flex items-center gap-4">
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <span className="font-semibold text-gray-800">
                  {viewMode === "day" ? "Ngày" : viewMode === "week" ? "Tuần" : "Tháng"}: {getDateRangeText()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{filteredAppointments.length} lịch hẹn</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Đang xử lý..." : "Làm mới"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <Printer className="w-5 h-5" />
              In lịch
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              Xuất file
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-4">
          {/* View Mode */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {[
              { mode: "day", label: "Ngày" },
              { mode: "week", label: "Tuần" },
              { mode: "month", label: "Tháng" }
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode as any)
                  if (mode === "day") setCurrentWeek(new Date())
                }}
                className={`px-4 py-2 transition-colors ${
                  viewMode === mode 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm bệnh nhân, SĐT, triệu chứng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="waiting">Đang chờ</option>
              <option value="checked_in">Đã check-in</option>
              <option value="in_progress">Đang khám</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tuần này
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Tổng lịch hẹn</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.waiting}</div>
          <div className="text-sm text-gray-600">Đang chờ</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
          <div className="text-sm text-gray-600">Đã check-in</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">Đang khám</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Đã hoàn thành</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Đã hủy</div>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">Không có lịch hẹn nào</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm ? "Thử tìm kiếm với từ khóa khác" : 
               viewMode === "day" ? "Hôm nay" : viewMode === "week" ? "Tuần này" : "Tháng này"} chưa có lịch hẹn
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const statusInfo = getStatusInfo(appointment.status)
              const priorityInfo = getPriorityInfo(appointment.priority)
              const apptDate = parseISO(appointment.appointmentTime)
              
              return (
                <div
                  key={`appointment-${appointment.id}`}
                  className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-all cursor-pointer border"
                  style={{ 
                    background: statusInfo.bg,
                    borderColor: statusInfo.cls.split(' ')[1].replace('border-', '')
                  }}
                  onClick={() => handleViewAppointmentDetail(appointment.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Time */}
                    <div className="flex flex-col items-center min-w-[80px]">
                      <div className="text-2xl font-bold text-gray-900">
                        {format(apptDate, 'HH:mm')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(apptDate, 'dd/MM')}
                      </div>
                    </div>
                    
                    {/* Patient Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {appointment.patientName.charAt(0)}
                    </div>
                    
                    {/* Patient Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {appointment.patientName}
                        </h4>
                        <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                          {appointment.patientAge} tuổi
                        </span>
                        {priorityInfo && (
                          <span className={`text-xs px-2 py-1 rounded ${priorityInfo.cls}`}>
                            {priorityInfo.text}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        📞 {appointment.patientPhone}
                      </p>
                      
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium">Triệu chứng:</span> {appointment.symptoms}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${statusInfo.cls}`}>
                      {statusInfo.icon}
                      <span className="font-medium">{statusInfo.text}</span>
                    </div>
                    
                    {(appointment.status === "checked_in" || appointment.status === "waiting") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartExam(appointment.id);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Bắt đầu khám
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAppointmentDetail(appointment.id);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Chi tiết</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Chú thích trạng thái</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { status: "waiting", text: "Đang chờ" },
            { status: "checked_in", text: "Đã check-in" },
            { status: "in_progress", text: "Đang khám" },
            { status: "completed", text: "Đã hoàn thành" },
            { status: "cancelled", text: "Đã hủy" },
          ].map((item) => {
            const info = getStatusInfo(item.status)
            return (
              <div key={item.status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${info.cls.split(' ')[0]}`}></div>
                <span className="text-sm text-gray-600">{item.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === "refresh" && "Làm mới dữ liệu"}
              {actionType === "print" && "In lịch làm việc"}
              {actionType === "export" && "Xuất file dữ liệu"}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {actionType === "refresh" && "Bạn có chắc muốn làm mới dữ liệu? Dữ liệu hiện tại sẽ được cập nhật."}
              {actionType === "print" && "Bạn có chắc muốn in lịch làm việc hiện tại?"}
              {actionType === "export" && `Bạn có chắc muốn xuất ${filteredAppointments.length} lịch hẹn ra file JSON?`}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false)
                  setActionType("")
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedAppointment(null)
          }}
          onStartExam={handleStartExam}
        />
      )}
    </div>
  )
}