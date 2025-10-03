"use client";

import Link from "next/link";

const cards = [
    { title: "Banner", href: "/admin/banner" },
    { title: "Thương hiệu", href: "/admin/brand" },
    { title: "Danh mục", href: "/admin/category" },
    { title: "Sản phẩm", href: "/admin/product" },
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
