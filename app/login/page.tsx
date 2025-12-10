"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import LayoutBook from "@/components/layoutBook";
import * as Api from "@/lib/ApiClient";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    setIsLoading(true);

    try {
      //Chuẩn bị FormData để gửi (Vì API yêu cầu multipart/form-data)
      const formData = new FormData();
      formData.append("Username", username);
      formData.append("password", password);

      const response = await Api.login(formData);

      if (response.token) {
        // Đảm bảo lưu thông tin user để dùng ở các trang khác
        localStorage.setItem("user", JSON.stringify(response.user));

        //Điều hướng dựa trên Role
        const role = response.user.Role;

        alert(`Đăng nhập thành công! Xin chào ${response.user.FullName}`);

        switch (role) {
          case "QuanTriVien":
            router.push("/admin");
            break;
          case "BacSi":
            router.push("/Doctor"); // Hoặc trang dành cho bác sĩ
            break;
          case "NhanVien":
            router.push("/staff");
            break;
          default: // BenhNhan
            router.push("/dat-lich"); // Về trang chủ hoặc trang đặt lịch
            break;
        }
      } else {
        setError("Không nhận được token xác thực.");
      }
    } catch (err) {
      console.error("Login failed:", err);

      //Ép kiểu lỗi về dạng AxiosError có chứa { message: string }
      const error = err as AxiosError<{ message: string }>;

      const msg =
        error.response?.data?.message ||
        error.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại.";

      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LayoutBook>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
            Đăng Nhập
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="Nhập tên đăng nhập"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-2.5 rounded-lg font-bold transition flex justify-center items-center ${
                isLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Chưa có tài khoản?{" "}
            <a
              href="/dang-ky"
              className="text-green-600 font-bold hover:underline"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </LayoutBook>
  );
}
