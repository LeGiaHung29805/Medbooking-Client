"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";
import apiClient from "@/lib/ApiClient";



export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      setIsLoading(false);
      return;
    }

    try {
      // Bước 1: Lấy CSRF cookie từ Sanctum (bắt buộc)
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include", // Quan trọng: gửi/nhận cookie
      });

      // Bước 2: Gửi login bằng JSON (backend nhận field "email")
     const res = await apiClient.post("/login", {
  email: username,      
  password: password,
});


      const data = res.data;

      console.log("Login success:", data);

      // Lưu role để redirect (không lưu token nữa)
      if (data.user?.Role) {
        localStorage.setItem("user_role", data.user.Role);
      }

      // Redirect theo role
      const role = (data.user?.Role || "").toLowerCase().trim();

      if (role.includes("doctor") || role.includes("bacsi")) {
        router.push("/Doctor");
      } else if (role.includes("nhanvien") || role.includes("staff")) {
        router.push("/Staff");
      } else if (role.includes("quantrivien") || role.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dat-lich");
      }

      alert(`Đăng nhập thành công! Xin chào ${data.user?.FullName || "bạn"}`);

    } catch (err: any) {
      console.error("Login failed:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối hoặc tài khoản.";

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
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Tên đăng nhập hoặc Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="Nhập tên đăng nhập hoặc email"
                disabled={isLoading}
                required
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
                required
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
            <a href="/register" className="text-green-600 font-bold hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </LayoutBook>
  );
}