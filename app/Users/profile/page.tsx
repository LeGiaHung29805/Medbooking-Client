"use client";
import { useEffect, useState } from "react";
import LayoutUsers from "@/components/layoutUsers";
import * as Api from "@/lib/ApiClient"; // Import API
import * as Model from "@/lib/model";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        FullName: "",
        DateOfBirth: "",
        Gender: "",
        PhoneNumber: "",
        Email: "",
        Address: "",
    });

    const [loading, setLoading] = useState(true);

    // 2. Load dữ liệu từ API khi vào trang
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await Api.getMe(); // Lấy từ Database
                setFormData({
                    FullName: userData.FullName || "",
                    DateOfBirth: userData.DateOfBirth || "",
                    Gender: userData.Gender || "",
                    PhoneNumber: userData.PhoneNumber || "",
                    Email: userData.Email || "",
                    Address: userData.Address || "",
                });
            } catch (error) {
                console.error("Lỗi tải thông tin:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // 3. Xử lý nhập liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 4. Lưu thông tin lên Server
    const handleSave = async () => {
        try {
            await Api.updateProfile(formData); // Gọi API Update
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.log(error);
            alert("Có lỗi xảy ra khi lưu thông tin.");
        }
    };

    if (loading) {
        return (
            <LayoutUsers>
                <div className="min-h-screen p-8 bg-gray-50 flex justify-center">
                    Đang tải...
                </div>
            </LayoutUsers>
        );
    }

    return (
        <LayoutUsers>
            <div className="min-h-screen p-8 bg-gray-50">
                <h1 className="text-2xl font-bold text-green-700 mb-6">Thông tin cá nhân</h1>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Họ và tên</label>
                            <input
                                name="FullName" // Khớp với state
                                value={formData.FullName}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                            <input
                                name="DateOfBirth" // Khớp với state
                                type="date"
                                value={formData.DateOfBirth}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Giới tính</label>
                            <select
                                name="Gender" // Khớp với state
                                value={formData.Gender}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
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
                                name="PhoneNumber" // Khớp với state
                                value={formData.PhoneNumber}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                name="Email" // Khớp với state
                                type="email"
                                value={formData.Email}
                                onChange={handleChange}
                                disabled // Email thường không cho sửa, nếu muốn sửa thì bỏ disabled đi
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                            <input
                                name="Address" // Khớp với state
                                value={formData.Address}
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