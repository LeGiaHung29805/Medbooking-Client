
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

// Thêm các interface mới
export interface Doctor {
  id: number
  FullName: string
  specialty: Specialty
  email?: string
  phone?: string
  avatar?: string
}

export interface Specialty {
  id: number
  SpecialtyName: string
  description?: string
}

export interface DashboardStats {
  totalAppointments: number
  completedAppointments: number
  waitingAppointments: number
  inProgress: number
  cancelled: number
  revenue?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Enum cho status
export enum AppointmentStatus {
  WAITING = "waiting",
  CHECKED_IN = "checked_in",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export enum PriorityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EMERGENCY = "emergency"
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

// existing interfaces
export interface Appointment {
  id: number
  patientId: number  
  patientName: string
  patientAge: number
  patientPhone: string
  symptoms: string
  appointmentTime: string
  status: AppointmentStatus  
  checkInTime: string
  doctorId?: number
  notes?: string
}

export interface Patient {
  id: number
  patientId?: number  
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  phone: string
  symptoms: string
  appointmentTime: string
  status: AppointmentStatus  
  checkInTime: string
  priority: PriorityLevel 
  allergies: string[]
  medicalHistory: string[]
  bloodType?: string
  insuranceId?: string
}

// Type mới cho Schedule
export interface ScheduleDay {
  id: number;
  date: string;
  appointments: number;
  timeSlots: string[];
  appointmentsList: Appointment[];
}

export interface TimeSlot {
  start: string;
  end: string;
  booked: boolean;
  appointmentId?: number;
}

export interface WeeklySchedule {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: ScheduleDay[];
}

export interface AppointmentFilter {
  status: "all" | "waiting" | "in_progress" | "completed" | "checked_in" | "cancelled";
  priority: "all" | "low" | "medium" | "high" | "emergency";
  dateRange?: {
    start: Date;
    end: Date;
  };
}
export interface PatientDetail extends Patient {
  medicalRecords: MedicalRecord[]
  vitalSigns?: VitalSigns
}
