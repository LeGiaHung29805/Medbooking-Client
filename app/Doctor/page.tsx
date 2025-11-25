"use client"
import { useState, useMemo, useEffect } from "react"
import type React from "react"
import Image from "next/image"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  LayoutDashboard,
  Settings,
  Calendar,
  User,
  FileText,
  Stethoscope,
  Heart,
  Activity,
  AlertTriangle,
} from "lucide-react"

// ===============================================
// INTERFACE MỚI CHO DOCTOR DASHBOARD
// ===============================================

interface Appointment {
  id: number
  patientName: string
  patientAge: number
  patientPhone: string
  symptoms: string
  appointmentTime: string
  status: "waiting" | "in_progress" | "completed" | "cancelled" | "checked_in"
  checkInTime: string
}

interface Patient {
  id: number
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  symptoms: string
  appointmentTime: string
  status: "waiting" | "in_progress" | "completed" | "checked_in"
  checkInTime: string
  priority: 'low' | 'medium' | 'high' | 'emergency'
  allergies: string[]
  medicalHistory: string[]
}

interface MedicalRecord {
  id: number
  patientName: string
  age: number
  diagnosis: string
  treatment: string
  prescriptions: Prescription[]
  tests: string[]
  date: string
  status: "completed" | "pending"
}

interface PatientDetail {
  id: number
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  symptoms: string
  appointmentTime: string
  allergies: string[]
  medicalHistory: string[]
  priority: 'low' | 'medium' | 'high' | 'emergency' 
  vitalSigns?: VitalSigns
  medicalRecords: MedicalRecord[]
}

interface VitalSigns {
  bloodPressure: string
  heartRate: number
  temperature: number
  respiratoryRate: number
  spO2: number
  weight: number
  height: number
}

interface MedicalExamFormData {
  diagnosis: string
  clinicalNotes: string
  currentSymptoms: string
  prescriptions: Prescription[]
  tests: string[]
  attachments: File[]
  vitalSigns: VitalSigns
}

interface Prescription {
  medicine: string
  dosage: string
  frequency: string
}

interface ScheduleDay {
  id: number
  date: string
  appointments: number
  timeSlots: string[]
  appointmentsList: Appointment[]
}

// ===============================================
// COMPONENT CHÍNH - DOCTOR DASHBOARD
// ===============================================

