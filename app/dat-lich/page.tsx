"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";
import { FaHospitalUser } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/ApiClient";
import { User } from "@/lib/model";

export default function BookingPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    const [selectedPerson, setSelectedPerson] = useState("");

    const featuredDoctors = [
        {
            id: 1,
            name: "BS. Nguyễn Văn A",
            specialty: "Tim mạch",
            image: "/image/doctors/doctor1.jpg",
        },
        {
            id: 2,
            name: "BS. Trần Thị B",
            specialty: "Nhi khoa",
            image: "/image/doctors/doctor2.jpg",
        },
        {
            id: 3,
            name: "BS. Lê Văn C",
            specialty: "Da liễu",
            image: "/image/doctors/doctor3.jpg",
        },
    ];

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("api_token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const userData = await getMe();
                setUser(userData);
                setSelectedPerson(`Tôi - ${userData.FullName}`);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Lỗi xác thực:", error);
                localStorage.removeItem("api_token");
                router.push("/login");
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router]);

    // Màn hình chờ khi đang check login
    if (isChecking) {
        return (
            <LayoutBook>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
                </div>
            </LayoutBook>
        );
    }

    if (!isLoggedIn) return null;

    return (
        <LayoutBook>
            <div className="max-w-3xl mx-auto bg-white rounded shadow p-6 min-h-[80vh] mt-6 mb-10">
                <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
                    Đặt lịch khám
                </h1>

                {/* Chọn người đăng ký */}
                <div className="flex items-center gap-4 mb-8 bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                        <FaHospitalUser className="text-green-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                        <label className="font-semibold text-gray-700 block mb-1">
                            Chọn người đăng ký
                        </label>
                        <select
                            value={selectedPerson}
                            onChange={(e) => setSelectedPerson(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                        >
                            {/* Hiển thị tên thật lấy từ API */}
                            <option value={`Tôi - ${user?.FullName}`}>Tôi - {user?.FullName}</option>
                            <option value="Người thân - Nguyễn Văn A">Người thân - Nguyễn Văn A</option>
                            <option value="Người thân - Trần Thị B">Người thân - Trần Thị B</option>
                        </select>
                    </div>
                </div>

                {/* Các nút điều hướng đặt lịch */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <Link
                        href="/dat-lich/bac-si"
                        className="group border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-green-500 cursor-pointer transition bg-white"
                    >
                        <h2 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-800">
                            Đặt lịch khám theo bác sĩ
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Chọn bác sĩ yêu thích của bạn để đặt lịch khám nhanh chóng và trực tiếp.
                        </p>
                    </Link>

                    <Link
                        href="/dat-lich/chuyen-khoa"
                        className="group border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-green-500 cursor-pointer transition bg-white"
                    >
                        <h2 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-800">
                            Đặt lịch khám theo chuyên khoa
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Tìm kiếm bác sĩ phù hợp dựa trên các chuyên khoa (Nội, Ngoại, Nhi...).
                        </p>
                    </Link>

                    <Link
                        href="/dat-lich/dich-vu"
                        className="group border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-green-500 cursor-pointer transition bg-white md:col-span-2"
                    >
                        <h2 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-800">
                            Đặt lịch khám theo dịch vụ
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Chọn các gói khám tổng quát, xét nghiệm hoặc các dịch vụ y tế kỹ thuật cao.
                        </p>
                    </Link>
                </div>

                {/* Danh sách bác sĩ nổi bật */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-green-700">
                            Bác sĩ nổi bật
                        </h2>
                        <Link href="/doctors" className="text-sm text-green-600 hover:underline">
                            Xem tất cả
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {featuredDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() =>
                                    router.push(`/doctors/${doc.id}`) // Điều hướng đến chi tiết bác sĩ
                                }
                                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition overflow-hidden bg-white group"
                            >
                                <div className="relative w-full h-48 bg-gray-100">
                                    <Image
                                        src={doc.image} // Lưu ý: Cần đảm bảo file ảnh tồn tại trong public/image/doctors/
                                        alt={doc.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    // Fallback nếu ảnh lỗi (Optional)
                                    // onError={(e) => { e.currentTarget.src = "/default-avatar.png" }}
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                                        {doc.name}
                                    </h3>
                                    <p className="text-green-600 text-sm font-medium">{doc.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LayoutBook>
    );
}