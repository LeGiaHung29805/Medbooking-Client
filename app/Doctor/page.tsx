"use client"
import { useState, useMemo } from "react"
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
} from "lucide-react"

interface Doctor {
  id: number
  name: string
  position: string
  department: string
  hospital: string
  location: string
  status: "active" | "inactive" | "on_leave"
  appointments: number
  revenue: number
  rating: number
  experience: string
  image: string
  price: number
  lastActive: string
}

export default function AdminDoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDoctors, setSelectedDoctors] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const itemsPerPage = 4

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Nguyễn Hoàng A",
      position: "Thạc sĩ, Bác sĩ chuyên khoa II",
      department: "Sản Phụ khoa",
      hospital: "Bệnh viện Đa khoa Hồng Ngọc",
      location: "Hà Nội",
      status: "active",
      appointments: 156,
      revenue: 46800000,
      rating: 4.8,
      experience: "20 năm kinh nghiệm",
      image: "/image/doctors/doctor1.jpg",
      price: 300000,
      lastActive: "2024-01-15"
    },
    {
      id: 2,
      name: "Trần Thu B",
      position: "Bác sĩ CKI",
      department: "Nội khoa",
      hospital: "Bệnh viện Bạch Mai",
      location: "Hà Nội",
      status: "active",
      appointments: 203,
      revenue: 101500000,
      rating: 4.9,
      experience: "15 năm kinh nghiệm",
      image: "/image/doctors/doctor2.jpg",
      price: 500000,
      lastActive: "2024-01-15"
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "PGS. TS, Bác sĩ",
      department: "Ngoại khoa",
      hospital: "Bệnh viện Việt Đức",
      location: "Hà Nội",
      status: "on_leave",
      appointments: 89,
      revenue: 35600000,
      rating: 4.7,
      experience: "25 năm kinh nghiệm",
      image: "/image/doctors/doctor1.jpg",
      price: 400000,
      lastActive: "2024-01-10"
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Thạc sĩ, Bác sĩ chuyên khoa I",
      department: "Tai Mũi Họng",
      hospital: "Bệnh viện Tai Mũi Họng Trung ương",
      location: "Hà Nội",
      status: "active",
      appointments: 134,
      revenue: 33500000,
      rating: 4.6,
      experience: "15 năm kinh nghiệm",
      image: "/image/doctors/doctor4.jpg",
      price: 250000,
      lastActive: "2024-01-14"
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      position: "Bác sĩ chuyên khoa I",
      department: "Răng Hàm Mặt",
      hospital: "Phòng khám Răng Hàm Mặt Sài Gòn",
      location: "Hồ Chí Minh",
      status: "inactive",
      appointments: 67,
      revenue: 26800000,
      rating: 4.9,
      experience: "10 năm kinh nghiệm",
      image: "/image/doctors/doctor5.jpg",
      price: 400000,
      lastActive: "2024-01-05"
    },
{
  id: 6,
  name: "Ngô Thị F",
  position: "Bác sĩ nội trú",
  department: "Nhi",
  hospital: "Bệnh viện Nhi Đồng 1",
  location: "Hồ Chí Minh",
  status: "active",
  appointments: 187,
  revenue: 37400000,
  rating: 4.7,
  experience: "6 năm kinh nghiệm",
  image: "/image/doctors/doctor6.jpg",
  price: 200000,
  lastActive: "2024-01-14"
},
{
  id: 7,
  name: "Vũ Văn G",
  position: "Thạc sĩ, Bác sĩ chuyên khoa II",
  department: "Da liễu",
  hospital: "Bệnh viện Da Liễu Trung ương",
  location: "Hà Nội",
  status: "active",
  appointments: 245,
  revenue: 73500000,
  rating: 4.8,
  experience: "18 năm kinh nghiệm",
  image: "/image/doctors/doctor7.jpg",
  price: 300000,
  lastActive: "2024-01-15"
},
{
  id: 8,
  name: "Bùi Thị H",
  position: "Bác sĩ chuyên khoa II",
  department: "Cơ Xương Khớp",
  hospital: "Bệnh viện Bạch Mai",
  location: "Hà Nội",
  status: "on_leave",
  appointments: 198,
  revenue: 63360000,
  rating: 4.9,
  experience: "22 năm kinh nghiệm",
  image: "/image/doctors/doctor8.jpg",
  price: 320000,
  lastActive: "2024-01-10"
},
{
  id: 9,
  name: "Đặng Văn I",
  position: "Bác sĩ chuyên khoa I",
  department: "Tiết niệu",
  hospital: "Bệnh viện Việt Đức",
  location: "Hà Nội",
  status: "active",
  appointments: 89,
  revenue: 31150000,
  rating: 4.5,
  experience: "11 năm kinh nghiệm",
  image: "/image/doctors/doctor9.jpg",
  price: 350000,
  lastActive: "2024-01-13"
},
{
  id: 10,
  name: "Phan Thị K",
  position: "Bác sĩ chuyên khoa II",
  department: "Mắt",
  hospital: "Bệnh viện Mắt Trung ương",
  location: "Hà Nội",
  status: "active",
  appointments: 167,
  revenue: 61790000,
  rating: 4.7,
  experience: "16 năm kinh nghiệm",
  image: "/image/doctors/doctor10.jpg",
  price: 370000,
  lastActive: "2024-01-15"
},
{
  id: 11,
  name: "Trương Văn L",
  position: "Thạc sĩ",
  department: "Truyền nhiễm",
  hospital: "Bệnh viện Bệnh Nhiệt Đới",
  location: "Hồ Chí Minh",
  status: "active",
  appointments: 134,
  revenue: 37520000,
  rating: 4.8,
  experience: "14 năm kinh nghiệm",
  image: "/image/doctors/doctor11.jpg",
  price: 280000,
  lastActive: "2024-01-15"
},
{
  id: 12,
  name: "Nguyễn Thị M",
  position: "Bác sĩ chuyên khoa I",
  department: "Thần kinh",
  hospital: "Bệnh viện Chợ Rẫy",
  location: "Hồ Chí Minh",
  status: "inactive",
  appointments: 76,
  revenue: 22800000,
  rating: 4.6,
  experience: "9 năm kinh nghiệm",
  image: "/image/doctors/doctor12.jpg",
  price: 300000,
  lastActive: "2024-01-08"
},
{
  id: 13,
  name: "Lý Văn N",
  position: "TS.BS, Bác sĩ chuyên khoa II",
  department: "Ung bướu",
  hospital: "Bệnh viện K",
  location: "Hà Nội",
  status: "active",
  appointments: 312,
  revenue: 171600000,
  rating: 4.9,
  experience: "28 năm kinh nghiệm",
  image: "/image/doctors/doctor13.jpg",
  price: 550000,
  lastActive: "2024-01-15"
},
{
  id: 14,
  name: "Phùng Thị O",
  position: "Bác sĩ chuyên khoa I",
  department: "Ngoại Tổng quát",
  hospital: "Bệnh viện Đa khoa tỉnh Bắc Ninh",
  location: "Bắc Ninh",
  status: "active",
  appointments: 123,
  revenue: 31980000,
  rating: 4.4,
  experience: "13 năm kinh nghiệm",
  image: "/image/doctors/doctor14.jpg",
  price: 260000,
  lastActive: "2024-01-14"
},
{
  id: 15,
  name: "Đỗ Văn P",
  position: "Bác sĩ Gây mê hồi sức",
  department: "Gây mê hồi sức",
  hospital: "Bệnh viện Trung ương Huế",
  location: "Huế",
  status: "active",
  appointments: 156,
  revenue: 51480000,
  rating: 4.7,
  experience: "12 năm kinh nghiệm",
  image: "/image/doctors/doctor15.jpg",
  price: 330000,
  lastActive: "2024-01-12"
},
{
  id: 16,
  name: "Hà Thị Q",
  position: "Bác sĩ Chẩn đoán hình ảnh",
  department: "Chẩn đoán hình ảnh",
  hospital: "Bệnh viện Đa khoa Đà Nẵng",
  location: "Đà Nẵng",
  status: "active",
  appointments: 98,
  revenue: 23520000,
  rating: 4.5,
  experience: "8 năm kinh nghiệm",
  image: "/image/doctors/doctor16.jpg",
  price: 240000,
  lastActive: "2024-01-15"
}

  ];

