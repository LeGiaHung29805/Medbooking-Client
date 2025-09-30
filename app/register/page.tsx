"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const handleRegister = (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!name || !dob || !gender || !phone || !email || !address || !username || !password || !confirmPassword) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu nhập lại không khớp!");
            return;
        }

        localStorage.setItem("token", "user-token");
        localStorage.setItem("username", username);

        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/login");
    };

    return (
        <LayoutBook>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
                    <h1 className="text-2xl font-bold text-green-700 text-center mb-6">Đăng Ký</h1>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Họ tên</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder="Nhập họ tên"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Giới tính</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder="Nhập email"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
                        >
                            Đăng Ký
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Đã có tài khoản? <a href="/login" className="text-green-700 hover:underline">Đăng nhập ngay</a>
                    </p>
                </div>
            </div>
        </LayoutBook>
    );
}
