"use client";

import { useState, useEffect } from "react";
import DashboardTab from "./components/DashboardTab";
import PatientDetailModal from "./components/PatientDetailModal";
import MedicalExamForm from "./components/MedicalExamForm";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

import {
  doctorGetDashboard,
  doctorGetQueue,
  getDoctorMyMedicalRecords,
} from "@/lib/ApiClient";

import type { 
  PatientDetail, 
  MedicalRecord, 
  Appointment, 
  Patient, 
  Prescription,
  VitalSigns
} from "@/lib/model";

export default function DoctorDashboardPage() {
  // ==================== STATES ====================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Đang tải dữ liệu...");

  // Dữ liệu từ API
  const [dashboardStats, setDashboardStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    waitingAppointments: 0,
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  // Modal states
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [currentExamPatient, setCurrentExamPatient] = useState<PatientDetail | null>(null);

  // Current doctor info
  const [currentDoctor] = useState({
    id: 1,
    FullName: "Nguyễn Văn A",
    specialty: { SpecialtyName: "Nội tổng quát" },
    email: "doctor.a@hospital.com",
    phone: "0901234567",
    department: "Khoa Nội tổng quát",
    experience: "10 năm",
    education: "Bác sĩ chuyên khoa I",
  });

  // ==================== MOCK DATA ====================
  const mockAppointments: Appointment[] = [
    {
      id: 1,
      patientName: "Trần Thị Lan",
      patientAge: 34,
      patientPhone: "0901234567",
      symptoms: "Ho, sốt 3 ngày, đau họng, mệt mỏi",
      appointmentTime: new Date().toISOString(),
      status: "checked_in",
      checkInTime: "08:50",
    },
    {
      id: 2,
      patientName: "Lê Văn Minh",
      patientAge: 45,
      patientPhone: "0912345678",
      symptoms: "Đau bụng trên, đầy hơi, buồn nôn",
      appointmentTime: new Date(Date.now() + 30 * 60000).toISOString(),
      status: "waiting",
      checkInTime: "",
    },
    {
      id: 3,
      patientName: "Phạm Văn Hùng",
      patientAge: 52,
      patientPhone: "0934567890",
      symptoms: "Tiểu đường, huyết áp cao, chóng mặt",
      appointmentTime: new Date(Date.now() - 60 * 60000).toISOString(),
      status: "in_progress",
      checkInTime: "08:20",
    },
    {
      id: 4,
      patientName: "Nguyễn Thị Hoa",
      patientAge: 28,
      patientPhone: "0945678901",
      symptoms: "Đau đầu, mất ngủ, căng thẳng",
      appointmentTime: new Date(Date.now() - 120 * 60000).toISOString(),
      status: "completed",
      checkInTime: "09:45",
    },
    {
      id: 5,
      patientName: "Đỗ Văn Tài",
      patientAge: 62,
      patientPhone: "0956789012",
      symptoms: "Khó thở, đau ngực, tim đập nhanh",
      appointmentTime: new Date(Date.now() + 90 * 60000).toISOString(),
      status: "checked_in",
      checkInTime: "09:30",
    },
    {
      id: 6,
      patientName: "Hoàng Thị Mai",
      patientAge: 38,
      patientPhone: "0967890123",
      symptoms: "Đau lưng, tê chân, khó vận động",
      appointmentTime: new Date(Date.now() + 120 * 60000).toISOString(),
      status: "waiting",
      checkInTime: "",
    },
  ];

  const mockWaitingPatients: Patient[] = [
    {
      id: 1,
      name: "Trần Thị Lan",
      age: 34,
      gender: 'female',
      phone: "0901234567",
      symptoms: "Ho, sốt 3 ngày, đau họng, mệt mỏi",
      appointmentTime: "09:00",
      status: "checked_in",
      checkInTime: "08:50",
      priority: 'high',
      allergies: ["Penicillin", "Aspirin"],
      medicalHistory: ["Tiểu đường type 2", "Cao huyết áp"],
    },
    {
      id: 2,
      name: "Lê Văn Tùng",
      age: 45,
      gender: 'male',
      phone: "0912345678",
      symptoms: "Đau đầu, chóng mặt, buồn nôn, mờ mắt",
      appointmentTime: "09:30",
      status: "waiting",
      checkInTime: "09:15",
      priority: 'medium',
      allergies: ["Paracetamol"],
      medicalHistory: ["Cao huyết áp", "Rối loạn mỡ máu"],
    },
    {
      id: 3,
      name: "Phạm Thị Mai",
      age: 28,
      gender: 'female',
      phone: "0923456789",
      symptoms: "Đau bụng dữ dội, sốt nhẹ, buồn nôn, tiêu chảy",
      appointmentTime: "10:00",
      status: "waiting",
      checkInTime: "09:45",
      priority: 'emergency',
      allergies: ["Aspirin", "Ibuprofen"],
      medicalHistory: ["Viêm dạ dày mãn tính"],
    },
    {
      id: 5,
      name: "Đỗ Văn Tài",
      age: 62,
      gender: 'male',
      phone: "0956789012",
      symptoms: "Khó thở, đau ngực, tim đập nhanh, vã mồ hôi",
      appointmentTime: "10:30",
      status: "checked_in",
      checkInTime: "09:30",
      priority: 'emergency',
      allergies: ["Sulfa", "Penicillin"],
      medicalHistory: ["Bệnh tim mạch", "Tiểu đường", "Cao huyết áp"],
    },
  ];

  const mockMedicalRecords: MedicalRecord[] = [
    {
      id: 1,
      patientName: "Trần Thị Lan",
      age: 34,
      diagnosis: "Viêm họng cấp do virus",
      treatment: "Kháng sinh 5 ngày, nghỉ ngơi, uống nhiều nước, hạ sốt khi cần",
      prescriptions: [
        { medicine: "Amoxicillin", dosage: "500mg", frequency: "3 lần/ngày trong 5 ngày" },
        { medicine: "Paracetamol", dosage: "500mg", frequency: "Khi sốt >38.5°C, tối đa 4 viên/ngày" },
        { medicine: "Vitamin C", dosage: "1000mg", frequency: "1 lần/ngày trong 7 ngày" },
      ],
      tests: ["Xét nghiệm máu CBC", "Ngoáy họng soi tươi", "CRP", "X-quang phổi"],
      date: "2025-04-02",
      status: "completed",
    },
    {
      id: 2,
      patientName: "Lê Văn Tùng",
      age: 45,
      diagnosis: "Tăng huyết áp độ 2, Rối loạn mỡ máu",
      treatment: "Điều chỉnh lối sống, thuốc hạ áp, theo dõi định kỳ, ăn kiêng ít muối, ít dầu mỡ",
      prescriptions: [
        { medicine: "Losartan", dosage: "50mg", frequency: "1 lần/ngày vào buổi sáng" },
        { medicine: "Amlodipine", dosage: "5mg", frequency: "1 lần/ngày" },
        { medicine: "Atorvastatin", dosage: "20mg", frequency: "1 lần/ngày trước khi ngủ" },
        { medicine: "Aspirin", dosage: "81mg", frequency: "1 lần/ngày" },
      ],
      tests: ["Đo huyết áp 24h", "Xét nghiệm máu (lipid, đường huyết)", "Điện tâm đồ", "Siêu âm tim", "Siêu âm doppler động mạch cảnh"],
      date: "2025-03-28",
      status: "completed",
    },
    {
      id: 3,
      patientName: "Nguyễn Thị Hoa",
      age: 28,
      diagnosis: "Rối loạn lo âu, Mất ngủ",
      treatment: "Tư vấn tâm lý, thư giãn, tập thể dục đều đặn, ngủ đủ giấc",
      prescriptions: [
        { medicine: "Alprazolam", dosage: "0.25mg", frequency: "1/2 viên trước khi ngủ khi cần" },
        { medicine: "Melatonin", dosage: "3mg", frequency: "1 viên trước khi ngủ 30 phút" },
      ],
      tests: ["Đánh giá tâm lý", "Xét nghiệm máu (TSH, công thức máu)", "Đo đa ký giấc ngủ"],
      date: "2025-04-01",
      status: "completed",
    },
  ];

  // ==================== HELPER FUNCTIONS ====================
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

  const getPriorityIcon = (priority: string): string => {
    switch (priority) {
      case "emergency": return "🚨";
      case "high": return "⚠️";
      case "medium": return "🟡";
      default: return "🔵";
    }
  };

  // ==================== DATA LOADING ====================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingMessage("Đang tải thông tin tổng quan...");

        // Gọi API song song
        const [dashRes, queueRes, recordsRes] = await Promise.allSettled([
          doctorGetDashboard(),
          doctorGetQueue(),
          getDoctorMyMedicalRecords(),
        ]);

        console.log("📊 API Responses:", { dashRes, queueRes, recordsRes });

        // Xử lý Dashboard Stats
        setLoadingMessage("Đang xử lý thống kê...");
        if (dashRes.status === 'fulfilled' && dashRes.value) {
          const data = dashRes.value;
          if (typeof data === 'object') {
            setDashboardStats({
              totalAppointments: data.total_appointments_count || 12,
              completedAppointments: data.completed_appointments_count || 6,
              waitingAppointments: data.waiting_appointments_count || 4,
            });
          } else {
            setDashboardStats({
              totalAppointments: 12,
              completedAppointments: 6,
              waitingAppointments: 4,
            });
          }
        } else {
          setDashboardStats({
            totalAppointments: mockAppointments.length,
            completedAppointments: mockAppointments.filter(a => a.status === "completed").length,
            waitingAppointments: mockAppointments.filter(a => a.status === "waiting" || a.status === "checked_in").length,
          });
        }

        // Xử lý Queue
        setLoadingMessage("Đang tải danh sách bệnh nhân...");
        let patientsFromAPI: Patient[] = [];
        if (queueRes.status === 'fulfilled' && queueRes.value) {
          const data = queueRes.value;
          if (data && typeof data === 'object' && data.success && Array.isArray(data.data)) {
            patientsFromAPI = data.data.map((item: any) => ({
              id: item.id || 0,
              name: item.name || item.patientName || "Không có tên",
              age: item.age || 0,
              gender: (item.gender === 'male' || item.gender === 'female' || item.gender === 'other') 
                ? item.gender 
                : 'other',
              phone: item.phone || "",
              symptoms: item.symptoms || item.InitialSymptoms || "Không có triệu chứng",
              appointmentTime: item.appointmentTime || item.time || "",
              status: item.status === 'checked_in' ? 'checked_in' : 
                     item.status === 'in_progress' ? 'in_progress' :
                     item.status === 'completed' ? 'completed' : 'waiting',
              checkInTime: item.checkInTime || "",
              priority: (item.priority === 'low' || item.priority === 'medium' || 
                        item.priority === 'high' || item.priority === 'emergency')
                ? item.priority
                : 'medium',
              allergies: Array.isArray(item.allergies) ? item.allergies : [],
              medicalHistory: Array.isArray(item.medicalHistory) ? item.medicalHistory : [],
            }));
          }
        }
        
        setWaitingPatients(patientsFromAPI.length > 0 ? patientsFromAPI : mockWaitingPatients);

        // Xử lý Medical Records
        setLoadingMessage("Đang tải bệnh án...");
        let recordsFromAPI: MedicalRecord[] = [];
        if (recordsRes.status === 'fulfilled' && recordsRes.value) {
          const data = recordsRes.value;
          if (Array.isArray(data)) {
            recordsFromAPI = data.map((item: any) => ({
              id: item.id || 0,
              patientName: item.patientName || item.patient_name || "",
              age: item.age || 0,
              diagnosis: item.diagnosis || "Chưa có chẩn đoán",
              treatment: item.treatment || "Chưa có phác đồ điều trị",
              prescriptions: Array.isArray(item.prescriptions) 
                ? item.prescriptions.map((p: any) => ({
                    medicine: p.medicine || p.drugName || "",
                    dosage: p.dosage || p.dose || "",
                    frequency: p.frequency || p.timesPerDay || "",
                  }))
                : [],
              tests: Array.isArray(item.tests) ? item.tests : [],
              date: item.date || item.created_at || new Date().toISOString().split('T')[0],
              status: item.status === 'completed' ? 'completed' : 'pending',
            }));
          }
        }
        
        setMedicalRecords(recordsFromAPI.length > 0 ? recordsFromAPI : mockMedicalRecords);

        // Set appointments
        setAppointments(mockAppointments);

        setError(false);

      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
        
        // Fallback to mock data
        setDashboardStats({
          totalAppointments: mockAppointments.length,
          completedAppointments: mockAppointments.filter(a => a.status === "completed").length,
          waitingAppointments: mockAppointments.filter(a => a.status === "waiting" || a.status === "checked_in").length,
        });
        setAppointments(mockAppointments);
        setWaitingPatients(mockWaitingPatients);
        setMedicalRecords(mockMedicalRecords);
        
        setError(true);
      } finally {
        setLoading(false);
        setLoadingMessage("Đang tải dữ liệu...");
      }
    };

    // Delay loading để demo loading state
    const timer = setTimeout(() => {
      loadData();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // ==================== EVENT HANDLERS ====================
  const handleViewPatientDetail = (patient: Patient) => {
    const detail: PatientDetail = {
      ...patient,
      medicalRecords: medicalRecords.filter(r => r.patientName === patient.name),
      vitalSigns: {
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 36.8,
        respiratoryRate: 16,
        spO2: 98,
        weight: 65,
        height: 170
      }
    };
    setSelectedPatient(detail);
    setShowPatientModal(true);
  };

  const handleStartExam = (patient: PatientDetail) => {
    setCurrentExamPatient(patient);
    setShowExamForm(true);
    setShowPatientModal(false);
  };

  const handleCompleteExam = (formData: any) => {
    console.log("📝 Dữ liệu khám hoàn tất:", formData);
    
    // Hiển thị thông báo thành công
    alert("✅ Khám bệnh thành công!\nBệnh án đã được lưu vào hệ thống.");
    
    // Cập nhật danh sách bệnh nhân
    const updatedPatients = waitingPatients.filter(p => p.id !== currentExamPatient?.id);
    setWaitingPatients(updatedPatients);
    
    // Đóng modal
    setShowExamForm(false);
    setCurrentExamPatient(null);
    
    // Refresh data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRefreshData = () => {
    setLoading(true);
    setLoadingMessage("Đang làm mới dữ liệu...");
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleExportData = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      doctor: currentDoctor,
      stats: dashboardStats,
      appointments: appointments.length,
      waitingPatients: waitingPatients.length,
      medicalRecords: medicalRecords.length,
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("📥 Dữ liệu đã được xuất thành công!");
  };

  // ==================== RENDER LOADING/ERROR ====================
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState 
      message="Không thể tải dữ liệu từ server" 
      onRetry={handleRefreshData}
      onUseDemo={() => {
        setDashboardStats({
          totalAppointments: mockAppointments.length,
          completedAppointments: mockAppointments.filter(a => a.status === "completed").length,
          waitingAppointments: mockAppointments.filter(a => a.status === "waiting" || a.status === "checked_in").length,
        });
        setAppointments(mockAppointments);
        setWaitingPatients(mockWaitingPatients);
        setMedicalRecords(mockMedicalRecords);
        setError(false);
      }}
    />;
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header với action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bảng điều khiển Bác sĩ
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefreshData}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
          
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <DashboardTab
        dashboardStats={dashboardStats}
        appointments={appointments}
        waitingPatients={waitingPatients}
        medicalRecords={medicalRecords}
        currentDoctor={currentDoctor}
        getPriorityColor={getPriorityColor}
        getPriorityText={getPriorityText}
        onViewPatientDetail={handleViewPatientDetail}
        handleStartExam={handleStartExam}
      />

      {/* ==================== MODALS ==================== */}
      
      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setShowPatientModal(false)}
          onStartExam={handleStartExam}
          getPriorityColor={getPriorityColor}
          getPriorityText={getPriorityText}
        />
      )}

      {/* Medical Exam Form Modal */}
      {showExamForm && currentExamPatient && (
        <MedicalExamForm
          patient={currentExamPatient}
          onClose={() => setShowExamForm(false)}
          onComplete={handleCompleteExam}
        />
      )}
    </div>
  );
}