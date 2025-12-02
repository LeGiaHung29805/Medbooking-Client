"use client";

import { useState, useEffect } from "react";
import DashboardTab from "./DashboardTab";
import PatientDetailModal from "./PatientDetailModal";
import MedicalExamForm from "./MedicalExamForm";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

import {
  doctorGetDashboard,
  doctorGetQueue,
  getDoctorMyMedicalRecords,
} from "@/lib/ApiClient";

import type { PatientDetail, MedicalRecord, Appointment, Patient } from "./types";

export default function DoctorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [currentExamPatient, setCurrentExamPatient] = useState<PatientDetail | null>(null);

  const doctorInfo = {
    name: "Nguyễn Văn A",
    specialty: "Nội tổng quát",
    email: "nguyenvana@hospital.com",
    phone: "0901234567",
  };

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "emergency": return "CẤP CỨU";
      case "high": return "ƯU TIÊN CAO";
      case "medium": return "Trung bình";
      default: return "Thấp";
    }
  };

  // === LOAD DATA ===
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [dashRes, queueRes, recordsRes] = await Promise.all([
          doctorGetDashboard(),
          doctorGetQueue(),
          getDoctorMyMedicalRecords(),
        ]);

        const dashData = dashRes as any;
        const queueData = queueRes as any;
        const recordsData = recordsRes as any;

        setAppointments((dashData?.appointments || dashData?.today_appointments ? [] : []) as Appointment[]);

        const patients = Array.isArray(queueData)
          ? queueData
          : queueData?.patients || queueData || [];

        setWaitingPatients(patients as Patient[]);

        const records = Array.isArray(recordsData) ? recordsData : recordsData || [];
        setMedicalRecords(records as MedicalRecord[]);

      } catch (err) {
        console.log("Backend chưa chạy → dùng mock data");
        // Vẫn giữ mock để không crash
        setWaitingPatients([
          {
            id: 1,
            name: "Trần Thị Lan",
            age: 34,
            gender: "female",
            phone: "0901234567",
            symptoms: "Ho, sốt 3 ngày",
            appointmentTime: "09:00",
            status: "checked_in",
            checkInTime: "08:50",
            priority: "high",
            allergies: ["Penicillin"],
            medicalHistory: ["Tiểu đường type 2"],
          },
        ]);
        setMedicalRecords([
          {
            id: 1,
            patientName: "Trần Thị Lan",
            age: 34,
            diagnosis: "Viêm họng cấp",
            treatment: "Kháng sinh 5 ngày",
            prescriptions: [
              { medicine: "Amoxicillin", dosage: "500mg", frequency: "3 lần/ngày" },
            ],
            tests: [],
            date: "2025-04-02",
            status: "completed",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleStartExam = (patient: PatientDetail) => {
    setCurrentExamPatient(patient);
    setShowExamForm(true);
    setShowPatientModal(false);
  };

  const handleCompleteExam = () => {
    alert("Khám thành công! Đã lưu bệnh án.");
    setShowExamForm(false);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <>
      
      <DashboardTab
        appointments={appointments}
        waitingPatients={waitingPatients}
        medicalRecords={medicalRecords}
        currentDoctor={{
          FullName: doctorInfo.name,
          specialty: { SpecialtyName: doctorInfo.specialty },
        }}
        getPriorityColor={getPriorityColor}
        getPriorityText={getPriorityText}
        handleStartExam={handleStartExam}
      />

      {/* Modal chi tiết bệnh nhân */}
      {showPatientModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setShowPatientModal(false)}
          onStartExam={handleStartExam}
          getPriorityColor={getPriorityColor}
          getPriorityText={getPriorityText}
        />
      )}

      {/* Form khám bệnh */}
      {showExamForm && currentExamPatient && (
        <MedicalExamForm
          patient={currentExamPatient}
          onClose={() => setShowExamForm(false)}
          onComplete={handleCompleteExam}
        />
      )}
    </>
  );
}