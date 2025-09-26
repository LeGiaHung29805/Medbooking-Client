/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";

export default function Header() {
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
                    {/* Logo (ảnh click về trang chủ) */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/image/logo-bach-mai.jpg"
                            alt="Bệnh viện Bạch Mai"
                            className="h-16"
                        />
                    </Link>

                    {/* Slogan (ảnh) */}
                    <img
                        src="/image/Vi-suc-khoe-toan-dan.jpg"
                        alt="Vì sức khoẻ toàn dân"
                        className="h-10"
                    />

                    {/* Search */}
                    <div className="flex items-center border rounded-full px-3 py-2 w-1/3 bg-gray-100">
                        <input
                            type="text"
                            placeholder="Từ khóa tìm kiếm..."
                            className="flex-1 outline-none bg-transparent text-sm"
                        />
                        <Search className="text-green-700" size={18} />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white border-t border-b">
                <div className="container mx-auto flex items-center justify-center px-6 py-2">
                    <div className="flex space-x-6">
                        {/* Dropdown Dịch vụ y tế */}
                        <DropdownMenu>
                            <div className="flex items-center">
                                <Link href="/services" className="mr-1">
                                    Dịch vụ y tế
                                </Link>
                                <DropdownMenuTrigger className="outline-none">
                                    <ChevronDown size={14} />
                                </DropdownMenuTrigger>
                            </div>

                            <DropdownMenuContent className="bg-white text-black w-64">
                                {/* Thai sản & Phụ khoa */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Thai sản & Phụ khoa
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-white text-black">
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Giới thiệu khoa phụ sản
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/doi-ngu">
                                                Đội ngũ y bác sĩ
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/tien-nghi">
                                                Tiện nghi khoa phụ sản
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/goi-thai-san">
                                                Các gói thai sản hiện nay
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                hội thảo thai sản
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Trải nghiệm sản phụ
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Message bầu & sau sinh
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Thông tắc tia sữa
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Cấy que tránh thai
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Thai Sản BabyMoon
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Bài thuốc lợi sữa y học cổ truyền
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Gói chăm sóc sau sinh tại viện
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/thai-san/gioi-thieu">
                                                Xông hơi phục hồi sàn chậu sau sinh
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* Khám sức khỏe */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Nghỉ dưỡng trước và sau sinh
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-white text-black">
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/kham-suc-khoe/tong-quat">
                                                Khám tổng quát
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/kham-suc-khoe/dinh-ky">
                                                Khám định kỳ
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/services/kham-suc-khoe/doanh-nghiep">
                                                Khám doanh nghiệp
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* Các dịch vụ khác */}
                                <DropdownMenuItem asChild>
                                    <Link href="/services/xet-nghiem">Xét nghiệm</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/services/tiem-chung">Tiêm chủng</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/services/noi-soi">Nội soi</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/specialties">Chuyên khoa</Link>
                        <Link href="/doctors">Đội ngũ bác sĩ</Link>
                        <Link href="/guides">Hướng dẫn thăm khám</Link>
                        <Link href="">Đặt lịch khám</Link>
                        {/* <Link href="/news">Tin tức</Link>
                        <Link href="/about">Về chúng tôi</Link>
                        <Link href="/recruitment">Tuyển dụng</Link>
                        <Link href="/contact">Liên hệ</Link> */}
                    </div>

                    {/* Flag + Toggle */}
                    {/* <div className="flex items-center space-x-2">
                        <img src="/vn-flag.png" alt="VN" className="h-4" />
                        <button className="ml-2">☰</button>
                    </div> */}
                </div>
            </nav>
        </header>
    );
}
