// Tên file: lib/model.ts

// === 1. CÁC ĐỐI TƯỢNG CƠ BẢN ===

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

export interface MedicalRecord {
  RecordID: number;
  AppointmentID: number;
  PatientID: number;
  DoctorID: number;
  Diagnosis: string;
  Notes: string | null;
  created_at: string;
  exam_results?: ExamResult[]; // Danh sách file đính kèm
  doctor?: Doctor; // Bác sĩ khám
  patient?: User; // Bệnh nhân
}

export interface Appointment {
  AppointmentID: number;
  PatientID: number;
  DoctorID: number;
  SlotID: number | null;
  StartTime: string;
  Status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "CheckedIn";
  InitialSymptoms: string | null;
  CancellationReason: string | null;
  file_path: string | null; // File bệnh nhân gửi khi đặt lịch

  // Các quan hệ lồng nhau (tùy API gọi)
  patient?: User;
  doctor?: Doctor;
  medical_record?: MedicalRecord;
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

// === 2. CÁC ĐỐI TƯỢNG PHẢN HỒI (RESPONSE) ===

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