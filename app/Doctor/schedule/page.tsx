"use client";

import { useState, useEffect } from "react";
import ScheduleTab from "../components/ScheduleTab";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { Calendar, Download, Printer, Filter, Plus } from "lucide-react";

import type { 
  Appointment, 
  Patient, 
  ScheduleDay,
  PatientDetail 
} from "@/types";

export default function SchedulePage() {
  // ==================== STATES ====================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"week" | "day" | "month">("week");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showAddAppointment, setShowAddAppointment] = useState(false);

  // ==================== MOCK DATA ====================
  const generateMockAppointments = (): Appointment[] => {
    const today = new Date();
    const appointments: Appointment[] = [];
    
    // Tạo dữ liệu cho 7 ngày
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Số lượng appointment mỗi ngày
      const appointmentsPerDay = Math.floor(Math.random() * 6) + 3;
      
      for (let j = 0; j < appointmentsPerDay; j++) {
        const hour = 8 + Math.floor(Math.random() * 9); // 8h-17h
        const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        
        const appointmentTime = new Date(date);
        appointmentTime.setHours(hour, minute, 0, 0);
        
        const statuses: Array<"waiting" | "in_progress" | "completed" | "checked_in" | "cancelled"> = 
          ["waiting", "checked_in", "in_progress", "completed", "cancelled"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const patientNames = [
          "Trần Thị Lan", "Lê Văn Minh", "Phạm Văn Hùng", "Nguyễn Thị Hoa",
          "Đỗ Văn Tài", "Hoàng Thị Mai", "Vũ Văn Đức", "Bùi Thị Thu",
          "Trịnh Văn Sơn", "Lý Thị Nga", "Mai Văn Tuấn", "Đinh Thị Hà"
        ];
        
        const symptoms = [
          "Ho, sốt, đau họng", "Đau bụng, buồn nôn", "Nhức đầu, chóng mặt",
          "Đau lưng, tê chân", "Khó thở, đau ngực", "Mệt mỏi, chán ăn",
          "Đau khớp, sưng tấy", "Ngứa da, phát ban", "Mất ngủ, căng thẳng",
          "Tiêu chảy, đau bụng"
        ];
        
        appointments.push({
          id: i * 10 + j + 1,
          patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
          patientAge: 20 + Math.floor(Math.random() * 50),
          patientPhone: `09${Math.floor(Math.random() * 90000000) + 10000000}`,
          symptoms: symptoms[Math.floor(Math.random() * symptoms.length)],
          appointmentTime: appointmentTime.toISOString(),
          status: status,
          checkInTime: status === "checked_in" || status === "in_progress" 
            ? `${hour - 1}:${minute.toString().padStart(2, '0')}` 
            : "",
        });
      }
    }
    
    return appointments;
  };

  const generateMockPatients = (): Patient[] => {
    const patients: Patient[] = [];
    const patientNames = [
      "Trần Thị Lan", "Lê Văn Minh", "Phạm Văn Hùng", "Nguyễn Thị Hoa",
      "Đỗ Văn Tài", "Hoàng Thị Mai", "Vũ Văn Đức", "Bùi Thị Thu"
    ];
    
    const priorities: Array<'low' | 'medium' | 'high' | 'emergency'> = 
      ['low', 'medium', 'high', 'emergency'];
    
    const allergiesList = [
      ["Penicillin", "Aspirin"],
      ["Paracetamol"],
      ["Ibuprofen"],
      ["Sulfa"],
      ["Latex"],
      [],
      ["Penicillin"],
      ["Aspirin", "Ibuprofen"]
    ];
    
    const medicalHistories = [
      ["Tiểu đường", "Cao huyết áp"],
      ["Cao huyết áp", "Rối loạn mỡ máu"],
      ["Viêm dạ dày"],
      ["Hen suyễn"],
      ["Bệnh tim mạch"],
      ["Viêm khớp"],
      ["Tiểu đường type 2"],
      ["Cao huyết áp", "Tiểu đường"]
    ];
    
    for (let i = 0; i < patientNames.length; i++) {
      const hour = 8 + Math.floor(Math.random() * 9);
      const minute = Math.floor(Math.random() * 4) * 15;
      
      patients.push({
        id: i + 1,
        name: patientNames[i],
        age: 25 + Math.floor(Math.random() * 50),
        gender: i % 2 === 0 ? 'female' : 'male',
        phone: `09${Math.floor(Math.random() * 90000000) + 10000000}`,
        symptoms: "Triệu chứng khám bệnh...",
        appointmentTime: `${hour}:${minute.toString().padStart(2, '0')}`,
        status: i % 4 === 0 ? "checked_in" : "waiting",
        checkInTime: i % 4 === 0 ? `${hour - 1}:${minute.toString().padStart(2, '0')}` : "",
        priority: priorities[i % priorities.length],
        allergies: allergiesList[i],
        medicalHistory: medicalHistories[i],
      });
    }
    
    return patients;
  };

  // State cho dữ liệu
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  // ==================== HELPER FUNCTIONS ====================
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "checked_in": return { 
        cls: "bg-green-100 text-green-800 border-green-200", 
        icon: "✓", 
        text: "Đã check-in" 
      };
      case "in_progress": return { 
        cls: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: "↻", 
        text: "Đang khám" 
      };
      case "completed": return { 
        cls: "bg-gray-100 text-gray-800 border-gray-200", 
        icon: "✓", 
        text: "Hoàn thành" 
      };
      case "cancelled": return { 
        cls: "bg-red-100 text-red-800 border-red-200", 
        icon: "✕", 
        text: "Đã hủy" 
      };
      default: return { 
        cls: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: "⏳", 
        text: "Chờ" 
      };
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "emergency": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case "emergency": return "CẤP CỨU";
      case "high": return "ƯU TIÊN CAO";
      case "medium": return "Trung bình";
      default: return "Thấp";
    }
  };

  const getWeekRange = (date: Date): { start: Date; end: Date } => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
  };

  // ==================== DATA LOADING ====================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock data
        const mockAppointments = generateMockAppointments();
        const mockPatients = generateMockPatients();
        
        setAppointments(mockAppointments);
        setWaitingPatients(mockPatients);
        setFilteredAppointments(mockAppointments);
        
        setError(false);
      } catch (err) {
        console.error("❌ Lỗi khi tải lịch làm việc:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==================== FILTER FUNCTIONS ====================
  useEffect(() => {
    let filtered = [...appointments];
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(appt => appt.status === filterStatus);
    }
    
    // Filter by priority (cần match với patient)
    if (filterPriority !== "all") {
      filtered = filtered.filter(appt => {
        const patient = waitingPatients.find(p => p.name === appt.patientName);
        return patient?.priority === filterPriority;
      });
    }
    
    setFilteredAppointments(filtered);
  }, [filterStatus, filterPriority, appointments, waitingPatients]);

  // ==================== EVENT HANDLERS ====================
  const handleViewAppointmentDetail = (id: number) => {
    const appointment = appointments.find(a => a.id === id);
    const patient = waitingPatients.find(p => p.name === appointment?.patientName);
    
    if (appointment && patient) {
      alert(`Chi tiết lịch hẹn:\n\n` +
            `Bệnh nhân: ${appointment.patientName}\n` +
            `Tuổi: ${appointment.patientAge}\n` +
            `SĐT: ${appointment.patientPhone}\n` +
            `Triệu chứng: ${appointment.symptoms}\n` +
            `Thời gian: ${new Date(appointment.appointmentTime).toLocaleString('vi-VN')}\n` +
            `Trạng thái: ${getStatusInfo(appointment.status).text}`);
    }
  };

  const handleAddAppointment = () => {
    setShowAddAppointment(true);
    // In real app, open a modal form here
    alert("Chức năng thêm lịch hẹn mới sẽ mở form ở đây");
  };

  const handlePrintSchedule = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const { start, end } = getWeekRange(currentWeek);
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Lịch làm việc - BS. Nguyễn Văn A</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .status-completed { color: green; }
              .status-pending { color: orange; }
            </style>
          </head>
          <body>
            <h1>Lịch làm việc - BS. Nguyễn Văn A</h1>
            <p>Khoảng thời gian: ${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}</p>
            <p>Tổng số lịch hẹn: ${filteredAppointments.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Bệnh nhân</th>
                  <th>Triệu chứng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${filteredAppointments.map(appt => `
                  <tr>
                    <td>${new Date(appt.appointmentTime).toLocaleString('vi-VN')}</td>
                    <td>${appt.patientName} (${appt.patientAge} tuổi)</td>
                    <td>${appt.symptoms}</td>
                    <td class="status-${appt.status}">${getStatusInfo(appt.status).text}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              In ngày: ${new Date().toLocaleString('vi-VN')}
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportSchedule = () => {
    const { start, end } = getWeekRange(currentWeek);
    const data = {
      title: "Lịch làm việc bác sĩ",
      period: `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`,
      doctor: "BS. Nguyễn Văn A",
      appointments: filteredAppointments.map(appt => ({
        time: new Date(appt.appointmentTime).toLocaleString('vi-VN'),
        patient: appt.patientName,
        age: appt.patientAge,
        symptoms: appt.symptoms,
        status: getStatusInfo(appt.status).text,
        phone: appt.patientPhone
      })),
      summary: {
        total: filteredAppointments.length,
        byStatus: filteredAppointments.reduce((acc, appt) => {
          acc[appt.status] = (acc[appt.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lich-lam-viec-${start.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("📥 Lịch làm việc đã được xuất thành công!");
  };

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const newAppointments = generateMockAppointments();
      const newPatients = generateMockPatients();
      
      setAppointments(newAppointments);
      setWaitingPatients(newPatients);
      setFilteredAppointments(newAppointments);
      setLoading(false);
    }, 1000);
  };

  // ==================== RENDER LOADING/ERROR ====================
  if (loading) {
    return <LoadingState message="Đang tải lịch làm việc..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Không thể tải lịch làm việc" 
        onRetry={handleRefreshData}
      />
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header với controls */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              Lịch làm việc
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý và theo dõi lịch hẹn bệnh nhân
            </p>
            
            {/* Week display */}
            <div className="mt-4 flex items-center gap-4">
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <span className="font-semibold text-gray-800">
                  Tuần {Math.ceil(currentWeek.getDate() / 7)} • Tháng {currentWeek.getMonth() + 1}/{currentWeek.getFullYear()}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {getWeekRange(currentWeek).start.toLocaleDateString('vi-VN')} - {getWeekRange(currentWeek).end.toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddAppointment}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Thêm lịch hẹn
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handlePrintSchedule}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                In lịch
              </button>
              
              <button
                onClick={handleExportSchedule}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Xuất file
              </button>
            </div>
          </div>
        </div>
        
        {/* View mode selector */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 ${viewMode === "day" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 ${viewMode === "week" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 ${viewMode === "month" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
            >
              Tháng
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
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
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả mức độ ưu tiên</option>
              <option value="low">Ưu tiên thấp</option>
              <option value="medium">Ưu tiên trung bình</option>
              <option value="high">Ưu tiên cao</option>
              <option value="emergency">Cấp cứu</option>
            </select>
            
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterPriority("all");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</div>
          <div className="text-sm text-gray-600">Tổng lịch hẹn</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {filteredAppointments.filter(a => a.status === "checked_in").length}
          </div>
          <div className="text-sm text-gray-600">Đã check-in</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredAppointments.filter(a => a.status === "waiting").length}
          </div>
          <div className="text-sm text-gray-600">Đang chờ</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {filteredAppointments.filter(a => a.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Đã hoàn thành</div>
        </div>
      </div>

      {/* Main Schedule Content */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <ScheduleTab
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          appointments={filteredAppointments}
          waitingPatients={waitingPatients}
          handleViewAppointmentDetail={handleViewAppointmentDetail}
          getStatusInfo={getStatusInfo}
          getPriorityColor={getPriorityColor}
          getPriorityText={getPriorityText}
        />
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Chú thích</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Đã check-in</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm text-gray-600">Đang khám</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Đang chờ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Đã hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Đã hủy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
            <span className="text-sm text-gray-600">Cuối tuần</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Hiển thị {filteredAppointments.length} lịch hẹn • 
          Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentWeek(new Date())}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hôm nay
          </button>
          <button
            onClick={handleRefreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Làm mới dữ liệu
          </button>
        </div>
      </div>
    </div>
  );
}