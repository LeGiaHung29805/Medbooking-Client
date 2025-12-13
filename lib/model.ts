
export interface User {
  UserID: number;
  FullName: string;
  PhoneNumber: string;
  Email: string | null;
  Username: string;
  Role: "BenhNhan" | "BacSi" | "NhanVien" | "QuanTriVien";
  Status: "HoatDong" | "Khoa";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  DateOfBirth?: string | null;
  Gender?: string | null;
  Address?: string | null;
}

export interface Service {
  ServiceID: number;
  SpecialtyID: number;
  ServiceName: string;
  Description: string | null;
  EstimatedDuration: number;
  Price: number;
  imageURL: string | null;
}

export interface Specialty {
  SpecialtyID: number;
  SpecialtyName: string;
  Description: string | null;
  imageURL: string | null;
  services?: Service[];
}

export interface Doctor {
  DoctorID: number;
  SpecialtyID: number;
  Degree: string;
  YearsOfExperience: number;
  ProfileDescription: string | null;
  imageURL: string | null; 
  user: User; 
  specialty: Specialty;
}

export interface AvailabilitySlot {
  SlotID: number;
  DoctorID: number;
  StartTime: string; // Format: "YYYY-MM-DD HH:mm:ss"
  EndTime: string;
  Status: "Available" | "Booked";
}

export interface ExamResult {
  ResultID: number;
  RecordID: number;
  FilePath: string; // Đường dẫn file kết quả
  FileType: string;
  FileDescription: string | null;
  created_at: string;
}

export interface Appointment {
  AppointmentID: number;
  PatientID: number;
  DoctorID: number;
  SlotID: number | null;
  ServiceID: number;
  StartTime: string;
  Status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "CheckedIn";
  InitialSymptoms: string | null;
  CancellationReason: string | null;
  file_path: string | null;
  Type: 'New' | 'FollowUp';
  // Các quan hệ lồng nhau
  patient?: User;
  doctor?: Doctor;
  medical_record?: MedicalRecord;
  //Thông tin lịch khám
  service?: Service;
}

export interface Feedback {
  FeedbackID: number;
  PatientID: number;
  AppointmentID: number;
  Rating: number;
  Comment: string | null;
  created_at: string;
  patient?: User;
}

// 2. CÁC ĐỐI TƯỢNG PHẢN HỒI (RESPONSE)

export interface LoginResponse {
  user: User;
  token: string;
}

export interface MessageResponse {
  message: string;
}

export interface DashboardStats {
  today_appointments_count: number;
  pending_appointments_count: number;
  new_patients_count: number;
  total_doctors_count: number;
  // (Dành cho Bác sĩ)
  total_appointments_count?: number;
  completed_appointments_count?: number;
  waiting_appointments_count?: number;
}
export interface Notification {
  NotificationID: number;
  UserID: number;
  Title?: string; 
  Content: string;
  NotificationType: string; // 'System', 'Reminder', 'Warning'...
  Channel: string;          // 'In-App', 'Email', 'SMS'
  Status: string;           // 'Unread', 'Read'
  created_at: string;
  updated_at: string;
}
//nâng cấp thêm về sau
export interface FamilyMember extends User{
  RelationType?: string;
  LinkedAt?: string;
}


// Type cho Doctor

export interface MedicalRecord {
  RecordID: number;
  AppointmentID: number;
  PatientID: number;
  DoctorID: number;
  Diagnosis: string;
  Notes: string | null;
  created_at: string;
  exam_results?: ExamResult[];
  doctor?: Doctor;
  patient?: User;
  // Thêm các field mới
  patientName?: string;
  age?: number;
  treatment?: string;
  prescriptions?: Prescription[];
  tests?: string[];
  status?: "completed" | "pending";
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


// CẦN THÊM CÁC INTERFACE:
export interface ScheduleSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: number;
}

export interface AppointmentDetail {
  id: number;
  patientId: number;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  symptoms: string;
  appointmentTime: string;
  status: string;
  priority: string;
  medicalHistory: string[];
  allergies: string[];
  previousRecords: MedicalRecord[];
}

export interface ExamResult {
  id: number;
  recordId: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}