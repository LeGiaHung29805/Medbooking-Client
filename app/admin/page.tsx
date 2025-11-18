"use client";

import Link from "next/link";

const cards = [
    { title: "Quản lí người dùng", href: "/admin/users" },
    { title: "Quản lí bác sĩ", href: "/admin/doctor" },
    { title: "Quản lí chuyên khoa", href: "/admin/specialties" },
    { title: "Quản lí dịch vụ khám", href: "/admin/services" },
    { title: "Quản lí hồ sơ bệnh án", href: "/admin/medicalrecord" },
    { title: "Quản lí thống kê báo cáo", href: "/admin/manager" },
];

export default function AdminPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="grid grid-cols-2 gap-6">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.href}
                        className="flex h-40 w-60 items-center justify-center rounded-2xl bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
                    >
                        <span className="text-xl font-semibold">{card.title}</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}
