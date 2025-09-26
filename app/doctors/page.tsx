"use client";

import { useState } from "react";
import Image from "next/image";
import Layout from "@/components/layout";

export default function DoctorsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("Tất cả");

    const departments = [
        "Tất cả",
        "Trung Tâm Cấp Cứu A9",
        "Trung Tâm Hồi Sức Tích Cực",
        "Trung Tâm Cơ Xương Khớp",
        "Trung Tâm Hô Hấp",
        "Trung Tâm Dinh dưỡng Lâm sàng",
        // ... thêm các khoa
    ];
    const doctors = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            department: "Trung Tâm Hồi Sức Tích Cực",
            position: "Bác sĩ chuyên khoa I",
            image: "/images/doctor1.jpg", // đường dẫn trong public
        },
        {
            id: 2,
            name: "Trần Thị B",
            department: "Trung Tâm Cơ Xương Khớp",
            position: "Bác sĩ CK II",
            image: "/images/doctor2.jpg",
        },
        // ... thêm các bác sĩ khác
    ];
    // Lọc theo từ khoá và khoa
    const filtered = doctors.filter(
        (d) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedDept === "Tất cả" || d.department === selectedDept)
    );

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Cột bên trái */}
                <div className="col-span-1 space-y-6">
                    {/* Tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm bác sĩ"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400"
                    />
                    <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Tìm kiếm
                    </button>

                    {/* Danh sách khoa */}
                    <div className="space-y-2">
                        {departments.map((dept) => (
                            <div
                                key={dept}
                                onClick={() => setSelectedDept(dept)}
                                className={`px-4 py-2 rounded-md cursor-pointer ${selectedDept === dept
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {dept}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cột bên phải */}
                <div className="col-span-3">
                    <h1 className="text-2xl font-semibold mb-6">
                        Tất cả{" "}
                        <span className="text-green-600">{filtered.length}</span> bác sĩ
                        chuyên khoa
                    </h1>

                    {/* Grid bác sĩ */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {filtered.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center"
                            >
                                <div className="w-40 h-52 relative mb-3">
                                    <Image
                                        src={doctor.image}
                                        alt={doctor.name}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                                <h2 className="font-semibold text-center">{doctor.name}</h2>
                                <p className="text-sm text-gray-600 text-center">
                                    {doctor.position}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
