"use client";

import { useState, useEffect } from "react";
import DashboardTab from "./components/DashboardTab";
import PatientDetailModal from "./components/PatientDetailModal";
import MedicalExamForm from "./components/MedicalExamForm";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

import { RefreshCw } from "lucide-react";
import { doctorService } from "../services/doctorService";
import type {
  Appointment,
  Patient,
  PatientDetail,
  MedicalExamFormData
} from "@/lib/model";

export default function DoctorDashboardPage() {
  // ==================== STATES ====================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Đang tải dữ liệu...");

  const [dashboardStats, setDashboardStats] = useState({
    totalpointments: 0,
    completedAppointments: 0,
    waitingAppointments: 0,
    inProgressAppointments: 0,
    todayAppointments: 0
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  // Modal states
  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [currentExamPatient, setCurrentExamPatient] = useState<PatientDetail | null>(null);

  // ==================== HELPER FUNCTIONS ====================
  const getPriorityColor = (priority: string): string => {
    switch (priority?.toLowerCase()) {
      case "emergency": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority?.toLowerCase()) {
      case "emergency": return "CẤP CỨU";
      case "high": return "ƯU TIÊN CAO";
      case "medium": return "Trung bình";
      default: return "Thấp";
    }
  };

  // ==================== THÊM HÀM LÀM MỚI ====================
  const handleRefreshData = async () => {
    setLoading(true);
    setLoadingMessage("Đang tải lại dữ liệu...");
    try {
      await loadDashboardData(); // gọi hàm load chính
    } catch (err) {
      alert("Không thể làm mới dữ liệu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // ==================== HÀM LOAD CHÍNH  ====================
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Đang tải thông tin tổng quan...");

      // Load dashboard stats
      const dashboardData = await doctorService.getDashboard();
      setDashboardStats({
        totalAppointments: dashboardData.total_appointments || 0,
        completedAppointments: dashboardData.completed_appointments || 0,
        waitingAppointments: dashboardData.waiting_appointments || 0,
        inProgressAppointments: dashboardData.in_progress_appointments || 0,
        todayAppointments: dashboardData.today_appointments || 0
      });

      // Load queue
      const queueResponse = await doctorService.getQueue();
      if (queueResponse.success && queueResponse.data.length > 0) {
        const patients = queueResponse.data;
        setWaitingPatients(patients);

        const appointmentsList = patients.map(p => ({
          id: p.id,
          patientName: p.name,
          patientAge: p.age,
          patientPhone: p.phone,
          symptoms: p.symptoms,
          appointmentTime: p.appointmentTime || new Date().toISOString(),
          status: p.status || "waiting",
          checkInTime: p.checkInTime || ""
        }));
        setAppointments(appointmentsList);
      }

      setError(null);
    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể kết nối đến server");
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback data
  const useFallbackData = () => {
    const mockPatients: Patient[] = [
      {
        id: 1,
        name: "Trần Thị Lan",
        age: 34,
        gender: 'female',
        phone: "0901234567",
        symptoms: "Ho, sốt 3 ngày, đau họng",
        appointmentTime: "09:00",
        status: "checked_in",
        checkInTime: "08:50",
        priority: 'high',
        allergies: ["Penicillin"],
        medicalHistory: ["Tiểu đường"],
      },
    ];
    setWaitingPatients(mockPatients);
    setAppointments(mockPatients.map(p => ({ id: p.id, patientName: p.name, status: p.status || "waiting" } as Appointment)));
    setDashboardStats({
      totalAppointments: 10,
      completedAppointments: 5,
      waitingAppointments: 3,
      inProgressAppointments: 1,
      todayAppointments: 7
    });
  };

  // ==================== LOAD BAN ĐẦU ====================
  useEffect(() => {
    loadDashboardData();
  }, []);

  // ==================== XỬ LÝ KHÁM BỆNH ====================
  const handleViewPatientDetail = (patient: Patient) => {
    const detail: PatientDetail = {
      ...patient,
      medicalRecords: [],
      vitalSigns: { bloodPressure: "120/80", heartRate: 72, temperature: 36.8, respiratoryRate: 16, spO2: 98, weight: 65, height: 165 }
    };
    setSelectedPatient(detail);
    setShowPatientModal(true);
  };

  const handleStartExam = async (patient: PatientDetail) => {
    try {
      //  Tìm appointment thật trong danh sách appointments
      const appointment = appointments.find(a =>
        a.id === patient.id ||
        a.patientName === patient.name ||
        a.id === patient.appointmentId
      );

      if (!appointment || !appointment.id) {
        alert("Không tìm thấy lịch hẹn hợp lệ! Vui lòng chọn bệnh nhân từ 'Bệnh nhân đang chờ' hoặc 'Đang khám'");
        return;
      }

      // Cập nhật trạng thái thành in_progress trên server
      const success = await doctorService.startExam(appointment.id);
      if (!success) {
        alert("Không thể bắt đầu khám. Vui lòng thử lại!");
        return;
      }

      //  Gán appointmentId vào patient để lưu bệnh án
      const patientWithAppointment: PatientDetail = {
        ...patient,
        appointmentId: appointment.id,
      };

      //  Mở form khám
      setCurrentExamPatient(patientWithAppointment);
      setShowExamForm(true);
      setShowPatientModal(false);

      // Cập nhật UI
      setAppointments(prev => prev.map(a =>
        a.id === appointment.id ? { ...a, status: 'in_progress' } : a
      ));

      console.log('Bắt đầu khám thành công - AppointmentID:', appointment.id);

    } catch (error) {
      console.error('Lỗi bắt đầu khám:', error);
      alert("Hệ thống lỗi khi bắt đầu khám");
    }
  };

  const handleCompleteExam = async (formData: MedicalExamFormData) => {
    if (!currentExamPatient) return;

    try {
      setLoading(true);

      const payload = {
        patient_id: currentExamPatient.id,
        ...(currentExamPatient.appointmentId && {
          appointment_id: currentExamPatient.appointmentId
        }),
        diagnosis: formData.diagnosis,
        treatment: formData.clinicalNotes || "",
        prescriptions: formData.prescriptions.filter(p => p.medicine?.trim()),
        tests: formData.tests.filter(t => t?.trim()),
        vital_signs: {
          blood_pressure: formData.vitalSigns.bloodPressure || "",
          heart_rate: Number(formData.vitalSigns.heartRate) || 0,
          temperature: Number(formData.vitalSigns.temperature) || 36.5,
          respiratory_rate: Number(formData.vitalSigns.respiratoryRate) || 16,
          sp_o2: Number(formData.vitalSigns.spO2) || 98,
          weight: Number(formData.vitalSigns.weight) || 0,
          height: Number(formData.vitalSigns.height) || 0,
        },
        notes: formData.clinicalNotes,
      };

      const response = await doctorService.createMedicalRecord(payload);

      if (response.success) {
        alert("Hoàn tất khám và lưu bệnh án thành công!");
        setShowExamForm(false);
        setCurrentExamPatient(null);
        await loadDashboardData(); // refresh lại dữ liệu
      } else {
        alert("Lưu bệnh án thất bại: " + (response.message || "Lỗi không xác định"));
      }
    } catch (err: any) {
      console.error(err);
      alert("Lỗi hệ thống: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    alert("Chức năng xuất dữ liệu đang phát triển...");
  };

  // ==================== RENDER ====================
  if (loading) return <LoadingState message={loadingMessage} />;
  if (error) return <ErrorState message={error} onRetry={handleRefreshData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển Bác sĩ</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefreshData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Đang tải..." : "Làm mới"}
          </button>

          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Xuất dữ liệu
          </button>
        </div>
      </div>

      <DashboardTab
        dashboardStats={dashboardStats}
        appointments={appointments}
        waitingPatients={waitingPatients}
        medicalRecords={medicalRecords}
        getPriorityColor={getPriorityColor}
        getPriorityText={getPriorityText}
        onViewPatientDetail={handleViewPatientDetail}
        handleStartExam={handleStartExam}
      />

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
    </div>
  );
}