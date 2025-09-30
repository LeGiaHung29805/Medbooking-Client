"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LayoutBook from "@/components/layoutBook";
import { FaHospitalUser } from "react-icons/fa";
import Image from "next/image";

export default function BookingPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Trạng thái đặt lịch
    const [selectedPerson, setSelectedPerson] = useState("Tôi - Lê Gia Hưng");

    // Fake data bác sĩ
    const featuredDoctors = [
        {
            id: 1,
            name: "BS. Nguyễn Văn A",
            specialty: "Tim mạch",
            image: "/doctor1.jpg",
        },
        {
            id: 2,
            name: "BS. Trần Thị B",
            specialty: "Nhi khoa",
            image: "/doctor2.jpg",
        },
        {
            id: 3,
            name: "BS. Lê Văn C",
            specialty: "Da liễu",
            image: "/doctor3.jpg",
        },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsLoggedIn(true);
        }
        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return <div className="p-4">Đang kiểm tra đăng nhập...</div>;
    }

    if (!isLoggedIn) return null;

    return (
        <LayoutBook>
            <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
                    Đặt lịch khám
                </h1>

                {/* Chọn người đăng ký */}
                <div className="flex items-center gap-4 mb-6">
                    <FaHospitalUser className="text-green-600 text-2xl" />
                    <label className="font-semibold text-gray-700">
                        Chọn người đăng ký
                    </label>
                    <select
                        value={selectedPerson}
                        onChange={(e) => setSelectedPerson(e.target.value)}
                        className="flex-1 border rounded px-3 py-2 focus:outline-green-600"
                    >
                        <option value="Tôi - Lê Gia Hưng">Tôi - Lê Gia Hưng</option>
                        <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                        <option value="Trần Thị B">Trần Thị B</option>
                    </select>
                </div>

                {/* 2 lựa chọn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
                    <div
                        onClick={() => router.push("/dat-lich/bac-si")}
                        className="border rounded-lg p-6 shadow hover:shadow-lg cursor-pointer transition"
                    >
                        <h2 className="text-xl font-bold text-green-700 mb-2">
                            Đặt lịch khám theo bác sĩ
                        </h2>
                        <p className="text-gray-600">
                            Chọn bác sĩ yêu thích của bạn để đặt lịch khám nhanh chóng.
                        </p>
                    </div>

                    <div
                        onClick={() => router.push("/dat-lich/chuyen-khoa")}
                        className="border rounded-lg p-6 shadow hover:shadow-lg cursor-pointer transition"
                    >
                        <h2 className="text-xl font-bold text-green-700 mb-2">
                            Đặt lịch khám theo chuyên khoa
                        </h2>
                        <p className="text-gray-600">
                            Chọn chuyên khoa phù hợp với tình trạng sức khỏe của bạn.
                        </p>
                    </div>
                </div>

                {/* Danh sách bác sĩ nổi bật */}
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-green-700">
                        Bác sĩ nổi bật
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {featuredDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() =>
                                    router.push(`/doctors?name=${encodeURIComponent(doc.name)}`) //Khi có API sẽ gọi ở đây
                                }
                                className="border rounded-lg shadow hover:shadow-lg cursor-pointer transition p-3"
                            >
                                <div className="relative w-full h-40 mb-3">
                                    <Image
                                        src={doc.image}
                                        alt={doc.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                                </div>
                                <h3 className="font-semibold text-green-700">{doc.name}</h3>
                                <p className="text-gray-600 text-sm">{doc.specialty}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LayoutBook>
    );
}
