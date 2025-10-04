"use client";
import { useEffect, useState } from "react";
import LayoutUsers from "@/components/layoutUsers";

export default function ProfilePage() {
    const [profile, setProfile] = useState({
        name: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        username: "",
        country: "",
        job: "",
    });

    useEffect(() => {
        const storedProfile = {
            name: localStorage.getItem("name") || "",
            dob: localStorage.getItem("dob") || "",
            gender: localStorage.getItem("gender") || "",
            phone: localStorage.getItem("phone") || "",
            email: localStorage.getItem("email") || "",
            address: localStorage.getItem("address") || "",
            username: localStorage.getItem("username") || "",
            country: localStorage.getItem("country") || "",
            job: localStorage.getItem("job") || "",
        };
        setProfile(storedProfile);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // Lưu lại vào localStorage
        for (const key in profile) {
            localStorage.setItem(key, profile[key as keyof typeof profile]);
        }
        alert("Cập nhật thông tin thành công!");
    };

    return (
        <LayoutUsers>
            <div className="min-h-screen p-8 bg-gray-50">
                <h1 className="text-2xl font-bold text-green-700 mb-6">Thông tin cá nhân</h1>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Họ và tên</label>
                            <input
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                            <input
                                name="dob"
                                type="date"
                                value={profile.dob}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Giới tính</label>
                            <select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                            <input
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                            <input
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium mb-1">Tên đăng nhập</label>
                            <input
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Nghề nghiệp</label>
                            <input
                                name="address"
                                value={profile.job}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quốc gia</label>
                            <input
                                name="address"
                                value={profile.country}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="mt-4 bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition"
                    >
                        Lưu thông tin
                    </button>
                </div>
            </div>
        </LayoutUsers>
    );
}
