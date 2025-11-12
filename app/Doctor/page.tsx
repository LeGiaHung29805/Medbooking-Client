"use client"
import Link from "next/link";
import { useState } from "react";

export default function Header() {

    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-8xl mx-auto flex justify-between items-center p-4">
                <Link href="/" className="hover:opacity-60">
                    <h1 className="text-xl font-bold">HUNRE Hospital</h1>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link href="/admin" className="hover:opacity-80">
                        Admin
                    </Link> <Link href="/admin/users" className="hover:opacity-80">
                        Quản lí người dùng
                    </Link>
                    <Link href="/admin/doctor" className="hover:opacity-80">
                        Quản lí bác sĩ
                    </Link>
                    <Link href="/admin/specialties" className="hover:opacity-80">
                        Quản lí chuyên khoa
                    </Link>
                    <Link href="/admin/services" className="hover:opacity-80">
                        Quản lí dịch vụ khám
                    </Link>
                    <Link href="/admin/medicalrecord" className="hover:opacity-80">
                        Quản lí hồ sơ bệnh án
                    </Link>
                    <Link href="/admin/manager" className="hover:opacity-80">
                        Quản lí thống kê - báo cáo
                    </Link>
                </div>
            </div>
        </header>
    );
}
