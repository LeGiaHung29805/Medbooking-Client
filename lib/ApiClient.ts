// Tên file: lib/ApiClient.ts

import axios from "axios";
import * as Model from "./model";

// 1. Cấu hình URL Backend
// (Đảm bảo server Laravel đang chạy ở cổng này)
const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json", // Bắt buộc để nhận lỗi JSON
  },
});

// 2. Hàm lấy Token từ LocalStorage
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    // Kiểm tra môi trường Browser
    const token = localStorage.getItem("api_token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return {};
};

// ==========================================
// === 1. NHÓM XÁC THỰC (AUTH) ===
// ==========================================

export const register = async (
  data: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const login = async (data: FormData): Promise<Model.LoginResponse> => {
  const response = await apiClient.post("/login", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // Lưu token tự động khi login thành công
  if (response.data.token && typeof window !== "undefined") {
    localStorage.setItem("api_token", response.data.token);
    localStorage.setItem("user_role", response.data.user.Role); // Lưu Role để phân quyền UI
  }
  return response.data;
};

export const logout = async (): Promise<Model.MessageResponse> => {
  const response = await apiClient.post(
    "/logout",
    {},
    { headers: getAuthHeaders() }
  );
  if (typeof window !== "undefined") {
    localStorage.removeItem("api_token");
    localStorage.removeItem("user_role");
  }
  return response.data;
};

// ==========================================
// === 2. NHÓM CÔNG KHAI (PUBLIC) ===
// ==========================================

export const getSpecialties = async (
  search?: string
): Promise<Model.Specialty[]> => {
  const params = search ? { search } : {};
  const response = await apiClient.get("/specialties", { params });
  return response.data;
};

export const getDoctors = async (): Promise<Model.Doctor[]> => {
  const response = await apiClient.get("/doctors");
  return response.data;
};

export const getDoctorDetails = async (id: number): Promise<Model.Doctor> => {
  const response = await apiClient.get(`/doctors/${id}`);
  return response.data;
};

// Lấy lịch trống theo ID Bác sĩ
export const getDoctorAvailability = async (
  doctorId: number
): Promise<Model.AvailabilitySlot[]> => {
  const response = await apiClient.get(`/doctors/${doctorId}/availability`);
  return response.data;
};

// Lấy lịch trống theo ID Chuyên khoa (API Cầu nối)
export const getSpecialtyAvailability = async (
  specialtyId: number
): Promise<Model.AvailabilitySlot[]> => {
  const response = await apiClient.get(
    `/specialties/${specialtyId}/availability`
  );
  return response.data;
};

// ==========================================
// === 3. NHÓM BỆNH NHÂN (PATIENT) ===
// ==========================================

export const getMe = async (): Promise<Model.User> => {
  const response = await apiClient.get("/user", { headers: getAuthHeaders() });
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<Model.User> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await apiClient.post("/user/upload-avatar", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data.user;
};

export const getMyAppointments = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/my-appointments", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const bookAppointment = async (
  slotId: number,
  symptoms: string,
  file?: File
): Promise<any> => {
  const formData = new FormData();
  formData.append("SlotID", slotId.toString());
  if (symptoms) formData.append("InitialSymptoms", symptoms);
  if (file) formData.append("file", file);

  const response = await apiClient.post("/appointments", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const cancelAppointment = async (id: number): Promise<any> => {
  const response = await apiClient.patch(
    `/appointments/${id}/cancel`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ==========================================
// === 4. NHÓM BÁC SĨ (DOCTOR) ===
// ==========================================

export const doctorGetDashboard = async (): Promise<Model.DashboardStats> => {
  const response = await apiClient.get("/doctor/dashboard-stats", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const doctorGetSchedule = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/doctor/my-schedule", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const doctorGetQueue = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/doctor/queue", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const doctorCreateSlot = async (
  start: string,
  end: string
): Promise<any> => {
  const formData = new FormData();
  formData.append("StartTime", start);
  formData.append("EndTime", end);
  const response = await apiClient.post("/doctor/availability", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const doctorDeleteSlot = async (id: number): Promise<void> => {
  await apiClient.delete(`/doctor/availability/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const doctorCreateMedicalRecord = async (
  formData: FormData
): Promise<any> => {
  const response = await apiClient.post("/doctor/medical-records", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const doctorUploadResult = async (
  recordId: number,
  file: File,
  desc: string
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", desc);
  const response = await apiClient.post(
    `/doctor/medical-records/${recordId}/upload-result`,
    formData,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// ==========================================
// === 5. NHÓM STAFF & ADMIN ===
// ==========================================

export const getStaffDashboard = async (): Promise<Model.DashboardStats> => {
  const response = await apiClient.get("/staff/dashboard-stats", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const confirmAppointment = async (id: number): Promise<any> => {
  const response = await apiClient.patch(
    `/staff/appointments/${id}/confirm`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const checkInAppointment = async (id: number): Promise<any> => {
  const response = await apiClient.patch(
    `/staff/appointments/${id}/check-in`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAllAppointments = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/admin/all-appointments", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const adminCreateDoctor = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post("/admin/doctors", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Dùng Method Spoofing (_method: PUT) để tránh lỗi form-data của PHP
export const adminUpdateDoctor = async (
  id: number,
  formData: FormData
): Promise<any> => {
  formData.append("_method", "PUT");
  const response = await apiClient.post(`/admin/doctors/${id}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const adminUploadDoctorImage = async (
  id: number,
  file: File
): Promise<any> => {
  const formData = new FormData();
  formData.append("imageURL", file);
  const response = await apiClient.post(
    `/admin/doctors/${id}/upload-image`,
    formData,
    {
      headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
