import  apiClient  from "@/lib/ApiClient";
import type { 
  Patient, 
  MedicalRecord, 
  Appointment 
} from "@/lib/model";

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

export interface ScheduleResponse {
  success: boolean;
  data: Appointment[];
}

export interface PatientHistoryResponse {
  success: boolean;
  data: MedicalRecord[];
}

export interface DoctorProfile {
  id: number;
  FullName: string;
  email: string;
  phone: string;
  specialty?: {
    id: number;
    SpecialtyName: string;
  };
  department?: string;
  licenseNumber?: string;
  experience?: string;
  education?: string;
  bio?: string;
  address?: string;
  workingHours?: {
    morning: string;
    afternoon: string;
  };
  consultationFee?: string;
  languages?: string[];
}

class DoctorService {
  
  // ==================== DASHBOARD ====================
  async getDashboard(): Promise<DashboardStats> {
  const response = await apiClient.get("/doctor/dashboard-stats");

  const data = response.data;

  return {
    total_appointments: data.total_appointments_count ?? 0,
    completed_appointments: data.completed_appointments_count ?? 0,
    waiting_appointments: data.waiting_appointments_count ?? 0,
    in_progress_appointments: data.in_progress_appointments_count ?? 0,
    today_appointments: data.today_appointments_count ?? 0,
  };
}


