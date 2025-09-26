"use client";

import { useState } from "react";
import Image from "next/image";
import Layout from "@/components/layout";

export default function SpecialtiesPage() {
    // Dữ liệu giả
    const specialties = [
        { id: 1, name: "Khoa Sản - Phụ khoa", icon: "/icons/obgyn.png" },
        { id: 2, name: "Khám sức khỏe tổng quát", icon: "/icons/general.png" },
        { id: 3, name: "Trung tâm IVF Hồng Ngọc", icon: "/icons/ivf.png" },
        { id: 4, name: "Tiêm Chủng", icon: "/icons/vaccine.png" },
        { id: 5, name: "Khoa Nhi", icon: "/icons/pediatric.png" },
        { id: 6, name: "Khoa Tai Mũi Họng & PT Đầu cổ", icon: "/icons/ent.png" },
        { id: 7, name: "Khoa Tiêu hóa – Gan – Mật", icon: "/icons/digestive.png" },
        // ... thêm các chuyên khoa khác
    ];

    const [searchTerm, setSearchTerm] = useState("");

    // Lọc theo từ khoá
    const filtered = specialties.filter((sp) =>
        sp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Tiêu đề + Tìm kiếm */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 sm:mb-0">
                        Danh sách chuyên khoa
                    </h1>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400"
                    />
                </div>

                {/* Grid các chuyên khoa */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filtered.map((sp) => (
                        <div
                            key={sp.id}
                            className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <Image
                                    src={sp.icon}
                                    alt={sp.name}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-center text-sm font-medium">{sp.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
