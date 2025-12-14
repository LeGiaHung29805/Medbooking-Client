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

    console.log("Sending request:", {
      email: username,
      password: password.substring(0, 1) + "***" // Ẩn mật khẩu
    });

    try {
      const formData = new FormData();
      formData.append("email", username);
      formData.append("password", password);

      // CODE CỦA BẠN (fetch)
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("API Response:", data);
      console.log("Status:", res.status);
      console.log("Full response:", { status: res.status, ok: res.ok, data });

      // HIỂN THỊ THÔNG BÁO 
      if (!res.ok) {
        throw new Error(data.message || "Sai email hoặc mật khẩu");
      }

      // Lưu token
      const token = data.access_token || data.token;
      if (token) {
        localStorage.setItem("api_token", token);
        localStorage.setItem("user_role", data.user.Role || data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Đã lưu token:", token);
      }

      // REDIRECT CHO STAFF + ADMIN 
      console.log("Stored role in localStorage:", data.user.Role);
      const role = data.user.Role.toLowerCase().trim().replace(/\s+/g, ""); // xóa khoảng trắng

      if (role === "doctor" || role.includes("doctor")) {
        router.push("/Doctor");
      } else if (role.includes("nhanvien") || role.includes("nhânvien") || role.includes("staff")) {
        router.push("/Staff");  // Đây mới quan trọng
      } else if (role.includes("quantrivien") || role.includes("quantri") || role.includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dat-lich");
      }

      alert(`Đăng nhập thành công! Xin chào ${data.user.FullName || data.user.name}`);

    } catch (err) {
      console.error("Login failed:", err);

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
              {error}
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
              className={`w-full text-white py-2.5 rounded-lg font-bold transition flex justify-center items-center ${isLoading
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
              href="/register"
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