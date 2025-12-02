export interface Appointment {
  id: number
  patientName: string
  patientAge: number
  patientPhone: string
  symptoms: string
  appointmentTime: string
  status: "waiting" | "in_progress" | "completed" | "cancelled" | "checked_in"
  checkInTime: string
}

export interface Patient {
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

export interface MedicalRecord {
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

export interface PatientDetail {
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

export interface VitalSigns {
  bloodPressure: string
  heartRate: number
  temperature: number
  respiratoryRate: number
  spO2: number
  weight: number
  height: number
}

export interface MedicalExamFormData {
  diagnosis: string
  clinicalNotes: string
  currentSymptoms: string
  prescriptions: Prescription[]
  tests: string[]
  attachments: File[]
  vitalSigns: VitalSigns
}

export interface Prescription {
  medicine: string
  dosage: string
  frequency: string
}

export interface ScheduleDay {
  id: number
  date: string
  appointments: number
  timeSlots: string[]
  appointmentsList: Appointment[]
}