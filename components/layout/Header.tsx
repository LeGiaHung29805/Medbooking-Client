/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    // Ảnh nền breadcrumb cho từng trang
    const breadcrumbBackgrounds: Record<string, string> = {
        "/services": "/image/dich-vu-hong-ngoc.8d6367fa.png",
        "/specialties": "/image/banner1.jpg",
        "/doctors": "/image/banner1.jpg",
        "/login": "/image/banner1.jpg",
    };

    // fallback ảnh mặc định nếu không có trong map
    const bgImage =
        breadcrumbBackgrounds[pathname] || "/image/bg-default.jpg";

    const menu = [
        { name: "Trang chủ", path: "/" },
        { name: "Dịch vụ", path: "/services" },
        { name: "Chuyên khoa", path: "/specialties" },
        { name: "Đội ngũ bác sĩ", path: "/doctors" },
        { name: "Đặt lịch khám online", path: "/login" },
    ];

    return (
        <header className="border-b shadow-sm">
            {/* Top green bar */}
            <div className="bg-green-700 text-white">
                <div className="container mx-auto flex justify-end items-center space-x-4 py-2 px-6 text-sm">
                    <button className="border border-white px-4 py-1 rounded-full hover:bg-white hover:text-green-700 transition">
                        Gọi tổng đài 1900.888.866
                    </button>
                    <button className="border border-white px-4 py-1 rounded-full hover:bg-white hover:text-green-700 transition">
                        Đặt lịch khám
                    </button>
                </div>
            </div>

            {/* Logo + slogan + search */}
            <div className="bg-white">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/image/logo-bach-mai.jpg"
                            alt="Bệnh viện Bạch Mai"
                            className="h-16"
                        />
                    </Link>

                    {/* Slogan */}
                    <img
                        src="/image/Vi-suc-khoe-toan-dan.jpg"
                        alt="Vì sức khoẻ toàn dân"
                        className="h-10"
                    />

                    {/* Search */}
                    <div className="hidden md:flex items-center border rounded-full px-3 py-2 w-1/3 bg-gray-100">
                        <input
                            type="text"
                            placeholder="Từ khóa tìm kiếm..."
                            className="flex-1 outline-none bg-transparent text-sm"
                        />
                        <Search className="text-green-700" size={18} />
                    </div>

                    {/* Hamburger button */}
                    <button
                        className="md:hidden text-green-700"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white border-t border-b">
                <div className="container mx-auto flex items-center justify-center px-6 py-2">
                    <div className="flex space-x-6">
                        {menu.map((item) => {
                            const active = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`font-medium transition hover:text-green-600 ${active
                                        ? "text-green-600 border-b-2 border-green-600"
                                        : "text-gray-800"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Breadcrumb với ảnh nền */}
            {pathname !== "/" && (
                <div
                    className="relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    {/* overlay mờ để chữ dễ đọc */}
                    <div className="bg-white/30 py-16 md:py-24">
                        <div className="container mx-auto px-6">
                            {/* Tiêu đề chính */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {menu.find((m) => m.path === pathname)?.name}
                            </h1>

                            {/* Breadcrumb shadcn */}
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="/">Trang chủ</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>

                                    <BreadcrumbSeparator />

                                    <BreadcrumbItem>
                                        <BreadcrumbLink>
                                            {menu.find((m) => m.path === pathname)?.name}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile menu overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
                    <div className="bg-white w-64 h-full p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <button onClick={() => setMobileOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-4">
                            {menu.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
