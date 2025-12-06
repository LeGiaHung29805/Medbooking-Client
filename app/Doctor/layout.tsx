// app/Doctor/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DoctorSidebar from "./components/DoctorSidebar";
import Header from "./components/Header";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Nguyễn Văn A",
    specialty: "Nội tổng quát"
  });

  // Load doctor info từ localStorage khi component mount
  useEffect(() => {
    const savedDoctorInfo = localStorage.getItem('doctorInfo');
    if (savedDoctorInfo) {
      try {
        const parsedInfo = JSON.parse(savedDoctorInfo);
        setDoctorInfo({
          name: parsedInfo.name || "Nguyễn Văn A",
          specialty: parsedInfo.specialty || "Nội tổng quát"
        });
      } catch (error) {
        console.error("Error parsing doctor info:", error);
      }
    }
  }, []);

  // Listen for storage changes (khi Settings page lưu thay đổi)
  useEffect(() => {
  const handleDoctorInfoUpdate = () => {
    const savedDoctorInfo = localStorage.getItem('doctorInfo');
    if (savedDoctorInfo) {
      try {
        const parsedInfo = JSON.parse(savedDoctorInfo);
        setDoctorInfo({
          name: parsedInfo.name || "Nguyễn Văn A",
          specialty: parsedInfo.specialty || "Nội tổng quát"
        });
      } catch (error) {
        console.error("Error parsing doctor info:", error);
      }
    }
  };

  // Lắng nghe cả storage event VÀ custom event
  window.addEventListener('storage', handleDoctorInfoUpdate);
  window.addEventListener('doctorInfoUpdated', handleDoctorInfoUpdate);
  
  return () => {
    window.removeEventListener('storage', handleDoctorInfoUpdate);
    window.removeEventListener('doctorInfoUpdated', handleDoctorInfoUpdate);
  };
}, []);

  // Xác định tab hiện tại từ URL
  const activeTab = pathname === "/Doctor/schedule" ? "schedule" :
                    pathname === "/Doctor/records" ? "records" :
                    pathname === "/Doctor/settings" ? "settings" : "dashboard";

  const handleTabChange = (tab: "dashboard" | "schedule" | "records" | "settings") => {
    if (tab === "dashboard") router.push("/Doctor");
    if (tab === "schedule") router.push("/Doctor/schedule");
    if (tab === "records") router.push("/Doctor/records");
    if (tab === "settings") router.push("/Doctor/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("api_token");
    localStorage.removeItem("doctorInfo"); // Xóa thông tin bác sĩ
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentDoctor={{
          FullName: doctorInfo.name, // Dùng state động
          specialty: { SpecialtyName: doctorInfo.specialty }
        }}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}