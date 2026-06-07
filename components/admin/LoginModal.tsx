"use client";

import { login } from "@/lib/ApiClient";
import dayjs from "dayjs";
import { useState } from "react";

export default function LoginModal({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("Username", username);
            formData.append("password", password);

            const response = await login(formData);

            if (response.user && response.user.Role === "QuanTriVien") {
                onLoginSuccess();
                setUsername("");
                setPassword("");
                setError("");
                localStorage.setItem('isLoggedIn', dayjs().toLocaleString());
            } else {
                setError("Tài khoản không có quyền truy cập quản trị.");
                localStorage.removeItem("api_token");
                localStorage.removeItem("user_role");
                localStorage.removeItem("user");
            }
        } catch (err: any) {
            console.error("Admin login failed:", err);
            const msg = err.response?.data?.message || err.message || "Tên tài khoản hoặc mật khẩu không chính xác.";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6">Đăng nhập</h2>
                <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Tên tài khoản"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
