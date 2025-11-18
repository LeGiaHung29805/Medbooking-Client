import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  LoginRequest,
  RegisterRequest,
  CreateUserRequest,
  LoginResponse,
  MessageResponse,
} from "./model";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

//Định nghĩa các lệnh ghi dữ liệu
export const AuthCommand = {
  Login: "auth/login",
  Register: "auth/register",
};

export const AdminCommand = {
  CreateUser: "admin/users",
};

//Định nghĩa các truy vấn đọc dữ liệu
export const PatientQuery = {
  GetMyProfile: "patient/me",
};

export const DoctorQuery = {
  GetMyProfile: "doctor/me",
};

export const StaffQuery = {
  GetMyProfile: "staff/me",
};
class MedbookApiClient {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const userStorage = localStorage.getItem("user");
        if (userStorage) {
          const user = JSON.parse(userStorage) as LoginResponse;
          if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  //Đăng nhập
  login(model: LoginRequest) {
    return this.api.post<LoginResponse>(AuthCommand.Login, model);
  }
  //Đăng kí
  register(model: RegisterRequest) {
    return this.api.post<MessageResponse>(AuthCommand.Register, model);
  }
  //Đăng xuất
  logout() {
    localStorage.removeItem("user");
  }
  //Lấy user hiện tại
  getCurrentUser(): LoginResponse | null {
    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      return JSON.parse(userStorage) as LoginResponse;
    }
    return null;
  }

  //API Admin
  //Create new user (doctor, medical_staff, admin)
  createUser(model: CreateUserRequest) {
    return this.api.post<MessageResponse>(AdminCommand.CreateUser, model);
  }
  //API cấp quyền
  getPatientProfile() {
    return this.api.get<MessageResponse>(PatientQuery.GetMyProfile);
  }
  getDoctorProfile() {
    return this.api.get<MessageResponse>(DoctorQuery.GetMyProfile);
  }
  getStaffProfile() {
    return this.api.get<MessageResponse>(StaffQuery.GetMyProfile);
  }
}
export const medbookApiClient = new MedbookApiClient();
