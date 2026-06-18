"use client";

import Link from "next/link";
import DataThumbnail from "../thumnail/DataThumbnail";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/ApiClient";
import { User as UserModel } from "@/lib/model";

import { FaUser, FaUsers, FaCalendarAlt, FaFileMedical, FaStethoscope, FaBell } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

type LayoutUserProps = {
    children: ReactNode;
};

export default function LayoutUser({ children }: LayoutUserProps) {
    const router = useRouter();

    // State lưu thông tin người dùng thực tế từ API
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Kiểm tra token trước
                const token = localStorage.getItem("api_token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                // Gọi API lấy thông tin cá nhân
                const userData = await getMe();
                setUser(userData);
            } catch (error) {
                console.error("Lỗi xác thực:", error);
                localStorage.removeItem("api_token");
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const menuItems = [
        { name: "Hồ sơ cá nhân", icon: <FaUser />, path: "/users/profile" },
        { name: "Quản lý gia đình", icon: <FaUsers />, path: "/users/quan-ly-gia-dinh" },
        { name: "Lịch sử đặt lịch khám", icon: <FaCalendarAlt />, path: "/users/lich-su-dat-lich-kham" },
        { name: "Kết quả khám bệnh", icon: <FaFileMedical />, path: "/users/ket-qua-kham-benh" },
        { name: "Lịch hẹn khám lại", icon: <FaStethoscope />, path: "/users/lich-hen-kham-lai" },
        { name: "Bác sĩ của tôi", icon: <FaUser />, path: "/users/bac-si-cua-toi" },
        // { name: "Giấy chuyển tuyến", icon: <FaFilePrescription />, path: "/users/giay-chuyen-tuyen" },
        // { name: "Bảo hiểm y tế", icon: <FaShieldAlt />, path: "/users/bao-hiem-y-te" },
        { name: "Nhận xét, Góp ý", icon: <FaUser />, path: "/users/nhan-xet" },
        { name: "Thông báo", icon: <FaBell />, path: "/users/thong-bao" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-1 container mx-auto py-6 gap-6">
                <aside className="w-64 bg-white border rounded-lg shadow-sm p-4 h-fit">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden relative border-2 border-green-600">
                            <DataThumbnail
                                src={user?.avatar_url}
                                alt={user?.FullName || "User"}
                                fallbackType="user"
                                className="w-full h-full rounded-full border border-green-100 text-2xl"
                            />
                        </div>

                        <h2 className="font-bold text-lg text-gray-800">
                            {user?.FullName || "Người dùng"}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {user?.PhoneNumber || user?.Email || "Chưa cập nhật thông tin"}
                        </p>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="flex items-center p-3 rounded-md transition-colors duration-200 hover:bg-green-50 hover:text-green-700 text-gray-600 font-medium"
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 bg-white rounded-lg shadow-sm p-6 border">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
}