"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone, MapPin, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/ApiClient"; // Import hàm logout từ API

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // SỬA ĐỔI: Kiểm tra 'api_token' thay vì 'token' để khớp với ApiClient
    const token = localStorage.getItem("api_token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleBookingClick = () => {
    const token = localStorage.getItem("api_token"); // Kiểm tra api_token
    if (!token) router.push("/login");
    else router.push("/dat-lich");
  };

  const handleLogout = async () => {
    try {
      // Gọi API logout để server hủy token (nếu cần)
      await logout();
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    }

    // Xóa sạch các key liên quan đến phiên đăng nhập
    localStorage.removeItem("api_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("token"); // Xóa cả key cũ nếu có

    setIsLoggedIn(false);

    // Chuyển về trang login hoặc trang chủ
    router.push("/login");
  };

  return (
    <header className="w-full bg-white">
      <div className="w-full border-b">
        <div className="container mx-auto grid grid-cols-3 items-center py-4 px-6 gap-4">
          {/* Logo */}
          <Link href="/" className="flex justify-start">
            <Image
              src="/image/HUNRE_LOGO.svg"
              alt="Bệnh viện HUNRE"
              width={400}
              height={150}
            // className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Banner */}
          <div className="flex justify-center">
            <Image
              src="/image/vi-suc-khoe-toan-dan.jpg"
              alt="Vì sức khoẻ nhân dân"
              width={400}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Liên hệ + login/logout */}
          <div className="flex flex-col items-end text-sm space-y-2">
            <div className="flex items-center space-x-6">
              <Phone className="w-5 h-5 text-green-700" />
              <span className="text-base font-medium">1900.888.866</span>

              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 text-gray-800 hover:text-green-700"
                >
                  <User className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </Link>
              ) : (
                // SỬA ĐỔI: Nút Đăng xuất gọi hàm handleLogout mới
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-800 hover:text-green-700"
                >
                  <User className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              )}

              <button className="flex items-center space-x-1 hover:underline">
                <Image
                  src="/image/lang_en.png"
                  alt="English"
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-sm"
                />
                <span>English</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-gray-700 text-right whitespace-nowrap">
              <MapPin className="w-5 h-5 text-green-700" />
              <span className="text-base font-medium">
                41A Đ.Phú Diễn, Phường Phú Diễn, Thành phố Hà Nội
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto flex justify-center space-x-10 px-6 py-3 font-medium">
          <Link href="/" className="hover:underline">
            Trang chủ
          </Link>
          <Link href="/services" className="hover:underline">
            Dịch vụ
          </Link>
          <Link href="/specialties" className="hover:underline">
            Chuyên khoa
          </Link>
          <Link href="/doctors" className="hover:underline">
            Đội ngũ bác sĩ
          </Link>
          <button onClick={handleBookingClick} className="hover:underline">
            Dịch vụ khám online
          </button>

          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center space-x-1 hover:underline focus:outline-none"
                >
                  {/* Phần chữ: click sẽ đi tới /Users/profile cho đồng bộ */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn DropdownMenuTrigger bắt sự kiện
                      router.push("/Users/profile");
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    Cá nhân
                  </span>

                  {/* Mũi tên: mở menu */}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/Users/profile">Hồ sơ cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/quan-ly-gia-dinh">Quản lý gia đình</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/ket-qua-benh-kham">Kết quả bệnh khám</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/lich-su-kham">Lịch hẹn khám lại</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/bac-si-cua-toi">Bác sĩ của tôi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/nhan-xet">Nhận xét, góp ý</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/thong-bao">Thông báo</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/Users/thay-doi-mat-khau">Thay đổi mật khẩu</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}