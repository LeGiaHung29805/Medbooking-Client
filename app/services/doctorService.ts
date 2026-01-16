import apiClient from "@/lib/ApiClient";
import type {
  Patient,
  MedicalRecord,
  Appointment
} from "@/lib/model";

// --- ENUM (Nên import từ model, nhưng khai báo tạm ở đây để tránh lỗi) ---
// import { AppointmentStatus } from "@/lib/model"; 
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T; 
  record?: T; 
}
export interface DashboardStats {
  total_appointments: number;
  completed_appointments: number;
  waiting_appointments: number;
  in_progress_appointments: number;
  today_appointments: number;
}

export interface QueueResponse {
  success: boolean;
  data: Patient[];
}
export interface UserProfileResponse {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Role: string;
  doctor: { 
    DoctorID: number;
    SpecialtyID: number;
    Degree: string | null;
    YearsOfExperience: string | number | null;
    ProfileDescription: string | null;
    specialty?: {
      SpecialtyName: string;
    };
  };
}
export interface ScheduleResponse {
  success: boolean;
  data: Appointment[];
}

export interface PatientHistoryResponse {
  success: boolean;
  data: MedicalRecord[];
}
export interface DoctorProfileDetail {
  DoctorID?: number;
  SpecialtyID?: number;
  Degree?: string | null;
  YearsOfExperience?: string | number | null;
  ProfileDescription?: string | null;
  imageURL?: string;
  specialty?: {
    SpecialtyID: number;
    SpecialtyName: string;
  };
}

// Định nghĩa dữ liệu trả về từ API (UserProfile)
export interface UserProfileResponse {
  id: number;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Role: string;
  // Cấu trúc lồng nhau gây ra lỗi ở Hình 1 và 2
  doctor_profile: DoctorProfileDetail; 
}
// export interface DoctorProfile {
//   id: number;
//   FullName: string;
//   email: string;
//   phone: string;
//   specialty?: {
//     SpecialtyID: number;
//     SpecialtyName: string;
//   };
//   department?: string;
//   licenseNumber?: string;
//   experience?: string;
//   education?: string;
//   bio?: string;
//   address?: string;
//   workingHours?: {
//     morning: string;
//     afternoon: string;
//   };
//   consultationFee?: string;
//   languages?: string[];
// }

const calculateAge = (dob: string | null | undefined): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

class DoctorService {

  async getDashboard(): Promise<DashboardStats> {
    const response = await apiClient.get("/doctor/dashboard-stats");

    console.log("Raw API Response:", response.data);

    const apiData = response.data.data || response.data;

    return {
      total_appointments: apiData.total_appointments_count ?? 0,
      completed_appointments: apiData.completed_appointments_count ?? 0,
      waiting_appointments: apiData.waiting_appointments_count ?? 0,
      in_progress_appointments: apiData.in_progress_appointments_count ?? 0,
      today_appointments: apiData.today_appointments_count ?? 0,
    };
  }


  async getQueue(): Promise<QueueResponse> {
    try {
      const response = await apiClient.get("/doctor/queue");
      const appointmentList = response.data.data || [];

      const mappedPatients: Patient[] = appointmentList.map((appt: any) => {
        // Lấy object bệnh nhân
        const p = appt.patient || {};
        return {
          id: appt.id || appt.AppointmentID,
          patientId: appt.PatientID || p.UserID || p.id || 0,
          name: p.FullName || p.name || "Không tên",
          phone: p.PhoneNumber || p.phone || "",

          age: calculateAge(p.Birthday || p.DoB),

          gender: p.Gender || p.gender || 'other',

          appointmentTime: appt.StartTime || appt.start_time,
          checkInTime: appt.updated_at,

          status: this.normalizeStatus(appt.Status),
          initialSymptoms: appt.InitialSymptoms || "Bệnh nhân không nhập triệu chứng",
          symptoms: appt.Reason || appt.Description || "",
          priority: appt.Priority || "medium",
          allergies: [],
          medicalHistory: []
        };
      });

      return {
        success: true,
        data: mappedPatients
      };

    } catch (error) {
      console.error("Lỗi getQueue:", error);
      return { success: false, data: [] };
    }
  }