export default function DoctorDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"dashboard" | "schedule" | "records" | "settings">("dashboard")
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showExamForm, setShowExamForm] = useState(false)
  const [currentExamPatient, setCurrentExamPatient] = useState<PatientDetail | null>(null)
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: ""
  })

  const [currentDoctor, setCurrentDoctor] = useState<any>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([])
  
  const itemsPerPage = 6

  // ===============================================
  // MOCK DATA CHO DOCTOR DASHBOARD
  // ===============================================

  useEffect(() => {
    const loadDoctorData = () => {
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          const doctor = JSON.parse(userData)
          setCurrentDoctor(doctor)
          setDoctorInfo({
            name: doctor.name || '',
            specialty: doctor.specialty || '',
            email: doctor.email || '',
            phone: doctor.phone || ''
          })
        }
      } catch (error) {
        console.error('Lỗi khi load dữ liệu bác sĩ:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDoctorData()
  }, [])

  const getPersonalizedMockData = () => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        patientName: "Nguyễn Văn An",
        patientAge: 35,
        patientPhone: "0901234567",
        symptoms: "Đau đầu, chóng mặt, buồn nôn",
        appointmentTime: "2024-01-15 09:00",
        status: "checked_in",
        checkInTime: "08:45"
      },
      {
        id: 2,
        patientName: "Trần Thị Bình",
        patientAge: 42,
        patientPhone: "0901234568",
        symptoms: "Đau bụng, buồn nôn, sốt nhẹ",
        appointmentTime: "2024-01-15 09:30",
        status: "checked_in",
        checkInTime: "09:15"
      },
      {
        id: 3,
        patientName: "Lê Văn Cường",
        patientAge: 28,
        patientPhone: "0901234569",
        symptoms: "Ho khan, đau họng, khó thở",
        appointmentTime: "2024-01-15 10:00",
        status: "in_progress",
        checkInTime: "09:50"
      },
      {
        id: 4,
        patientName: "Phạm Thị Dung",
        patientAge: 65,
        patientPhone: "0901234570",
        symptoms: "Đau khớp gối, tê bì chân tay",
        appointmentTime: "2024-01-15 10:30",
        status: "checked_in",
        checkInTime: "10:20"
      },
      {
        id: 5,
        patientName: "Hoàng Văn Đức",
        patientAge: 50,
        patientPhone: "0901234571",
        symptoms: "Huyết áp cao, chóng mặt",
        appointmentTime: "2024-01-15 11:00",
        status: "checked_in",
        checkInTime: "10:45"
      },
      {
        id: 6,
        patientName: "Vũ Thị Hà",
        patientAge: 32,
        patientPhone: "0901234572",
        symptoms: "Khám thai định kỳ",
        appointmentTime: "2024-01-15 11:30",
        status: "waiting",
        checkInTime: "11:15"
      }
    ]

    const mockWaitingPatients: Patient[] = [
      {
        id: 1,
        name: "Nguyễn Văn An",
        age: 35,
        gender: 'male' as const,
        phone: "0901234567",
        symptoms: "Đau đầu, chóng mặt, buồn nôn",
        appointmentTime: "09:00",
        status: "checked_in" as const,
        checkInTime: "08:45",
        priority: 'medium' as const,
        allergies: ["Penicillin"],
        medicalHistory: ["Tăng huyết áp", "Tiểu đường"]
      },
      {
        id: 2,
        name: "Trần Thị Bình",
        age: 42,
        gender: 'female' as const,
        phone: "0901234568",
        symptoms: "Đau bụng, buồn nôn, sốt nhẹ",
        appointmentTime: "09:30",
        status: "checked_in" as const,
        checkInTime: "09:15",
        priority: 'low' as const,
        allergies: [],
        medicalHistory: ["Viêm dạ dày"]
      },
      {
        id: 3,
        name: "Lê Văn Cường",
        age: 28,
        gender: 'male' as const,
        phone: "0901234569",
        symptoms: "Ho khan, đau họng, khó thở",
        appointmentTime: "10:00",
        status: "checked_in" as const,
        checkInTime: "09:50",
        priority: 'high' as const,
        allergies: ["Aspirin"],
        medicalHistory: ["Hen suyễn"]
      },
      {
        id: 4,
        name: "Phạm Thị Dung",
        age: 65,
        gender: 'female' as const,
        phone: "0901234570",
        symptoms: "Đau khớp gối, tê bì chân tay",
        appointmentTime: "10:30",
        status: "waiting" as const,
        checkInTime: "10:20",
        priority: 'emergency' as const,
        allergies: ["Codeine"],
        medicalHistory: ["Thoái hóa khớp", "Tiểu đường type 2"]
      }
    ]

    const mockMedicalRecords: MedicalRecord[] = [
      {
        id: 1,
        patientName: "Nguyễn Thị Hồng",
        age: 40,
        diagnosis: "Viêm phế quản cấp",
        treatment: "Kháng sinh, giảm ho, hạ sốt",
        prescriptions: [
          { medicine: "Amoxicillin", dosage: "500mg", frequency: "3 lần/ngày" },
          { medicine: "Paracetamol", dosage: "500mg", frequency: "Khi sốt" }
        ],
        tests: ["X-Quang phổi", "Xét nghiệm máu"],
        date: "2024-01-14",
        status: "completed"
      }
    ]

    return {
      stats: {
        totalAppointments: mockAppointments.length,
        completed: mockAppointments.filter(a => a.status === "completed").length,
        waiting: mockAppointments.filter(a => a.status === "waiting" || a.status === "checked_in").length,
        inProgress: mockAppointments.filter(a => a.status === "in_progress").length,
        upcoming: 10,
        monthlyPatients: 245,
        satisfactionRate: 96
      },
      waitingPatients: mockWaitingPatients,
      appointments: mockAppointments,
      medicalRecords: mockMedicalRecords
    }
  }

  // Khởi tạo dữ liệu
  useEffect(() => {
    const mockData = getPersonalizedMockData()
    setAppointments(mockData.appointments)
    setWaitingPatients(mockData.waitingPatients)
    setMedicalRecords(mockData.medicalRecords)
  }, [])

  const MOCK_STATS = getPersonalizedMockData().stats

  const handleInputChange = (field: string, value: string) => {
    setDoctorInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = () => {
    const updatedDoctor = {
      ...currentDoctor,
      ...doctorInfo
    }
    
    setCurrentDoctor(updatedDoctor)
    localStorage.setItem('user', JSON.stringify(updatedDoctor))
    alert("Đã lưu thay đổi thành công!")
  }

  const filteredAppointments = useMemo(() => {
    let filtered = appointments

    if (statusFilter !== "all") {
      filtered = filtered.filter((appt) => appt.status === statusFilter)
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter((appt) =>
        appt.patientName.toLowerCase().includes(query) ||
        appt.symptoms.toLowerCase().includes(query) ||
        appt.patientPhone.includes(query)
      )
    }

    return filtered
  }, [searchTerm, statusFilter, appointments])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // ===============================================
  // HANDLER FUNCTIONS
  // ===============================================

const updateAppointmentStatus = (appointmentId: number, newStatus: Appointment['status']) => {
  setAppointments(prev => 
    prev.map(appt => 
      appt.id === appointmentId ? { ...appt, status: newStatus } : appt
    )
  )
  
  setWaitingPatients(prev =>
    prev.map(patient =>
      patient.id === appointmentId ? { ...patient, status: newStatus as Patient['status'] } : patient
    )
  )
}

  const handleStartExam = (patient: PatientDetail) => {
  setShowPatientModal(false)
  setCurrentExamPatient(patient)
  setShowExamForm(true)
  updateAppointmentStatus(patient.id, 'in_progress')

   // Lưu thông tin bệnh nhân đang khám vào localStorage để hiển thị thanh cố định ở góc trên bên phải
  const currentExamining = {
    id: patient.id,
    name: patient.name,
    startTime: new Date().toISOString()
  }
  localStorage.setItem('currentExamining', JSON.stringify(currentExamining))
}


  const handleCompleteExam = (formData: MedicalExamFormData) => {
  if (!currentExamPatient) return

  // Tạo bệnh án mới
  const newMedicalRecord: MedicalRecord = {
    id: medicalRecords.length + 1,
    patientName: currentExamPatient.name,
    age: currentExamPatient.age,
    diagnosis: formData.diagnosis,
    treatment: formData.clinicalNotes,
    prescriptions: formData.prescriptions,
    tests: formData.tests.filter(test => test.trim() !== ''),
    date: new Date().toISOString().split('T')[0],
    status: "completed"
  }

  // Lưu bệnh án
  setMedicalRecords(prev => [...prev, newMedicalRecord])
  
  // Cập nhật trạng thái lịch hẹn
  updateAppointmentStatus(currentExamPatient.id, 'completed')

  // Xóa thông tin đang khám khỏi localStorage
  localStorage.removeItem('currentExamining')

  setShowExamForm(false)
  setCurrentExamPatient(null)
  
  // Tạo PDF đơn thuốc
  generatePrescriptionPDF(newMedicalRecord)
  
  alert("Đã hoàn tất khám và lưu bệnh án!")
}

  const generatePrescriptionPDF = (record: MedicalRecord) => {
    // Trong thực tế, bạn sẽ sử dụng thư viện như jsPDF hoặc gọi API
    const prescriptionText = `
      ĐƠN THUỐC
      
      Bệnh nhân: ${record.patientName}
      Tuổi: ${record.age}
      Chẩn đoán: ${record.diagnosis}
      
      ĐƠN THUỐC:
      ${record.prescriptions.map(p => 
        `- ${p.medicine}: ${p.dosage} - ${p.frequency}`
      ).join('\n')}
      
      Ngày kê đơn: ${record.date}
      Bác sĩ: ${currentDoctor?.name || 'Bs. Nguyễn Văn A'}
    `
    
    // Tạo file PDF (mock)
    const blob = new Blob([prescriptionText], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Don-thuoc-${record.patientName}-${record.date}.pdf`
    a.click()
    
    console.log('Đã tạo PDF đơn thuốc:', record)
  }

  const handleViewAppointmentDetail = (appointmentId: number) => {
    const appointment = appointments.find(appt => appt.id === appointmentId)
    if (appointment) {
      const fullPatient = waitingPatients.find(p => p.id === appointmentId)
      
      const patientDetail: PatientDetail = {
        id: appointment.id,
        name: appointment.patientName,
        age: appointment.patientAge,
        gender: fullPatient?.gender || 'other',
        phone: appointment.patientPhone,
        symptoms: appointment.symptoms,
        appointmentTime: appointment.appointmentTime,
        allergies: fullPatient?.allergies || [],
        medicalHistory: fullPatient?.medicalHistory || [],
        priority: fullPatient?.priority || 'medium',
        medicalRecords: medicalRecords.filter(r => r.patientName === appointment.patientName)
      }
      setSelectedPatient(patientDetail)
      setShowPatientModal(true)
    }
  }

  const handleViewPatientDetail = (patientId: number) => {
    const patient = waitingPatients.find(p => p.id === patientId)
    const history = medicalRecords.filter(r => r.patientName === patient?.name)
    
    if (patient) {
      const patientDetail: PatientDetail = {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        symptoms: patient.symptoms,
        appointmentTime: patient.appointmentTime,
        allergies: patient.allergies,
        medicalHistory: patient.medicalHistory,
        priority: patient.priority,
        medicalRecords: history
      }
      setSelectedPatient(patientDetail)
      setShowPatientModal(true)
    }
  }

  const handleViewMedicalRecord = (recordId: number) => {
    const record = medicalRecords.find(rec => rec.id === recordId)
    if (record) {
      alert(`Bệnh án: ${record.patientName}\nChẩn đoán: ${record.diagnosis}\nĐiều trị: ${record.treatment}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "waiting":
        return {
          text: "Đang chờ",
          cls: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="w-4 h-4 text-amber-500" />,
        }
      case "in_progress":
        return {
          text: "Đang khám",
          cls: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <User className="w-4 h-4 text-blue-500" />,
        }
      case "completed":
        return {
          text: "Đã hoàn thành",
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        }
      case "checked_in":
        return {
          text: "Đã check-in",
          cls: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
        }
      default:
        return { text: "", cls: "", icon: null }
    }
  }

  const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'emergency': 
      return 'bg-red-100 text-red-800 border-red-300 shadow-sm'
    case 'high': 
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'medium': 
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'low': 
      return 'bg-green-100 text-green-800 border-green-300'
    default: 
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

  const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'emergency': return '🚨 CẤP CỨU'
    case 'high': return '⚠️ ƯU TIÊN CAO'
    case 'medium': return '🟡 TRUNG BÌNH'
    case 'low': return '🟢 THẤP'
    default: return '⚪ KHÔNG XÁC ĐỊNH'
  }
}

  // Hàm lấy lịch tuần
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

   useEffect(() => {
    const mockData = getPersonalizedMockData()
    setAppointments(mockData.appointments)
    setWaitingPatients(mockData.waitingPatients)
    setMedicalRecords(mockData.medicalRecords)
  }, [])

  // ==================== THÊM VÀO ĐÂY ====================
  // Khôi phục trạng thái đang khám khi refresh trang
  useEffect(() => {
    const currentExamining = localStorage.getItem('currentExamining')
    if (currentExamining) {
      try {
        const examiningData = JSON.parse(currentExamining)
        const patient = waitingPatients.find(p => p.id === examiningData.id)
        if (patient) {
          const patientDetail: PatientDetail = {
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
            symptoms: patient.symptoms,
            appointmentTime: patient.appointmentTime,
            allergies: patient.allergies,
            medicalHistory: patient.medicalHistory,
            priority: patient.priority,
            medicalRecords: medicalRecords.filter(r => r.patientName === patient.name)
          }
          setCurrentExamPatient(patientDetail)
          updateAppointmentStatus(patient.id, 'in_progress')
        }
      } catch (error) {
        console.error('Lỗi khi khôi phục trạng thái đang khám:', error)
      }
    }
  }, [waitingPatients, medicalRecords])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (!currentDoctor && !loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin bác sĩ</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F7FF] via-[#F3F9F1] to-[#F6F0FF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className={`col-span-12 md:col-span-3 lg:col-span-2 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}>
          <div className="bg-white rounded-2xl shadow-md border p-4 h-fit sticky top-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold">
                  BS
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Bs. {currentDoctor?.name || 'Nguyễn Văn A'}</h3>
                  <p className="text-xs text-slate-500">{currentDoctor?.specialty || 'Bác sĩ'}</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Menu className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <nav className="space-y-2">
              {[
                { icon: LayoutDashboard, label: "Bảng điều khiển", value: "dashboard" },
                { icon: Calendar, label: "Lịch của tôi", value: "schedule" },
                { icon: FileText, label: "Bệnh án", value: "records" },
                { icon: Settings, label: "Cài đặt", value: "settings" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === item.value 
                      ? "bg-blue-50 text-blue-600" 
                      : "hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-medium text-rose-600">Đăng xuất</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <header className="mb-6 transition-opacity duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {activeTab === "dashboard" ? "Bảng điều khiển" : 
                   activeTab === "schedule" ? "Lịch của tôi" :
                   activeTab === "records" ? "Quản lý bệnh án" : "Cài đặt"}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
  {activeTab === "dashboard" 
    ? `Chào mừng bác sĩ ${currentDoctor?.name || ''} - Quản lý lịch khám và bệnh nhân` 
    : activeTab === "schedule" ? "Lịch làm việc và quản lý cuộc hẹn" :
    activeTab === "records" ? "Xem và quản lý hồ sơ bệnh án" : "Cài đặt tài khoản và hệ thống"
  }
</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-600">Hôm nay</p>
                <p className="font-semibold text-slate-900">{new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'numeric', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </header>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats row */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { 
                    label: "Tổng số lịch hẹn", 
                    value: MOCK_STATS.totalAppointments, 
                    icon: <Users />, 
                    colorFrom: "#60A5FA", 
                    colorTo: "#34D399" 
                  },
                  {
                    label: "Đã khám xong",
                    value: MOCK_STATS.completed,
                    icon: <CheckCircle2 />,
                    colorFrom: "#34D399",
                    colorTo: "#10B981",
                  },
                  {
                    label: "Đang chờ",
                    value: MOCK_STATS.waiting,
                    icon: <Clock />,
                    colorFrom: "#FDBA74",
                    colorTo: "#FB923C",
                  },
                  {
                    label: "Đang khám",
                    value: MOCK_STATS.inProgress,
                    icon: <User className="w-5 h-5" />,
                    colorFrom: "#F59E0B",
                    colorTo: "#D97706"
                  },
                ].map((stat, i) => (
                  <Stat key={i} {...stat} />
                ))}
              </section>

              {/* Khu vực ĐANG KHÁM */}
<div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border-2 border-blue-300 p-4 mb-6 transform hover:scale-[1.01] transition-all duration-200">
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
      <User className="w-4 h-4 text-white" />
    </div>
    <h3 className="text-lg font-bold text-blue-900">ĐANG KHÁM</h3>
    <div className="ml-auto bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
      {appointments.filter(appt => appt.status === "in_progress").length} bệnh nhân
    </div>
  </div>
  
  <div className="space-y-3">
    {appointments
      .filter(appt => appt.status === "in_progress")
      .map((appointment) => {
        const fullPatient = waitingPatients.find(p => p.id === appointment.id)
        return (
          <div key={appointment.id} className="bg-white rounded-xl p-4 border-2 border-blue-400 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar với hiệu ứng pulse */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    <User className="w-6 h-6" />
                  </div>
                  {/* Dot trạng thái đang khám */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg text-slate-900">{appointment.patientName}</h4>
                    <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">{appointment.patientAge} tuổi</span>
                    
                    {/* Badge trạng thái đang khám nổi bật */}
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span>ĐANG KHÁM</span>
                    </div>
                    
                    {/* Badge ưu tiên */}
                    {fullPatient && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${getPriorityColor(fullPatient.priority)}`}>
                        {fullPatient.priority === 'emergency' && '🚨'}
                        {fullPatient.priority === 'high' && '⚠️'}
                        {getPriorityText(fullPatient.priority)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-700 mb-2 font-medium">
                    <span className="text-slate-600">Triệu chứng: </span>
                    {appointment.symptoms}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      📞 {appointment.patientPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Bắt đầu: {appointment.checkInTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {new Date(appointment.appointmentTime).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    const patientDetail = waitingPatients.find(p => p.id === appointment.id)
                    if (patientDetail) {
                      const detail: PatientDetail = {
                        id: patientDetail.id,
                        name: patientDetail.name,
                        age: patientDetail.age,
                        gender: patientDetail.gender,
                        phone: patientDetail.phone,
                        symptoms: patientDetail.symptoms,
                        appointmentTime: patientDetail.appointmentTime,
                        allergies: patientDetail.allergies,
                        medicalHistory: patientDetail.medicalHistory,
                        priority: patientDetail.priority,
                        medicalRecords: medicalRecords.filter(r => r.patientName === patientDetail.name)
                      }
                      handleStartExam(detail)
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  Tiếp tục khám
                </button>
                
                {/* Thời gian đã khám */}
                <div className="text-xs text-slate-500 text-center">
                  Đã khám: 15 phút
                </div>
              </div>
            </div>
          </div>
        )
      })}
    
    {/* Empty state */}
    {appointments.filter(appt => appt.status === "in_progress").length === 0 && (
      <div className="text-center py-12 text-slate-500 bg-white rounded-xl border-2 border-dashed border-blue-200">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-blue-300" />
        </div>
        <p className="text-lg font-medium text-slate-600 mb-2">Không có bệnh nhân đang khám</p>
        <p className="text-sm text-slate-500">Bệnh nhân sẽ xuất hiện ở đây khi bạn bắt đầu khám</p>
      </div>
    )}
  </div>
</div>

              {/* Waiting Patients với màu ưu tiên */}
              <div className="bg-white rounded-2xl shadow border p-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Bệnh nhân đang chờ ({waitingPatients.filter(p => p.status === "checked_in").length})</h3>
                <div className="space-y-3">
                  {waitingPatients
                    .filter(patient => patient.status === "checked_in")
                    .map((patient) => {
                      const statusInfo = getStatusInfo(patient.status)
                      return (
                        <div 
                          key={patient.id} 
                          className={`flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-all duration-200 ${
                            patient.priority === 'emergency' ? 'border-red-200 bg-red-50' :
                            patient.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                            'border-slate-200'
                          }`}
                        >
                          <div 
                            className="flex items-center gap-4 flex-1 cursor-pointer" 
                            onClick={() => handleViewPatientDetail(patient.id)}
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              patient.priority === 'emergency' ? 'bg-red-100' :
                              patient.priority === 'high' ? 'bg-orange-100' :
                              'bg-blue-100'
                            }`}>
                              <User className={`w-6 h-6 ${
                                patient.priority === 'emergency' ? 'text-red-600' :
                                patient.priority === 'high' ? 'text-orange-600' :
                                'text-blue-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-slate-900">{patient.name}</h4>
                                <span className="text-sm text-slate-500">{patient.age} tuổi</span>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.cls}`}>
                                  {statusInfo.icon}
                                  <span>{statusInfo.text}</span>
                                </div>
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                                  {getPriorityText(patient.priority)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">Triệu chứng: {patient.symptoms}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>📞 {patient.phone}</span>
                                <span>🕒 Check-in: {patient.checkInTime}</span>
                                <span>⏰ Lịch hẹn: {patient.appointmentTime}</span>
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              const patientDetail: PatientDetail = {
                                id: patient.id,
                                name: patient.name,
                                age: patient.age,
                                gender: patient.gender,
                                phone: patient.phone,
                                symptoms: patient.symptoms,
                                appointmentTime: patient.appointmentTime,
                                allergies: patient.allergies,
                                medicalHistory: patient.medicalHistory,
                                priority: patient.priority,
                                medicalRecords: medicalRecords.filter(r => r.patientName === patient.name)
                              }
                              handleStartExam(patientDetail)
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Bắt đầu khám
                          </button>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-white rounded-2xl shadow border p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Lịch hẹn hôm nay ({appointments.length})</h3>
                
                {/* Controls section */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-4">
                  <div className="flex items-center gap-3 w-full lg:w-auto flex-1">
                    <div className="relative w-full lg:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-10 pr-3 py-2 rounded-lg border border-slate-200 w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Tìm kiếm bệnh nhân, triệu chứng..."
                      />
                    </div>

                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="pl-10 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="waiting">Đang chờ</option>
                        <option value="in_progress">Đang khám</option>
                        <option value="completed">Đã hoàn thành</option>
                        <option value="checked_in">Đã check-in</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                  {paginatedAppointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-600">Không có lịch hẹn phù hợp</div>
                  ) : (
                    paginatedAppointments.map((appointment) => {
                      const statusInfo = getStatusInfo(appointment.status)
                      const fullPatient = waitingPatients.find(p => p.id === appointment.id)
                      return (
                        <div 
                          key={appointment.id} 
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                          onClick={() => appointment.status === "checked_in" && handleViewAppointmentDetail(appointment.id)}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-slate-900">{appointment.patientName}</h4>
                                <span className="text-sm text-slate-500">{appointment.patientAge} tuổi</span>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.cls}`}>
                                  {statusInfo.icon}
                                  <span>{statusInfo.text}</span>
                                </div>
                                {fullPatient && (
                                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(fullPatient.priority)}`}>
                                    {getPriorityText(fullPatient.priority)}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-1">Triệu chứng: {appointment.symptoms}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>📞 {appointment.patientPhone}</span>
                                <span>🕒 {new Date(appointment.appointmentTime).toLocaleTimeString('vi-VN')}</span>
                                <span>📅 {new Date(appointment.appointmentTime).toLocaleDateString('vi-VN')}</span>
                              </div>
                            </div>
                          </div>
                          {appointment.status === "checked_in" && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                if (fullPatient) {
                                  const patientDetail: PatientDetail = {
                                    id: fullPatient.id,
                                    name: fullPatient.name,
                                    age: fullPatient.age,
                                    gender: fullPatient.gender,
                                    phone: fullPatient.phone,
                                    symptoms: fullPatient.symptoms,
                                    appointmentTime: fullPatient.appointmentTime,
                                    allergies: fullPatient.allergies,
                                    medicalHistory: fullPatient.medicalHistory,
                                    priority: fullPatient.priority,
                                    medicalRecords: medicalRecords.filter(r => r.patientName === fullPatient.name)
                                  }
                                  handleStartExam(patientDetail)
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Bắt đầu khám
                            </button>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 border-t pt-4 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                                page === currentPage
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Schedule Tab - LỊCH TUẦN ĐẦY ĐỦ */}
{activeTab === "schedule" && (
  <ScheduleTab
    currentWeek={currentWeek}
    setCurrentWeek={setCurrentWeek}
    appointments={appointments}
    waitingPatients={waitingPatients}
    handleViewAppointmentDetail={handleViewAppointmentDetail}
    getStatusInfo={getStatusInfo}
    getPriorityColor={getPriorityColor}
    getPriorityText={getPriorityText}
  />
)}

          {/* Medical Records Tab */}
          {activeTab === "records" && (
            <div className="bg-white rounded-2xl shadow border p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Quản lý bệnh án ({medicalRecords.length})</h2>
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{record.patientName}</h3>
                        <p className="text-sm text-slate-600">{record.age} tuổi • {new Date(record.date).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {record.status === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Chẩn đoán:</p>
                        <p className="text-sm text-slate-600">{record.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Điều trị:</p>
                        <p className="text-sm text-slate-600">{record.treatment}</p>
                      </div>
                    </div>
                    {record.prescriptions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-slate-700 mb-1">Đơn thuốc:</p>
                        <div className="text-sm text-slate-600">
                          {record.prescriptions.map((pres, index) => (
                            <div key={index} className="flex gap-2">
                              <span>• {pres.medicine}</span>
                              <span>{pres.dosage}</span>
                              <span>({pres.frequency})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewMedicalRecord(record.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => generatePrescriptionPDF(record)}
                        className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-100 transition-colors"
                      >
                        In đơn thuốc
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl shadow border p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Cài đặt</h2>
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                      <input 
                        type="text" 
                        value={doctorInfo.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Chuyên khoa</label>
                      <input 
                        type="text" 
                        value={doctorInfo.specialty}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={doctorInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={doctorInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSaveChanges}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Đổi mật khẩu</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Xác nhận mật khẩu mới"
                      />
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODALS */}
          {showPatientModal && selectedPatient && (
            <PatientDetailModal 
              patient={selectedPatient}
              onClose={() => setShowPatientModal(false)}
              onStartExam={handleStartExam}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
            />
          )}

          {showExamForm && currentExamPatient && (
            <MedicalExamForm 
              patient={currentExamPatient}
              onClose={() => setShowExamForm(false)}
              onComplete={handleCompleteExam}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// CÁC COMPONENTS MODAL
const PatientDetailModal = ({ patient, onClose, onStartExam, getPriorityColor, getPriorityText }: {
  patient: PatientDetail
  onClose: () => void
  onStartExam: (patient: PatientDetail) => void
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'allergies'>('info')
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Thông tin bệnh nhân</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">✕</button>
        </div>
        
        {/* CẢNH BÁO NGUY CƠ */}
<div className="mb-4">
  {patient.priority === 'emergency' && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
        🚨 CẤP CỨU - ƯU TIÊN TỐI CAO
      </span>
    </div>
  )}
  {patient.priority === 'high' && (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
        ⚠️ ƯU TIÊN CAO
      </span>
    </div>
  )}
</div>

        {patient.allergies.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800">DỊ ỨNG</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">{patient.allergies.join(', ')}</p>
          </div>
        )}
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Thông tin
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Lịch sử khám
          </button>
          <button 
            onClick={() => setActiveTab('allergies')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'allergies' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Tiền sử & Dị ứng
          </button>
        </div>
        
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Họ tên</label>
                <p className="font-semibold">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tuổi</label>
                <p className="font-semibold">{patient.age}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Giới tính</label>
                <p className="font-semibold">
                  {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">SĐT</label>
                <p className="font-semibold">{patient.phone}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Thời gian hẹn</label>
                <p className="font-semibold">{patient.appointmentTime}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Mức độ ưu tiên</label>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)}`}>
                  {getPriorityText(patient.priority)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Triệu chứng chính</label>
              <p className="font-semibold">{patient.symptoms}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="space-y-3">
            {patient.medicalRecords.map(record => (
              <div key={record.id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{record.date}</span>
                  <span className="text-sm text-gray-600">{record.diagnosis}</span>
                </div>
                <p className="text-sm mt-1">{record.treatment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'allergies' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">Dị ứng</label>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Không có dị ứng nào được ghi nhận</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">Tiền sử bệnh</label>
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.length > 0 ? (
                  patient.medicalHistory.map((history, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {history}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Không có tiền sử bệnh nào được ghi nhận</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button 
            onClick={() => onStartExam(patient)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Bắt đầu khám
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

const MedicalExamForm = ({ patient, onClose, onComplete }: {
  patient: PatientDetail
  onClose: () => void
  onComplete: (formData: MedicalExamFormData) => void
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{ medicine: '', dosage: '', frequency: '' }])
  const [formData, setFormData] = useState<MedicalExamFormData>({
    diagnosis: '',
    clinicalNotes: '',
    currentSymptoms: patient.symptoms,
    prescriptions: [],
    tests: [''],
    attachments: [],
    vitalSigns: {
      bloodPressure: '',
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0,
      spO2: 98,
      weight: 0,
      height: 0
    }
  })

  const updateVitalSign = (field: keyof VitalSigns, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value
      }
    }))
  }
  
  const updatePrescription = (index: number, field: keyof Prescription, value: string) => {
    const updated = prescriptions.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    )
    setPrescriptions(updated)
  }

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '', frequency: '' }])
  }

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index))
  }

  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }))
  }
  
  const updateTest = (index: number, value: string) => {
    const newTests = [...formData.tests]
    newTests[index] = value
    setFormData(prev => ({...prev, tests: newTests}))
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)]
      }))
    }
  }
  
  const removeFile = (index: number) => {
    const newFiles = formData.attachments.filter((_, i) => i !== index)
    setFormData(prev => ({...prev, attachments: newFiles}))
  }

  const validateForm = () => {
    if (!formData.diagnosis.trim()) {
      alert('Vui lòng nhập chẩn đoán')
      return false
    }
    return true
  }

  const handleComplete = () => {
  if (!validateForm()) return
  
  // Cập nhật prescriptions vào formData - THÊM KIỂM TRA
  const validPrescriptions = prescriptions.filter(p => 
    p.medicine.trim() !== '' && p.dosage.trim() !== '' && p.frequency.trim() !== ''
  )
  
  const formDataWithPrescriptions = {
    ...formData,
    prescriptions: validPrescriptions
  }
  
  onComplete(formDataWithPrescriptions)
}
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Tạo bệnh án - {patient.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">✕</button>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Dấu hiệu sinh tồn</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600">Huyết áp (mmHg)</label>
                <input 
                  type="text" 
                  placeholder="120/80"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => updateVitalSign('bloodPressure', e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Mạch (lần/phút)</label>
                <input 
                  type="number" 
                  placeholder="72"
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => updateVitalSign('heartRate', parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nhiệt độ (°C)</label>
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="36.5"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => updateVitalSign('temperature', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nhịp thở (lần/phút)</label>
                <input 
                  type="number" 
                  placeholder="16"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={(e) => updateVitalSign('respiratoryRate', parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">SpO2 (%)</label>
                <input 
                  type="number" 
                  placeholder="98"
                  value={formData.vitalSigns.spO2}
                  onChange={(e) => updateVitalSign('spO2', parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cân nặng (kg)</label>
                <input 
                  type="number" 
                  placeholder="65"
                  value={formData.vitalSigns.weight}
                  onChange={(e) => updateVitalSign('weight', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Chiều cao (cm)</label>
                <input 
                  type="number" 
                  placeholder="170"
                  value={formData.vitalSigns.height}
                  onChange={(e) => updateVitalSign('height', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Triệu chứng hiện tại *</label>
            <textarea 
              value={formData.currentSymptoms}
              onChange={(e) => setFormData(prev => ({...prev, currentSymptoms: e.target.value}))}
              className="w-full border rounded-lg p-3 h-20"
              placeholder="Mô tả triệu chứng hiện tại của bệnh nhân..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Chẩn đoán *</label>
            <textarea 
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({...prev, diagnosis: e.target.value}))}
              className="w-full border rounded-lg p-3 h-20"
              placeholder="Nhập chẩn đoán..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú lâm sàng</label>
            <textarea 
              value={formData.clinicalNotes}
              onChange={(e) => setFormData(prev => ({...prev, clinicalNotes: e.target.value}))}
              className="w-full border rounded-lg p-3 h-32"
              placeholder="Nhập ghi chú lâm sàng..."
            />
          </div>

          {/* PHẦN ĐƠN THUỐC */}
          <div>
            <label className="block text-sm font-medium mb-2">Đơn thuốc</label>
            {prescriptions.map((prescription, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Tên thuốc"
                  value={prescription.medicine}
                  onChange={(e) => updatePrescription(index, 'medicine', e.target.value)}
                  className="col-span-5 border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Liều lượng"
                  value={prescription.dosage}
                  onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                  className="col-span-3 border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Cách dùng"
                  value={prescription.frequency}
                  onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                  className="col-span-3 border rounded p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removePrescription(index)}
                  className="col-span-1 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPrescription}
              className="text-blue-600 text-sm"
            >
              + Thêm thuốc
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chỉ định</label>
            {formData.tests.map((test, index) => (
              <input
                key={index}
                type="text"
                value={test}
                onChange={(e) => updateTest(index, e.target.value)}
                className="w-full border rounded-lg p-3 mb-2"
                placeholder="Ví dụ: Chụp X-quang ngực..."
              />
            ))}
            <button 
              onClick={addTest}
              className="text-blue-600 text-sm"
            >
              + Thêm chỉ định
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tải lên kết quả</label>
            <input 
              type="file" 
              multiple 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              className="w-full border rounded-lg p-3"
            />
            <div className="mt-2 space-y-1">
              {formData.attachments.map((file, index) => (
                <div key={index} className="text-sm text-gray-600 flex justify-between">
                  <span>{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button 
            onClick={handleComplete}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Hoàn tất khám
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

// Stat Component 
function Stat({
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

// ===============================================
// COMPONENT ScheduleTab BỊ THIẾU - THÊM VÀO CUỐI FILE
// ===============================================

const ScheduleTab = ({ 
  currentWeek, 
  setCurrentWeek, 
  appointments, 
  waitingPatients, 
  handleViewAppointmentDetail,
  getStatusInfo,
  getPriorityColor,
  getPriorityText 
}: {
  currentWeek: Date
  setCurrentWeek: (date: Date) => void
  appointments: Appointment[]
  waitingPatients: Patient[]
  handleViewAppointmentDetail: (id: number) => void
  getStatusInfo: (status: string) => any
  getPriorityColor: (priority: string) => string
  getPriorityText: (priority: string) => string
}) => {
  const getWeekSchedule = (date: Date) => {
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
          const isWeekend = index === 0 || index === 6 // Chủ nhật & Thứ 7
          
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
                          {/* Badge trạng thái */}
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.cls}`}>
                            {statusInfo.icon}
                            <span className="text-xs">{statusInfo.text}</span>
                          </div>
                          
                          {/* Badge ưu tiên */}
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