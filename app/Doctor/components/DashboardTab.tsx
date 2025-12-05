"use client";

import DashboardStats from "./DashboardStats";
import TodayAppointments from "./TodayAppointments";
import WaitingPatients from "./WaitingPatients";
import ExamInProgress from "./ExamInProgress";
import type { Appointment, Patient, MedicalRecord, PatientDetail } from "@/types";

interface DashboardTabProps {
  dashboardStats: { 
    totalAppointments: number; 
    completedAppointments: number; 
    waitingAppointments: number 
  };
  appointments: Appointment[];
  waitingPatients: Patient[];
  medicalRecords: MedicalRecord[];
  currentDoctor: { 
    FullName: string; 
    specialty: { SpecialtyName: string };
    id?: number;
    email?: string;
    phone?: string;
  };
  getPriorityColor: (p: string) => string;
  getPriorityText: (p: string) => string;
  onViewPatientDetail: (patient: Patient) => void;
  handleStartExam: (patient: PatientDetail) => void;
}

export default function DashboardTab({
  dashboardStats,
  appointments,
  waitingPatients,
  medicalRecords,
  currentDoctor,
  getPriorityColor,
  getPriorityText,
  onViewPatientDetail,
  handleStartExam,
}: DashboardTabProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "checked_in": return { 
        cls: "bg-green-100 text-green-800", 
        icon: "✓", 
        text: "Đã check-in" 
      };
      case "in_progress": return { 
        cls: "bg-blue-100 text-blue-800", 
        icon: "↻", 
        text: "Đang khám" 
      };
      case "completed": return { 
        cls: "bg-gray-100 text-gray-800", 
        icon: "✓", 
        text: "Hoàn thành" 
      };
      default: return { 
        cls: "bg-yellow-100 text-yellow-800", 
        icon: "⏳", 
        text: "Chờ" 
      };
    }
  };

  // Tính toán các giá trị cần thiết
  const inProgressCount = appointments.filter(a => a.status === "in_progress").length;
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(appt => 
    appt.appointmentTime?.startsWith?.(today) || true
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chào mừng quay lại, <span className="text-blue-600">BS. {currentDoctor.FullName}</span>!
            </h1>
            <p className="text-gray-600 mt-2">
              Chuyên khoa: <span className="font-semibold text-gray-800">{currentDoctor.specialty?.SpecialtyName || "Nội tổng quát"}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'numeric', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="text-right">
              <div className="text-sm text-gray-500">Số bệnh nhân hôm nay</div>
              <div className="text-3xl font-bold text-blue-600">{todayAppointments.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardStats 
        stats={{
          totalAppointments: dashboardStats.totalAppointments,
          completed: dashboardStats.completedAppointments,
          waiting: dashboardStats.waitingAppointments,
          inProgress: inProgressCount
        }} 
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Appointments (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          <TodayAppointments
            appointments={appointments}
            waitingPatients={waitingPatients}
            medicalRecords={medicalRecords}
            searchTerm=""
            setSearchTerm={() => {}}
            statusFilter="all"
            setStatusFilter={() => {}}
            currentPage={1}
            setCurrentPage={() => {}}
            itemsPerPage={10}
            totalPages={Math.ceil(appointments.length / 10)}
            paginatedAppointments={appointments.slice(0, 10)}
            getStatusInfo={getStatusInfo}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
            onViewPatientDetail={onViewPatientDetail}
            handleStartExam={handleStartExam}
            handleViewAppointmentDetail={(id) => {
              const patient = waitingPatients.find(p => p.id === id);
              if (patient) onViewPatientDetail(patient);
            }}
          />
        </div>

        {/* Right Column - Sidebar (1/3 width) */}
        <div className="space-y-6">
          <ExamInProgress
            appointments={appointments}
            waitingPatients={waitingPatients}
            medicalRecords={medicalRecords}
            currentDoctor={currentDoctor}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
            handleStartExam={handleStartExam}
          />

          <WaitingPatients
            waitingPatients={waitingPatients}
            medicalRecords={medicalRecords}
            getStatusInfo={getStatusInfo}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
            handleViewPatientDetail={(id) => {
              const patient = waitingPatients.find(p => p.id === id);
              if (patient) onViewPatientDetail(patient);
            }}
            handleStartExam={(patientDetail) => {
              // Convert Patient to PatientDetail
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
              };
              handleStartExam(detail);
            }}
          />
        </div>
      </div>
    </div>
  );
}