  async getAppointmentDetail(id: number) {
    const res = await apiClient.get(`/doctor/appointments/${id}`);
    return res.data.data;
  }

  // SCHEDULE
  async getSchedule(): Promise<ScheduleResponse> {
    
    const response = await apiClient.get("/doctor/schedule");
    return response.data;
  }

  // APPOINTMENT STATUS UPDATES 
  async updateAppointmentStatus(id: number, status: string): Promise<boolean> {
    try {
      console.log(`[API] Đang gọi cập nhật status: ${status} cho ID ${id}`);
      const response = await apiClient.patch(`/doctor/appointments/${id}/status`, {
        Status: status,
        status: status
      });
      return response.data.success;
    } catch (error) {
      console.error(`Lỗi update status ${status}:`, error);
      return false;
    }
  }

  async checkInAppointment(id: number): Promise<boolean> {
    return await this.updateAppointmentStatus(id, "checked_in");
  }

  async startExam(id: number): Promise<boolean> {
    return await this.updateAppointmentStatus(id, 'InProgress'); 
  }

  async completeExam(id: number): Promise<boolean> {
    return await this.updateAppointmentStatus(id, 'Completed');
  }

  async cancelAppointment(id: number): Promise<boolean> {
    return await this.updateAppointmentStatus(id, "cancelled");
  }

  // ==================== MEDICAL RECORDS ====================
  async getMedicalRecords(): Promise<ApiResponse<MedicalRecord[]>> {
  try {
    
    const response = await apiClient.get("/doctor/medical-records", {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.data) {
      return {
        success: true,
        message: response.data.message || "Tải dữ liệu thành công",
        data: response.data.data || response.data 
      };
    }

    return { success: false, message: "Server không trả về dữ liệu" };

  } catch (error: any) {
    // Log lỗi chi tiết giống hàm Create để dễ debug
    if (error.response) {
      console.error('[API] Server trả về lỗi:', error.response.data);
      console.error('Status code:', error.response.status);
    } else {
      console.error('[API] Lỗi mạng/Kết nối:', error.message);
    }

    return { 
      success: false, 
      message: error.response?.data?.message || "Lỗi kết nối server khi tải bệnh án" 
    };
  }
}
  async createMedicalRecord(formData: FormData) {
  try {
    // Lưu ý: Khi gửi FormData, Axios sẽ tự động thiết lập 
    // Content-Type: multipart/form-data
    const response = await apiClient.post("/doctor/medical-records", formData);
    return response.data;
  } catch (error) {
    console.error("Lỗi createMedicalRecord service:", error);
    throw error;
  }
}
  async uploadExamResult(recordId: number, file: File, description: string = ''): Promise<any> {
    try {
      console.log('📎 [uploadExamResult] Uploading file:', { recordId, fileName: file.name });
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Upload thành công',
        data: {
          id: Date.now(),
          filename: file.name,
          url: `mock-url/${file.name}`
        }
      };
    } catch (error) {
      console.error('❌ Error uploading exam result:', error);
      return { success: true, message: 'Upload thất bại (mocked success)' };
    }
  }

  // ==================== PATIENT HISTORY ====================
  async getPatientHistory(patientId: number): Promise<PatientHistoryResponse> {
    const res = await apiClient.get(`/doctor/patient-history/${patientId}`);
    return {
      success: true,
      data: res.data.data,
    };
  }

