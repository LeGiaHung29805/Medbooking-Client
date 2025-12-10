import axios from "axios";
import * as Model from "./model";
import { relative } from "path";

// 1. Cấu hình URL Backend
const API_BASE_URL = "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

//THÊM DEBUG INTERCEPTORS
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("api_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

//Hàm lấy Token từ LocalStorage
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

//1. NHÓM XÁC THỰC (AUTH) 

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
  const token = response.data.access_token || response.data.token;
  if (token && typeof window !== "undefined") {
    localStorage.setItem("api_token", token);
    localStorage.setItem("user_role", response.data.user.Role || response.data.user.role);
    console.log("Đã lưu token:", token); // thêm dòng này để debug
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

//2. NHÓM CÔNG KHAI (PUBLIC)
//Lấy tất cả dịch vụ
export const getAllServices = async (
  search?: string
): Promise<Model.Service[]> => {
  const params = search ? { search } : {};
  const response = await apiClient.get("/services", { params }); // Hoặc /admin/services tùy route backend
  return response.data;
};
//Gọi chuyên khoa
export const getSpecialties = async (
  search?: string
): Promise<Model.Specialty[]> => {
  const params = search ? { search } : {};
  const response = await apiClient.get("/specialties", { params });
  return response.data;
};
//Xem chi tiết bác sĩ
export const getDoctorDetails = async (id: number): Promise<Model.Doctor> => {
  const response = await apiClient.get(`/doctors/${id}`);
  return response.data;
};
//Gọi bác sĩ
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

//Lấy danh sách 3 đánh giá tiêu biểu theo 5 sao mới nhất
export const getTopFeedbacks = async (): Promise<Model.TopFeedback[]> => {
  const response = await apiClient.get<Model.TopFeedback[]>("/top-feedbacks");
  return response.data;
};
//3. NHÓM BỆNH NHÂN (PATIENT)
//Lấy profile chính mình
export const getMe = async (): Promise<Model.User> => {
  const response = await apiClient.get("/user", { headers: getAuthHeaders() });
  return response.data;
};
//Upload ảnh đại diện (Xử lí ảnh chưa tối ưu có thể bỏ)
export const uploadAvatar = async (file: File): Promise<Model.User> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await apiClient.post("/user/upload-avatar", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data.user;
};
//Lấy lịch hẹn của bản thân
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
//Đặt lịch hẹn
export const bookAppointment = async (
slotId: number, symptoms: string, file?: File, ServiceID?: number): Promise<Model.MessageResponse> => {
  const formData = new FormData();
  formData.append("SlotID", slotId.toString());
  if (symptoms) formData.append("InitialSymptoms", symptoms);
  if (file) formData.append("file", file);

  const response = await apiClient.post("/appointments", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

//Hủy lịch hẹn
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

//4. NHÓM BÁC SĨ (DOCTOR)
//Lấy thống kê của bác sĩ
export const doctorGetDashboard = async (): Promise<Model.DashboardStats> => {
  const response = await apiClient.get("/doctor/dashboard-stats-test");
  return response.data;
};
//Lấy lịch của bác sĩ đang đăng nhập
export const doctorGetSchedule = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/doctor/my-schedule", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Lấy danh sách bệnh nhân đang đợi vào khám
export const doctorGetQueue = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/doctor/queue-test");
  return response.data;
};

//Tạo lịch hẹn của chính mình
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
//Xóa lịch hẹn của chính mình 
export const doctorDeleteSlot = async (id: number): Promise<void> => {
  await apiClient.delete(`/doctor/availability/${id}`, {
    headers: getAuthHeaders(),
  });
};
//Tạo bệnh án cho bệnh nhân
export const doctorCreateMedicalRecord = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/doctor/medical-records", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
//Bác sĩ gửi kết quả 
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
//Cập nhật trạng thái Lịch hẹn (Bắt đầu khám / Hoàn tất / Hủy)
export const updateAppointmentStatus = async (
  appointmentId: number, 
  status: 'InProgress' | 'Completed' | 'Cancelled'
): Promise<Model.MessageResponse> => {
  const response = await apiClient.put(
    `/doctor/appointments/${appointmentId}/status`, 
    { Status: status }, 
    { headers: getAuthHeaders() }
  );
  return response.data;
};

//Xem danh sách Slot rảnh của chính bác sĩ(Để quản lý)
export const getMySlots = async (date?: string): Promise<Model.AvailabilitySlot[]> => {
  const url = date ? `/doctor/my-slots?date=${date}` : '/doctor/my-slots';
  
  const response = await apiClient.get<Model.AvailabilitySlot[]>(url, {
    headers: getAuthHeaders()
  });
  return response.data;
};

//Lấy chi tiết lịch hẹn (Để hiển thị Popup thông tin bệnh nhân)
export const getAppointmentDetail = async (id: number): Promise<Model.Appointment> => {
  const response = await apiClient.get<Model.Appointment>(`/doctor/appointments/${id}`, {
    headers: getAuthHeaders(),
  });
  
  return response.data;
};

//5. NHÓM STAFF & ADMIN
//Lấy thống kê của nhân viên y tế
export const getStaffDashboard = async (): Promise<Model.DashboardStats> => {
  const response = await apiClient.get("/staff/dashboard-stats", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Xác nhận lịch hẹn confirm
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
//Xác nhận bệnh nhân đã tới check-in
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
//Xem tất cả lịch hẹn 
export const getAllAppointments = async (): Promise<Model.Appointment[]> => {
  const response = await apiClient.get("/staff/all-appointments", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Admin tạo bác sĩ
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
//Admin chỉnh sửa ảnh của Bác sĩ
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
//Admin xóa bác sĩ
export const adminDeleteDoctor = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/doctors/${id}`, {
    headers: getAuthHeaders(),
  });
};
//6. CÁC API BỔ SUNG (CHO ADMIN & TRA CỨU)

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
//Admin cập nhật người dùng có thể sử dụng vào bác sĩ
export const adminUpdateUser = async (
  id: number,
  formData: FormData
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

//Quản lý Chuyên khoa (Admin)
//Admin tạo chuyên khoa
export const adminCreateSpecialty = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/specialties", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
//Admin cập nhật chuyên khoa
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
//Admin xóa chuyên khoa
export const adminDeleteSpecialty = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/specialties/${id}`, {
    headers: getAuthHeaders(),
  });
};

//Quản lý Dịch vụ (Admin)
//Admin tạo dịch vụ
export const adminCreateService = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/admin/services", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
//Admin xóa dịch vụ
export const adminDeleteService = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/services/${id}`, {
    headers: getAuthHeaders(),
  });
};

//Tra cứu & Lịch sử (Bác sĩ / Admin)
//Xem bệnh án của chính bác sĩ đó tạo ra
export const getDoctorMyMedicalRecords = async (): Promise<Model.MedicalRecord[]> => {
  const response = await apiClient.get("/doctor/my-medical-records-test");
  return response.data;
};
//Xem lịch sử khám của bệnh nhân
export const getPatientHistory = async (
  patientId: number
): Promise<Model.MedicalRecord[]> => {
  const response = await apiClient.get(`/doctor/patient-history/${patientId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Lấy các feedbacks của người dùng về hệ thống và bác sĩ nhưng chưa tối ưu
export const getFeedbacks = async (): Promise<Model.Feedback[]> => {
  const response = await apiClient.get("/staff/feedbacks", {
    headers: getAuthHeaders(),
  }); // Admin/Staff dùng chung
  return response.data;
};
//Admin lấy feedback API này cải tiến để lấy được cả feedback cho hệ thống
export const adminGetFeedbacks = async (): Promise<Model.AdminFeedback[]> => {
  const response = await apiClient.get("/admin/feedbacks", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Admin lấy tất cả bệnh án
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
//Xem chi tiết bệnh án
export const getMedicalRecordDetail = async (
  id: number
): Promise<Model.MedicalRecord> => {
  const response = await apiClient.get(`/admin/medical-records/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Admin xóa bệnh án
export const adminDeleteMedicalRecord = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/medical-records/${id}`, {
    headers: getAuthHeaders(),
  });
};

//Admin cập nhật dịch vụ
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
//Bổ sung API

// Bệnh nhân tự sửa hồ sơ
export const updateProfile = async (
  data: Model.UpdateProfileRequest
): Promise<Model.MessageResponse> => {
  // Dùng method PUT (hoặc POST + _method:PUT nếu muốn gửi form-data đồng bộ)
  // Ở đây dùng JSON cho đơn giản vì không có file
  const response = await apiClient.put("/user/profile", data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const submitFeedback = async (data: {
  AppointmentID?: number | null;
  TargetType: "Doctor" | "System";
  Rating: number;
  Comment: string;
}): Promise<Model.MessageResponse> => {
  //Đánh giá Bác sĩ (Gắn với lịch hẹn cụ thể)
  if (data.TargetType === "Doctor" && data.AppointmentID) {
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

  //Đánh giá Hệ thống (Không gắn lịch hẹn)
  else if (data.TargetType === "System") {
    const response = await apiClient.post(
      "/system-feedback",
      {
        Rating: data.Rating,
        Comment: data.Comment,
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  }

  throw new Error(
    "Dữ liệu đánh giá không hợp lệ (Thiếu ID lịch hẹn hoặc sai loại)."
  );
};
//QUẢN LÝ NGƯỜI DÙNG (ADMIN)

// Lấy chi tiết 1 người dùng
export const adminGetUserDetail = async (id: number): Promise<Model.User> => {
  const response = await apiClient.get(`/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Tạo Bệnh nhân mới (Dùng cho trang quản lý User)
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
// tạm dùng endpoint của patients cho các user thông thường.
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
//Hủy lịch hẹn Staff/Admin (Dùng Route của Staff)
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

// QUẢN LÝ LỊCH LÀM VIỆC (ADMIN/STAFF)

//Admin/Staff tạo slot cho một bác sĩ cụ thể
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

//Admin/Staff xóa slot
export const adminDeleteSlot = async (slotId: number): Promise<void> => {
  // Gọi vào route của Staff
  await apiClient.delete(`/staff/availability/${slotId}`, {
    headers: getAuthHeaders(),
  });
};


// Cập nhật thông tin Bệnh nhân (JSON - Method PUT chuẩn)
// Dùng hàm này thay cho adminUpdateUser khi sửa thông tin bệnh nhân cụ thể
export const adminUpdatePatient = async (
  id: number,
  data: Model.AdminUpdatePatientRequest // Object chứa FullName, Email, v.v.
): Promise<Model.MessageResponse> => {
  // Axios mặc định gửi JSON khi data là object (không phải FormData)
  const response = await apiClient.put(`/admin/patients/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

//QUẢN LÝ THÔNG BÁO (ADMIN)

// Lấy lịch sử thông báo
export const getNotificationLogs = async (): Promise<Model.Notification[]> => {
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

  const response = await apiClient.post("/admin/notifications/send", data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//Lấy danh sách lịch hẹn chờ xác nhận (Pending)
export const getPendingAppointments = async (): Promise<
  Model.Appointment[]
> => {

  //Gọi API lấy tất cả rồi lọc
  const allAppointments = await getAllAppointments();
  return allAppointments.filter((app) => app.Status === "Pending");
};
//Staff tạo lịch hẹn thay mặt bệnh nhân
export const staffCreateAppointment = async (
  formData: FormData
): Promise<Model.MessageResponse> => {
  const response = await apiClient.post("/staff/appointments", formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
export const staffUpdateSlot = async (
  slotId: number,
  doctorId: number,
  startTime: string,
  endTime: string
): Promise<Model.MessageResponse> => {
  // Vì không có file upload, ta dùng JSON bình thường cho gọn
  const response = await apiClient.put(
    `/staff/availability/${slotId}`,
    {
      DoctorID: doctorId,
      StartTime: startTime,
      EndTime: endTime,
    },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
//Staff xóa slot rảnh
export const staffDeleteSlot = async (id: number): Promise<void> => {
  await apiClient.delete(`/staff/availability/${id}`, {
    headers: getAuthHeaders(),
  });
};

//Quản lí gia đình
export const getFamilyMembers = async (): Promise<Model.FamilyMember[]> => {
  const response = await apiClient.get("user/family-members", {
    headers: getAuthHeaders(),
  });
  return response.data;
};
export const addFamilyMember = async (
    relativeUserId: number, 
    relationType: string
): Promise<Model.MessageResponse> => {
    const response = await apiClient.post("/user/family-members", 
        { 
            RelativeUserID: relativeUserId, 
            RelationType: relationType 
        }, 
        { headers: getAuthHeaders() }
    );
    return response.data;
};
export const removeFamilyMember = async (relativeUserId: number): Promise<Model.MessageResponse> => {
    const response = await apiClient.delete(`/user/family-members/${relativeUserId}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};
//tìm user 
export const searchUserPublic = async (query: string): Promise<Model.User[]> => {
    const response = await apiClient.get(`/users/search-public?query=${query}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};