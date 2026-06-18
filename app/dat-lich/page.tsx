"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";
import { FaHospitalUser } from "react-icons/fa";
import Link from "next/link";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";
import DataThumbnail from "@/components/thumnail/DataThumbnail";

export default function BookingPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [user, setUser] = useState<Model.User | null>(null);

    // State danh sách người thân & Bác sĩ
    const [familyMembers, setFamilyMembers] = useState<Model.FamilyMember[]>([]);
    const [featuredDoctors, setFeaturedDoctors] = useState<Model.Doctor[]>([]);

    const [selectedPerson, setSelectedPerson] = useState("");
    // const [selectedMemberID, setSelectedMemberID] = useState<number | string>("");
    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            const token = localStorage.getItem("api_token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                // 1. Gọi song song các API cần thiết
                const [userData, doctorsData, familyData] = await Promise.all([
                    Api.getMe(),
                    Api.getDoctors(),
                    Api.getFamilyMembers() // Lấy danh sách người thân
                ]);
                console.log("Check kỹ userData:", userData);
                // Set User
                setUser(userData);
                setSelectedPerson(userData.FullName); // Mặc định chọn chính mình (lưu tên hoặc ID tùy logic)
                setIsLoggedIn(true);

                setFamilyMembers(familyData);
                //ghi nhớ người dùng
                const savedPerson = localStorage.getItem("booking_for_person");
                if (savedPerson) {
                    setSelectedPerson(savedPerson);
                } else {
                    setSelectedPerson(userData.FullName);

                    localStorage.setItem("booking_for_person", userData.FullName);
                }
                // Set Doctors (Top 3 mới nhất)
                const top3Doctors = doctorsData
                    .sort((a, b) => b.DoctorID - a.DoctorID)
                    .slice(0, 3);
                setFeaturedDoctors(top3Doctors);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setIsChecking(false);
            }
        };

        checkAuthAndLoadData();
    }, [router]);
    //Chọn người đặt lịch
    const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        if (value === "ADD_NEW_MEMBER") {
            router.push("/users/quan-ly-gia-dinh");
            return;
        }
        setSelectedPerson(value);

        localStorage.setItem("booking_for_person", value);
    };

    // Màn hình chờ
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
            <div className="max-w-4xl mx-auto bg-white rounded shadow p-6 min-h-[80vh] mt-6 mb-10">
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
                            Chọn người tới khám
                        </label>
                        <select
                            value={selectedPerson}
                            onChange={handlePersonChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 bg-white cursor-pointer"
                        >
                            {/* Mặc định là chọn chính mình*/}
                            {user && user.FullName && (
                                <option value={user.FullName} className="font-bold text-green-700">
                                    Tôi - {user.FullName}
                                </option>
                            )}

                            {/*Lấy danh sách người thân */}
                            {familyMembers.length > 0 && (
                                <optgroup label="Người thân">
                                    {familyMembers.map((mem) => (
                                        <option key={mem.UserID} value={mem.FullName}>
                                            {mem.FullName} ({mem.RelationType || mem.pivot?.RelationType})
                                        </option>
                                    ))}
                                </optgroup>
                            )}

                            {/* Chưa có người thân có thể chọn */}
                            <option value="ADD_NEW_MEMBER" className="text-blue-600 font-semibold">
                                + Thêm hồ sơ người thân mới...
                            </option>
                        </select>
                    </div>
                </div>

                {/* Các nút điều hướng đặt lịch (Giữ nguyên) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

                {/* Danh sách bác sĩ nổi bật (Giữ nguyên) */}
                <div>
                    <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-100">
                        <h2 className="text-xl font-semibold text-green-700">
                            Bác sĩ mới nhất
                        </h2>
                        <Link href="/dat-lich/bac-si" className="text-sm text-green-600 hover:underline font-medium">
                            Xem tất cả &rarr;
                        </Link>
                    </div>

                    {featuredDoctors.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Đang cập nhật danh sách bác sĩ...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {featuredDoctors.map((doc) => (
                                <div
                                    key={doc.DoctorID}
                                    onClick={() => router.push(`/dat-lich/bac-si`)}
                                    className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition overflow-hidden bg-white group flex flex-col"
                                >
                                    <div className="relative w-full h-80 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full relative">
                                            <DataThumbnail
                                                src={doc.imageURL || doc.user?.avatar_url}
                                                alt={doc.user?.FullName}
                                                fallbackType="doctor"
                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-1">
                                            {doc.user?.FullName}
                                        </h3>
                                        <p className="text-green-600 text-sm font-medium mt-1">
                                            {doc.specialty?.SpecialtyName}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            {doc.Degree}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </LayoutBook>
    );
}