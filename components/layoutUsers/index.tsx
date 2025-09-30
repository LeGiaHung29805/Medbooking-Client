"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import {
    FaUser,
    FaUsers,
    FaCalendarAlt,
    FaFileMedical,
    FaStethoscope,
    FaFilePrescription,
    FaShieldAlt,
    FaBell,
} from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

type User = {
    name: string;
    gender: string;
    dob: string;
    avatarUrl?: string;
};

type LayoutUserProps = {
    children: ReactNode;
    user?: User; // có thể undefined
};

export default function LayoutUser({ children, user }: LayoutUserProps) {
    // Nếu không có user, dùng dữ liệu mặc định
    const displayUser: User = user || {
        name: "Khách",
        gender: "Nam",
        dob: "01/01/2000",
        avatarUrl: "/default-avatar.png",
    };

    const menuItems = [
        { name: "Hồ sơ cá nhân", icon: <FaUser />, path: "/Users/profile" },
        { name: "Quản lý gia đình", icon: <FaUsers />, path: "/Users/quan-ly-gia-dinh" },
        { name: "Lịch sử đặt lịch khám", icon: <FaCalendarAlt />, path: "/Users/lich-su-dat-lich-kham" },
        { name: "Kết quả khám bệnh", icon: <FaFileMedical />, path: "/Users/ket-qua-kham-benh" },
        { name: "Lịch hẹn khám lại", icon: <FaStethoscope />, path: "/Users/lich-hen-kham-lai" },
        { name: "Bác sĩ của tôi", icon: <FaUser />, path: "/Users/bac-si-cua-toi" },
        { name: "Giấy chuyển tuyến", icon: <FaFilePrescription />, path: "/Users/giay-chuyen-tuyen" },
        { name: "Bảo hiểm y tế", icon: <FaShieldAlt />, path: "/Users/bao-hiem-y-te" },
        { name: "Thông báo", icon: <FaBell />, path: "/Users/thong-bao" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r p-4">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden relative">
                            <Image
                                src={displayUser.avatarUrl || "/default-avatar.png"}
                                alt="avatar"
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-full"
                            />
                        </div>
                        <h2 className="font-bold">{displayUser.name}</h2>
                        <p className="text-gray-500">
                            {displayUser.gender}, {displayUser.dob}
                        </p>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className="flex items-center p-2 rounded hover:bg-green-600 hover:text-white text-gray-700"
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-100">{children}</main>
            </div>

            <Footer />
        </div>
    );
}
