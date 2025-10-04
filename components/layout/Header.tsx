"use client";

import { Input } from "../ui/input";
import Image from "next/image";
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
        "/specialties": "/image/chuyen-khoa-hong-ngoc.d316f729.png",
        "/doctors": "/image/doi-ngu-bac-si-hong-ngoc.a4e50ffc.png",
        "/login": "/image/banner1.jpg",
    };

    const bgImage = breadcrumbBackgrounds[pathname] || "/image/bg-default.jpg";

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
                        <Image
                            src="/image/HUNRE_Logo.png"
                            alt="Bệnh viện HUNRE"
                            width={100}
                            height={80}
                            priority
                        />
                    </Link>

                    {/* Slogan */}
                    <Image
                        src="/image/Vi-suc-khoe-toan-dan.jpg"
                        alt="Vì sức khoẻ toàn dân"
                        width={160}
                        height={40}
                        className="h-10 w-auto"
                    />

                    {/* Search */}
                    <div className="hidden md:block w-1/3">
                        <div className="relative">
                            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700" size={18} />
                            <Input
                                type="text"
                                placeholder="Từ khóa tìm kiếm..."
                                className="pl-9 pr-3 bg-gray-100 rounded-full text-sm border-0 focus-visible:ring-0 shadow-none"
                            /> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hamburger button */}
            <button
                className="md:hidden text-green-700 px-6 py-2"
                onClick={() => setMobileOpen(true)}
            >
                <Menu size={28} />
            </button>

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
                    <div className="bg-white/10 py-16 md:py-24">
                        <div className="container mx-auto px-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                {menu.find((m) => m.path === pathname)?.name}
                            </h1>
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
