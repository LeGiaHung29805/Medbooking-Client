"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        // Fake login: chỉ cần có username + password là thành công
        if (username && password) {
            localStorage.setItem("token", "user-token");
            localStorage.setItem("username", username);
            alert("Đăng nhập thành công!");
            router.push("/dat-lich");
        } else {
            alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
        }
    };

    return (
        <LayoutBook>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
                        Đăng Nhập
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
                        >
                            Đăng Nhập
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Chưa có tài khoản?{" "}
                        <a href="/register" className="text-green-700 hover:underline">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </LayoutBook>
    );
}