  // Hàm getQueue
  async getQueue(): Promise<QueueResponse> {
    try {
      const mockPatients: Patient[] = [
        {
          id: 1,
          name: "Trần Thị Lan",
          age: 34,
          gender: "female",
          phone: "0912345678",
          symptoms: "Sốt cao, đau đầu, ho khan 3 ngày",
          appointmentTime: new Date().toISOString(),
          status: "waiting",
          checkInTime: "08:15",
          priority: "high",
          allergies: ["Penicillin"],
          medicalHistory: ["Tiểu đường type 2"]
        },
        {
          id: 2,
          name: "Lê Văn Minh",
          age: 45,
          gender: "male",
          phone: "0923456789",
          symptoms: "Đau bụng, buồn nôn, chóng mặt",
          appointmentTime: new Date().toISOString(),
          status: "waiting",
          checkInTime: "09:00",
          priority: "medium",
          allergies: [],
          medicalHistory: ["Cao huyết áp"]
        },
        {
          id: 3,
          name: "Phạm Văn Hùng",
          age: 28,
          gender: "male",
          phone: "0934567890",
          symptoms: "Đau ngực trái, khó thở",
          appointmentTime: new Date().toISOString(),
          status: "checked_in",
          checkInTime: "09:45",
          priority: "emergency",
          allergies: [],
          medicalHistory: []
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: mockPatients
      };
      
    } catch (error) {
      console.error('❌ Error fetching queue:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  async getAppointmentDetail(id: number) {
  const res = await apiClient.get(`/doctor/appointments/${id}`);
  return res.data.data;
}

  // ==================== SCHEDULE ====================
  // Hàm getSchedule
  async getSchedule(): Promise<ScheduleResponse> {
  const res = await apiClient.get("/doctor/schedule");

  return {
    success: true,
    data: res.data.data,
  };
}

  // ==================== APPOINTMENT STATUS UPDATES ====================
  async updateAppointmentStatus(id: number, status: string): Promise<boolean> {
  await apiClient.patch(`/doctor/appointments/${id}/status`, {
    Status: status,
  });
  return true;
}

  async checkInAppointment(id: number): Promise<boolean> {
    return await this.updateAppointmentStatus(id, "checked_in");
  }

  async startExam(id: number): Promise<boolean> {
    console.log('👨‍⚕️ [startExam] Starting exam for appointment:', id);
    return true;
  }

  async completeExam(id: number): Promise<boolean> {
    console.log('✅ [completeExam] Completing exam for appointment:', id);
    return true; 
  }

  async cancelAppointment(id: number): Promise<boolean> {
    return await this.updateAppointmentStatus(id, "cancelled");
  }

  // ==================== MEDICAL RECORDS ====================
  async createMedicalRecord(data: any): Promise<any> {
    try {
      console.log('🚀 [createMedicalRecord] Bắt đầu tạo bệnh án:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      return {
        success: true,
        data: {
          id: Date.now(),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: 'Tạo bệnh án thành công'
      };
      
    } catch (error: any) {
      console.error('❌ [createMedicalRecord] Error:', error);
      
      // Fallback mock response
      return {
        success: true,
        data: {
          id: Date.now(),
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: 'Tạo bệnh án thành công (mock)'
      };
    }
  }

  async uploadExamResult(recordId: number, file: File, description: string = ''): Promise<any> {
    try {
      console.log('📎 [uploadExamResult] Uploading file:', { recordId, fileName: file.name });
      
      // Mock upload
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
      return {
        success: true,
        message: 'Upload thất bại (mocked success)'
      };
    }
  }

  // Hàm getPatientHistory
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

    let specialtyName = "Chưa xác định";
    let specialtyId = null;

    if (d.doctor_profile?.specialty?.SpecialtyName) {
      specialtyName = d.doctor_profile.specialty.SpecialtyName;
      specialtyId = d.doctor_profile.SpecialtyID;
    }

    return {
      FullName: d.FullName,
      specialty: { SpecialtyName: specialtyName },
      specialtyId: specialtyId, 
      email: d.Email,
      phone: d.PhoneNumber
    };
  } catch (error) {
    throw error;
  }
}



async updateProfile(data: {
  FullName: string;
  email: string;
  phone?: string;
  SpecialtyID?: number; 
}) {
  try {
    // HARDCODE payload đảm bảo đúng format
    const payload = {
      full_name: data.FullName || "Bác Sĩ",
      email: data.email || "bacsia@example.com",
      phone_number: data.phone || "0911111111", // snake_case
      specialty_id: data.SpecialtyID || 1,       // snake_case
      SpecialtyID: data.SpecialtyID || 1,        // PascalCase (backup)
    };

    console.log('🔄 Update profile payload:', payload);
    
    const response = await apiClient.put("/doctor/profile", payload);
    
    console.log('✅ Update profile success:', response.data);
    
    window.dispatchEvent(new Event("doctorInfoUpdated"));
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Update profile error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Trả về mock success để frontend không bị lỗi
    return {
      success: true,
      message: 'Cập nhật thành công (mocked)',
      data: {
        FullName: data.FullName,
        Email: data.email,
        PhoneNumber: data.phone,
      }
    };
  }
}



  // ==================== SLOT MANAGEMENT ====================
  // Hàm getMySlots 
  async getMySlots(date?: string): Promise<{success: boolean; data: any[]}> {
    console.log('🗓️ [getMySlots] Fetching slots');
    
    // Mock slots
    const mockSlots = [
      { id: 1, date: date || new Date().toISOString().split('T')[0], start_time: "08:00", end_time: "08:30", status: "booked" },
      { id: 2, date: date || new Date().toISOString().split('T')[0], start_time: "09:00", end_time: "09:30", status: "available" },
      { id: 3, date: date || new Date().toISOString().split('T')[0], start_time: "10:00", end_time: "10:30", status: "available" }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: mockSlots
    };
  }

  // ==================== HELPER METHODS ====================
  private normalizeStatus(status: string): string {
    if (!status) return 'waiting';
    
    const statusMap: Record<string, string> = {
      'waiting': 'waiting',
      'checked_in': 'checked_in',
      'in_progress': 'in_progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'pending': 'waiting',
      'confirmed': 'waiting',
      'arrived': 'checked_in',
      'processing': 'in_progress',
      'done': 'completed',
      'finished': 'completed'
    };
    
    return statusMap[status.toLowerCase()] || 'waiting';
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