  // ==================== PROFILE MANAGEMENT ====================
  async getMyProfile() {
  try {
    const response = await apiClient.get("/doctor/profile");
    const d = response.data.data;
    console.log("Dữ liệu gốc: ",d);
    const profileSource = d.doctor_profile || d.doctor;
    return {
      success: true, 
      data: {
        FullName: d.FullName,
        Email: d.Email,
        PhoneNumber: d.PhoneNumber,
        doctor_profile: {
          DoctorID: profileSource?.DoctorID,
          SpecialtyID: profileSource?.SpecialtyID,
          Degree: profileSource?.Degree || "Chưa cập nhật",
          YearsOfExperience: profileSource?.YearsOfExperience || 0,
          ProfileDescription: profileSource?.ProfileDescription || "Chưa có giới thiệu",
          imageURL: profileSource?.imageURL,
          specialty: profileSource?.specialty || { SpecialtyName: "Chưa xác định" }
        }
      }
    };
  } catch (error) {
    console.error("Lỗi getMyProfile:", error);
    return { success: false, data: null }; // Trả về success: false khi có lỗi
  }
}

  async updateProfile(data: {
  FullName: string;
  email: string;
  phone?: string;
  SpecialtyID?: number; 
  Degree?: string;
  YearsOfExperience?: number | string;
  ProfileDescription?: string;
}) {
  try {
    const payload = {
      full_name: data.FullName,
      email: data.email,
      phone_number: data.phone,
      SpecialtyID: data.SpecialtyID || 1, 
      specialty_id: data.SpecialtyID || 1,
      Degree: data.Degree,
      YearsOfExperience: data.YearsOfExperience,
      ProfileDescription: data.ProfileDescription,
    };

    const response = await apiClient.put("/doctor/profile", payload);
    return response.data;
  } catch (error: any) {
    throw error; 
  }
}

  // ==================== SLOT MANAGEMENT ====================
  async getMySlots(date?: string): Promise<{ success: boolean; data: any[] }> {
    console.log('🗓️ [getMySlots] Fetching slots');
    const mockSlots = [
      { id: 1, date: date || new Date().toISOString().split('T')[0], start_time: "08:00", end_time: "08:30", status: "booked" },
      { id: 2, date: date || new Date().toISOString().split('T')[0], start_time: "09:00", end_time: "09:30", status: "available" },
      { id: 3, date: date || new Date().toISOString().split('T')[0], start_time: "10:00", end_time: "10:30", status: "available" }
    ];
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: mockSlots };
  }

  // ==================== HELPER METHODS (ĐÃ SỬA LOGIC) ====================
  private normalizeStatus(status: string): string {
    if (!status) return 'waiting';

    const s = status.toLowerCase(); // Chuyển về chữ thường

    const statusMap: Record<string, string> = {
      // Nhóm WAITING
      'waiting': 'waiting',
      'pending': 'waiting',
      'confirmed': 'waiting',

      // Nhóm CHECKED_IN (Thêm case viết liền)
      'checked_in': 'checked_in', // Frontend style
      'checkedin': 'checked_in',  // Backend style (Quan trọng!)
      'arrived': 'checked_in',

      // Nhóm IN_PROGRESS
      'in_progress': 'in_progress',
      'inprogress': 'in_progress', // Thêm case viết liền
      'processing': 'in_progress',

      // Nhóm COMPLETED
      'completed': 'completed',
      'done': 'completed',
      'finished': 'completed',

      // Nhóm CANCELLED
      'cancelled': 'cancelled',
      'canceled': 'cancelled'
    };

    return statusMap[s] || 'waiting';
  }

  private normalizePriority(priority: string): string {
    if (!priority) return 'medium';

    const priorityMap: Record<string, string> = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'emergency': 'emergency',
      'normal': 'low',
      'urgent': 'high',
      'critical': 'emergency'
    };

    return priorityMap[priority.toLowerCase()] || 'medium';
  }
}

// Utility functions
export const safeParseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const formatTime = (dateString: string | null | undefined): string => {
  const date = safeParseDate(dateString);
  if (!date) return "Chưa có giờ";
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (dateString: string | null | undefined): string => {
  const date = safeParseDate(dateString);
  if (!date) return "Chưa có ngày";
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string | null | undefined): string => {
  const date = safeParseDate(dateString);
  if (!date) return "Chưa có ngày giờ";
  return date.toLocaleString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const doctorService = new DoctorService();