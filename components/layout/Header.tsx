"use client";

import { Input } from "../ui/input";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Phone } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "../ui/button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const menu = [
    { name: "Trang chủ", path: "/" },
    { name: "Dịch vụ", path: "/services" },
    { name: "Chuyên khoa", path: "/specialties" },
    { name: "Đội ngũ bác sĩ", path: "/doctors" },
    { name: "Đặt lịch khám online", path: "/login" },
  ];

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white">
      {/* Top green bar - Giảm padding */}
      <div className="bg-gradient-to-r from-green-500 via-green-500 to-green-500">
        <div className="container mx-auto flex justify-between md:justify-end items-center gap-2 md:gap-3 py-2 px-4 md:px-6">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:bg-white/20 p-1.5 rounded-lg transition-all duration-200 active:scale-95"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Phone button - Nhỏ hơn */}
          <a
            href="tel:1900888866"
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-xs md:text-sm group"
          >
            <Phone
              size={16}
              className="group-hover:rotate-12 transition-transform duration-200"
            />
            <span>1900.888.866</span>
          </a>

          {/* Booking button - Nhỏ hơn */}
          <Link
            href="/login"
            className="border-2 border-white text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-white hover:text-green-700 hover:scale-105 active:scale-95 transition-all duration-200 font-medium text-xs md:text-sm shadow-md hover:shadow-lg"
          >
            Đặt lịch khám
          </Link>
        </div>
      </div>

      {/* Logo + slogan + search - Giảm padding đáng kể */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
            {/* Logo - Nhỏ hơn */}
            <Link
              href="/"
              className="flex-shrink-0 hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              <Image
                src="/image/HUNRE_LOGO.svg"
                alt="Bệnh viện HUNRE"
                width={260} // tăng lên
                height={100} // tăng lên
                className="h-16 md:h-20 w-auto object-contain"
                priority
              />
            </Link>

            {/* Slogan - Nhỏ hơn */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <Image
                src="/image/Vi-suc-khoe-toan-dan.jpg"
                alt="Vì sức khoẻ toàn dân"
                width={400}
                height={40}
                className="h-8 md:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Search - Nhỏ hơn */}
            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <div className="relative w-full lg:w-72 xl:w-80 group">
                <Input
                  type="text"
                  placeholder="Từ khóa tìm kiếm..."
                  className="pl-4 pr-12 h-10 md:h-11 bg-gray-50 rounded-full text-sm border-2 border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-100 w-full transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400"
                />
                <Button className="absolute right-0 top-0 h-10 md:h-11 w-10 md:w-11 bg-gradient-to-r from-green-700 to-green-600 rounded-r-full flex items-center justify-center hover:from-green-800 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg group-focus-within:scale-105">
                  <Search size={18} className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Giảm padding */}
      <nav className="bg-white border-b border-gray-100 hidden md:block shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            {menu.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative font-semibold text-sm px-3 lg:px-4 py-3 transition-all duration-200 group ${
                    active
                      ? "text-green-600"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-600 to-green-500 rounded-t-full transition-all duration-300 ${
                      active
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Breadcrumb GỌN - Chỉ hiện khi không phải trang chủ */}
      {pathname !== "/" && (
        <section className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6 py-2.5">
            <Breadcrumb>
              <BreadcrumbList className="text-xs md:text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-green-600 transition-colors font-medium"
                    >
                      Trang chủ
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-gray-900 font-semibold">
                    {menu.find((m) => m.path === pathname)?.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>
      )}

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 md:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="bg-white w-80 h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                <p className="text-xs text-gray-500 mt-1">Điều hướng nhanh</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2.5 rounded-xl transition-all duration-200 active:scale-90"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
              {menu.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-5 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-between group ${
                      active
                        ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-md"
                        : "text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    }`}
                  >
                    <span>{item.name}</span>
                    {active && (
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="pt-6 border-t-2 border-gray-100 space-y-3 mt-auto">
              <a
                href="tel:1900888866"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold active:scale-95"
              >
                <Phone size={20} />
                <span>1900.888.866</span>
              </a>
              <Link
                href="/login"
                className="block text-center border-2 border-green-600 text-green-600 px-5 py-4 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-200 font-semibold shadow-md hover:shadow-lg active:scale-95"
              >
                Đặt lịch khám ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
