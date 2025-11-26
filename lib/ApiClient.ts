
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

export const getDoctorDetails = async (id: number): Promise<Model.Doctor> => {
  const response = await apiClient.get(`/doctors/${id}`);
  return response.data;
};
export const getDoctors = async (
  search?: string,
  specialtyId?: number
): Promise<Model.Doctor[]> => {
  // 1. Định nghĩa rõ kiểu: object này có thể có key 'search' và 'specialty_id'
  const params: { search?: string; specialty_id?: number } = {};

  if (search) params.search = search;
  if (specialtyId) params.specialty_id = specialtyId; // Backend cần key này

  const response = await apiClient.get("/doctors", { params });
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
//Lấy danh sách bác sĩ đã từng khám
export const getMyDoctors = async (): Promise<Model.Doctor[]> => {
  const response = await apiClient.get("/my-doctors", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
export const bookAppointment = async (
  slotId: number,
  symptoms: string,
  file?: File
): Promise<Model.MessageResponse> => {
  const formData = new FormData();
  formData.append("SlotID", slotId.toString());
  if (symptoms) formData.append("InitialSymptoms", symptoms);
  if (file) formData.append("file", file);

  const response = await apiClient.post("/appointments", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const cancelAppointment = async (
  id: number
): Promise<Model.MessageResponse> => {
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
): Promise<Model.MessageResponse> => {
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
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/doctor/medical-records", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const doctorUploadResult = async (
  recordId: number,
  file: File,
  desc: string
): Promise<Model.MessageResponse> => {
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

export const confirmAppointment = async (
  id: number
): Promise<Model.MessageResponse> => {
  const response = await apiClient.patch(
    `/staff/appointments/${id}/confirm`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const checkInAppointment = async (
  id: number
): Promise<Model.MessageResponse> => {
  const response = await apiClient.patch(
    `/staff/appointments/${id}/check-in`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getAllAppointments = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/staff/all-appointments", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const adminCreateDoctor = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/doctors", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Dùng Method Spoofing (_method: PUT) để tránh lỗi form-data của PHP
export const adminUpdateDoctor = async (
  id: number,
  formData: FormData
): Promise<Model.MessageResponse> => {
  formData.append("_method", "PUT");
  const response = await apiClient.post(`/admin/doctors/${id}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const adminUploadDoctorImage = async (
  id: number,
  file: File
): Promise<Model.MessageResponse> => {
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
export const adminDeleteDoctor = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/doctors/${id}`, {
    headers: getAuthHeaders(),
  });
};
// ==========================================
// === 6. CÁC API BỔ SUNG (CHO ADMIN & TRA CỨU) ===
// ==========================================

// --- Quản lý Tài khoản (Admin) ---
export const adminGetUsers = async (
  role?: string,
  search?: string
): Promise<Model.User[]> => {
  const params = { role, search };
  const response = await apiClient.get("/admin/users", {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

export const adminUpdateUser = async (
  id: number,
  formData: FormData // <--- Thay đổi từ Object sang FormData
): Promise<Model.MessageResponse> => {
  // Thêm method spoofing để Laravel hiểu đây là PUT khi dùng FormData
  formData.append("_method", "PUT");

  const response = await apiClient.post(`/admin/users/${id}`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data", // Báo cho server biết đây là form data
    },
  });
  return response.data;
};

// --- Quản lý Chuyên khoa (Admin) ---
export const adminCreateSpecialty = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/specialties", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const adminUpdateSpecialty = async (
  id: number,
  formData: FormData
): Promise<Model.MessageResponse> => {
  formData.append("_method", "PUT");
  const response = await apiClient.post(`/admin/specialties/${id}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const adminDeleteSpecialty = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/specialties/${id}`, {
    headers: getAuthHeaders(),
  });
};

// --- Quản lý Dịch vụ (Admin) ---
export const adminCreateService = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/services", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const adminDeleteService = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/services/${id}`, {
    headers: getAuthHeaders(),
  });
};

// --- Tra cứu & Lịch sử (Bác sĩ / Admin) ---
export const getDoctorMyMedicalRecords = async (): Promise<
  Model.MedicalRecord[]
> => {
  const response = await apiClient.get("/doctor/my-medical-records", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getPatientHistory = async (
  patientId: number
): Promise<Model.MedicalRecord[]> => {
  const response = await apiClient.get(`/doctor/patient-history/${patientId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getFeedbacks = async (): Promise<Model.Feedback[]> => {
  const response = await apiClient.get("/staff/feedbacks", {
    headers: getAuthHeaders(),
  }); // Admin/Staff dùng chung
  return response.data;
};
export const adminGetFeedbacks = async (): Promise<Model.Feedback[]> => {
  const response = await apiClient.get("/admin/feedbacks", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
export const getAllMedicalRecords = async (
  patientId?: number
): Promise<Model.MedicalRecord[]> => {
  const params = patientId ? { patient_id: patientId } : {};
  const response = await apiClient.get("/admin/medical-records", {
    headers: getAuthHeaders(),
    params,
  });
  return response.data;
};

export const getMedicalRecordDetail = async (
  id: number
): Promise<Model.MedicalRecord> => {
  const response = await apiClient.get(`/admin/medical-records/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const adminDeleteMedicalRecord = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/medical-records/${id}`, {
    headers: getAuthHeaders(),
  });
};
export const getAllServices = async (
  search?: string
): Promise<Model.Service[]> => {
  const params = search ? { search } : {};
  const response = await apiClient.get("/services", { params }); // Hoặc /admin/services tùy route backend
  return response.data;
};
export const adminUpdateService = async (
  id: number,
  formData: FormData
): Promise<Model.MessageResponse> => {
  formData.append("_method", "PUT"); // Laravel Method Spoofing
  const response = await apiClient.post(`/admin/services/${id}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
// --- Bổ sung API ---

// Bệnh nhân tự sửa hồ sơ
export const updateProfile = async (
  data: any
): Promise<Model.MessageResponse> => {
  // Dùng method PUT (hoặc POST + _method:PUT nếu muốn gửi form-data đồng bộ)
  // Ở đây ta dùng JSON cho đơn giản vì không có file
  const response = await apiClient.put("/user/profile", data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const submitFeedback = async (data: {
  AppointmentID?: number | null;
  TargetType: 'Doctor' | 'System';
  Rating: number;
  Comment: string;
}): Promise<Model.MessageResponse> => {
  
  // TRƯỜNG HỢP 1: Đánh giá Bác sĩ (Gắn với lịch hẹn cụ thể)
  if (data.TargetType === 'Doctor' && data.AppointmentID) {
    const response = await apiClient.post(
      `/appointments/${data.AppointmentID}/feedback`,
      {
        Rating: data.Rating,
        Comment: data.Comment,
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  // TRƯỜNG HỢP 2: Đánh giá Hệ thống (Không gắn lịch hẹn)
  else if (data.TargetType === 'System') {
    const response = await apiClient.post(
      '/system-feedback', 
      {
        Rating: data.Rating,
        Comment: data.Comment,
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  throw new Error("Dữ liệu đánh giá không hợp lệ (Thiếu ID lịch hẹn hoặc sai loại).");
};
// ==========================================
// === 8. QUẢN LÝ NGƯỜI DÙNG (ADMIN) ===
// ==========================================

// Lấy danh sách người dùng (Có tìm kiếm)

// Lấy chi tiết 1 người dùng
export const adminGetUserDetail = async (id: number): Promise<Model.User> => {
  const response = await apiClient.get(`/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Tạo Bệnh nhân mới (Dùng cho trang quản lý User nếu muốn tạo nhanh)
// (Lưu ý: Để tạo Bác sĩ, hãy dùng adminCreateDoctor ở phần trên)
export const adminCreatePatient = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/patients", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật người dùng (Sửa lại để nhận FormData => Hỗ trợ upload ảnh & Method Spoofing)

// Xóa người dùng (Dùng API xóa bệnh nhân - Vì UserManagementController chưa có hàm destroy)
// Nếu xóa Bác sĩ, nên dùng adminDeleteDoctor.
// Ở đây ta tạm dùng endpoint của patients cho các user thông thường.
export const adminDeleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/patients/${id}`, {
    headers: getAuthHeaders(),
  });
};
export const adminCreateUser = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/users", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
// [UPDATE] Hủy lịch hẹn Staff/Admin (Dùng Route của Staff)
export const adminCancelAppointment = async (
  id: number,
  reason: string
): Promise<Model.MessageResponse> => {
  const response = await apiClient.patch(
    `/staff/appointments/${id}/cancel`,
    { reason },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
// Lấy lịch làm việc của 1 bác sĩ (Public hoặc Staff đều dùng được)
// Đã có hàm getDoctorAvailability ở trên, có thể dùng lại.

// ==========================================
// === 7. QUẢN LÝ LỊCH LÀM VIỆC (ADMIN/STAFF) ===
// ==========================================

// Lấy lịch làm việc của 1 bác sĩ (Đã có - giữ nguyên)
// export const getDoctorAvailability ...

// [MỚI] Admin/Staff tạo slot cho một bác sĩ cụ thể
export const adminCreateSlot = async (
  doctorId: number,
  start: string,
  end: string
): Promise<Model.AvailabilitySlot> => {
  const formData = new FormData();
  formData.append("DoctorID", doctorId.toString()); // Admin phải chọn Bác sĩ
  formData.append("StartTime", start); // Format: YYYY-MM-DD HH:mm
  formData.append("EndTime", end); // Format: YYYY-MM-DD HH:mm

  // Gọi vào route của Staff (Admin dùng chung được)
  const response = await apiClient.post("/staff/availability", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data.slot || response.data; // Trả về object slot vừa tạo
};

// [MỚI] Admin/Staff xóa slot
export const adminDeleteSlot = async (slotId: number): Promise<void> => {
  // Gọi vào route của Staff
  await apiClient.delete(`/staff/availability/${slotId}`, {
    headers: getAuthHeaders(),
  });
};

// ... các hàm khác

// [MỚI] Cập nhật thông tin Bệnh nhân (JSON - Method PUT chuẩn)
// Dùng hàm này thay cho adminUpdateUser khi sửa thông tin bệnh nhân cụ thể
export const adminUpdatePatient = async (
  id: number,
  data: any // Object chứa FullName, Email, v.v.
): Promise<Model.MessageResponse> => {
  // Axios mặc định gửi JSON khi data là object (không phải FormData)
  const response = await apiClient.put(`/admin/patients/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// ==========================================
// === 10. QUẢN LÝ THÔNG BÁO (ADMIN) ===
// ==========================================

// Lấy lịch sử thông báo
export const getNotificationLogs = async (): Promise<any[]> => {
  // Giả định Backend có route GET /api/admin/notifications
  const response = await apiClient.get("/admin/notifications", {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Gửi thông báo mới
export const sendNotification = async (data: {
  Title: string;
  Content: string;
  TargetGroup: string; // 'all', 'patients', 'doctors'
  Channel: string; // 'in_app', 'email'
}): Promise<Model.MessageResponse> => {
  // Giả định Backend có route POST /api/admin/notifications/send
  const response = await apiClient.post("/admin/notifications/send", data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
// [MỚI] Lấy danh sách lịch hẹn chờ xác nhận (Pending)
export const getPendingAppointments = async (): Promise<
  Model.Appointment[]
> => {
  // Giả sử backend có hỗ trợ filter status, hoặc dùng API lấy tất cả rồi filter ở frontend (nếu backend chưa hỗ trợ filter)
  // Cách tốt nhất là backend có endpoint riêng hoặc param filter
  // Ở đây dùng cách filter ở frontend từ API getAllAppointments nếu backend chưa có endpoint riêng
  // Hoặc gọi endpoint /staff/pending-appointments nếu có.

  // Cách 1: Gọi API lấy tất cả rồi lọc (Tạm thời dùng cách này nếu chưa rõ backend)
  const allAppointments = await getAllAppointments();
  return allAppointments.filter((app) => app.Status === "Pending");
};
// [MỚI] Staff tạo lịch hẹn thay mặt bệnh nhân
export const staffCreateAppointment = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/staff/appointments", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
//Xem lịch tái khám ngoài bệnh nhân
export const getFollowUpAppointments = (appointments: Model.Appointment[]) => {
  return appointments.filter(app => 
    //
    //Dựa vào tên Dịch vụ
    app.service?.ServiceName.toLowerCase().includes("tái khám") ||
    //Hoặc dựa vào Ghi chú triệu chứng
    app.InitialSymptoms?.toLowerCase().includes("tái khám")
  );
};