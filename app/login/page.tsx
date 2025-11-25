"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";
import { login } from "@/lib/ApiClient";
import { AxiosError } from "axios"; // 1. Import AxiosError để xử lý lỗi chuẩn xác

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
            const formData = new FormData();
            formData.append("Username", username);
            formData.append("password", password);

            const response = await login(formData);

            const role = response.user?.Role ? response.user.Role.toLowerCase() : "benhnhan";

            switch (role) {
                case "quantrivien":
                    router.push("/admin");
                    break;
                case "bacsi":
                    router.push("/doctor");
                    break;
                case "nhanvien":
                    router.push("/staff");
                    break;
                case "benhnhan":
                default:
                    router.push("/dat-lich");
                    break;
            }

        } catch (err) {
            // 2. Sửa lỗi 'any': Ép kiểu err thành AxiosError
            // Giả định response lỗi trả về có dạng { message: string }
            const error = err as AxiosError<{ message: string }>;

            console.error("Login failed:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LayoutBook>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
                        Đăng Nhập
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Nhập email hoặc tên đăng nhập"
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white py-2 rounded-md transition flex justify-center items-center ${isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-700 hover:bg-green-800"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đăng Nhập"
                            )}
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