const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || doctor.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const paginatedDoctors = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter((d) => d.status === "active").length,
    totalAppointments: doctors.reduce((sum, doc) => sum + doc.appointments, 0),
    totalRevenue: doctors.reduce((sum, doc) => sum + doc.revenue, 0),
  }

  const toggleSelectDoctor = (id: number) => {
    setSelectedDoctors((prev) => (prev.includes(id) ? prev.filter((doctorId) => doctorId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    setSelectedDoctors(selectedDoctors.length === paginatedDoctors.length ? [] : paginatedDoctors.map((d) => d.id))
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return {
          text: "Đang hoạt động",
          cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        }
      case "inactive":
        return {
          text: "Ngừng hoạt động",
          cls: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle className="w-4 h-4 text-rose-500" />,
        }
      case "on_leave":
        return {
          text: "Nghỉ phép",
          cls: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="w-4 h-4 text-amber-500" />,
        }
      default:
        return { text: "", cls: "", icon: null }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F7FF] via-[#F3F9F1] to-[#F6F0FF] p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <aside
          className={`col-span-12 md:col-span-3 lg:col-span-2 transition-all duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 md:opacity-100"}`}
        >
          <div className="bg-white rounded-2xl shadow-md border p-4 h-fit sticky top-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold">
                  MD
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Medical Admin</h3>
                  <p className="text-xs text-slate-500">Quản lý bác sĩ</p>
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
                { icon: LayoutDashboard, label: "Tổng quan" },
                { icon: Users, label: "Bác sĩ" },
                { icon: Settings, label: "Cài đặt" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <item.icon className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-800">{item.label}</span>
                </div>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors">
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
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Quản lý Bác sĩ</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Giao diện quản trị: danh sách, lọc, tìm kiếm, thao tác nhanh
                </p>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-400 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200">
                <Plus className="w-4 h-4" /> Thêm bác sĩ
              </button>
            </div>
          </header>

          {/* Stats row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Tổng", value: stats.totalDoctors, icon: <Users />, colorFrom: "#60A5FA", colorTo: "#34D399" },
              {
                label: "Đang hoạt động",
                value: stats.activeDoctors,
                icon: <CheckCircle2 />,
                colorFrom: "#34D399",
                colorTo: "#10B981",
              },
              {
                label: "Lịch hẹn",
                value: stats.totalAppointments,
                icon: <Eye />,
                colorFrom: "#FDBA74",
                colorTo: "#FB923C",
              },
              {
                label: "Doanh thu (M)",
                value: (stats.totalRevenue / 1000000).toFixed(1),
                icon: <Download />,
                colorFrom: "#C084FC",
                colorTo: "#A78BFA",
              },
            ].map((stat, i) => (
              <Stat key={i} {...stat} />
            ))}
          </section>

          {/* Controls section */}
          <div className="bg-white rounded-2xl shadow border p-4 mb-6 transition-all duration-200 hover:shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
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
                    placeholder="Tìm kiếm..."
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
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                    <option value="on_leave">Nghỉ phép</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Xuất
                </button>
                <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <MoreVertical className="w-4 h-4" /> Khác
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow border p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {paginatedDoctors.length === 0 ? (
                <div className="col-span-1 lg:col-span-2 p-8 text-center text-slate-600">Không có bác sĩ phù hợp</div>
              ) : (
                paginatedDoctors.map((doctor) => {
                  const statusInfo = getStatusInfo(doctor.status)
                  return (
                    <article
                      key={doctor.id}
                      className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex gap-4 items-start"
                    >
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedDoctors.includes(doctor.id)}
                          onChange={() => toggleSelectDoctor(doctor.id)}
                          className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-1"
                        />
                      </div>

                      <div className="flex-shrink-0">
                        <Image
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          width={64}
                          height={64}
                          className="rounded-xl object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-slate-900 truncate">{doctor.name}</h3>
                            <p className="text-xs text-slate-500 truncate">{doctor.position}</p>
                            <p className="text-xs text-slate-500 truncate mt-1">
                              {doctor.department} — {doctor.hospital}
                            </p>
                          </div>
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusInfo.cls}`}
                          >
                            {statusInfo.icon}
                            <span>{statusInfo.text}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400" /> {doctor.rating}
                            </div>
                            <span>{doctor.appointments} lượt</span>
                            <span>{doctor.price.toLocaleString()}đ</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button title="Xem" className="p-1.5 rounded-md hover:bg-white transition-colors">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button title="Sửa" className="p-1.5 rounded-md hover:bg-white transition-colors">
                              <Edit className="w-4 h-4 text-emerald-600" />
                            </button>
                            <button title="Xóa" className="p-1.5 rounded-md hover:bg-white transition-colors">
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </div>

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
          </div>
        </main>
      </div>
    </div>
  )
}

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
