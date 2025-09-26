"use client";

import { useState } from "react";
import Image from "next/image";
import Layout from "@/components/layout";

export default function ServicesPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = [
        { id: "all", name: "Tất cả", count: 138 },
        { id: "obgyn", name: "Thai sản & Sinh con", count: 12 },
        { id: "general", name: "Khám sức khỏe tổng quát", count: 10 },
        { id: "icu", name: "Khoa Cấp cứu - ICU", count: 3 },
    ];

    const services = [
        {
            id: 1,
            category: "obgyn",
            name: "Thai sản và sinh con trọn gói",
            description:
                "Dịch vụ chăm sóc thai sản toàn diện, đồng hành cùng mẹ bầu…",
            image: "/images/service1.jpg",
        },
        {
            id: 2,
            category: "general",
            name: "Khám sức khỏe tổng quát",
            description:
                "Gồm các hạng mục khám lâm sàng, chẩn đoán hình ảnh, xét nghiệm…",
            image: "/images/service2.jpg",
        },
        {
            id: 3,
            category: "icu",
            name: "Nội soi tiêu hóa NBI - EXTRA III",
            description:
                "Nội soi tiêu hóa ứng dụng công nghệ hiện đại NBI - EXTRA III…",
            image: "/images/service3.jpg",
        },
    ];

    const filteredServices =
        selectedCategory === "all"
            ? services
            : services.filter((s) => s.category === selectedCategory);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Bộ lọc bên trái */}
                <aside className="md:col-span-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full mb-4 px-3 py-2 border rounded"
                    />
                    <ul className="space-y-2">
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`cursor-pointer px-3 py-2 rounded border ${selectedCategory === cat.id
                                        ? "bg-green-700 text-white"
                                        : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex justify-between">
                                    <span>{cat.name}</span>
                                    <span className="font-bold">{cat.count}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Danh sách dịch vụ */}
                <main className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <Image
                                src={service.image}
                                alt={service.name}
                                width={400}
                                height={250}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <p className="text-sm text-gray-600">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </Layout>
    );
}
