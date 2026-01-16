"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DoctorSidebar from "./components/DoctorSidebar";
import Header from "./components/Header";
import { doctorService } from "../services/doctorService";

interface DoctorProfile {
  FullName: string;
  specialty: { SpecialtyName: string };
  email?: string;
  phone?: string;
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentDoctor, setCurrentDoctor] = useState<DoctorProfile>({
    FullName: "Đang tải...",
    specialty: { SpecialtyName: "Bác sĩ" }
  });

  const loadDoctorProfile = async (forceRefresh = false) => {
    try {
      const cached = localStorage.getItem("user");

      if (cached && !forceRefresh) {
        const parsed = JSON.parse(cached);
        console.log("Dữ liệu gốc từ CACHE:", parsed);

        const formattedData = {
          FullName: parsed.FullName || "Bác sĩ",
          specialty: {
            SpecialtyName: parsed.doctor_profile?.specialty?.SpecialtyName || "Bác sĩ chuyên khoa"
          },
          email: parsed.Email || parsed.email,
          phone: parsed.PhoneNumber || parsed.phone
        };

        setCurrentDoctor(formattedData);

        if (formattedData.FullName !== "Bác sĩ" && formattedData.FullName !== "Đang tải...") {
          return;
        }
      }

      console.log("Đang gọi API lấy Profile mới...");
      const response = await doctorService.getMyProfile();

      if (response.success && response.data) {
        const d = response.data;

        const doctorData = {
          FullName: d.FullName || "Bác sĩ",
          specialty: {
            SpecialtyName: d.doctor_profile?.specialty?.SpecialtyName || "Chưa xác định"
          },
          email: d.Email,
          phone: d.PhoneNumber
        };

        console.log("Dữ liệu chuẩn sau khi gọi API:", doctorData);

        setCurrentDoctor(doctorData);
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...currentUser, ...d }));
      }
    } catch (error) {
      console.error("Không thể tải thông tin bác sĩ:", error);
      setCurrentDoctor({
        FullName: "Lỗi dữ liệu",
        specialty: { SpecialtyName: "Bác sĩ" }
      });
    }
  };

  // Load lần đầu khi mount
  useEffect(() => {
    loadDoctorProfile();
  }, []);

  // Lắng nghe sự kiện cập nhật thông tin bác sĩ
  useEffect(() => {
    const handleDoctorUpdate = () => {
      loadDoctorProfile(false);
    };

    window.addEventListener("doctorInfoUpdated", handleDoctorUpdate);

    return () => {
      window.removeEventListener("doctorInfoUpdated", handleDoctorUpdate);
    };
  }, []);

  // Tự động refresh khi có flag 
  useEffect(() => {
    const shouldRefresh = localStorage.getItem("profileNeedsRefresh");
    if (shouldRefresh === "true") {
      loadDoctorProfile(true);
      localStorage.removeItem("profileNeedsRefresh");
    }
  }, [pathname]);

  // Xác định tab hiện tại
  const activeTab = pathname === "/Doctor/schedule" ? "schedule"
    : pathname === "/Doctor/records" ? "records"
      : pathname === "/Doctor/settings" ? "settings"
        : "dashboard";

  const handleTabChange = (tab: "dashboard" | "schedule" | "records" | "settings") => {
    const routes: Record<string, string> = {
      dashboard: "/Doctor",
      schedule: "/Doctor/schedule",
      records: "/Doctor/records",
      settings: "/Doctor/settings"
    };
    router.push(routes[tab]);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentDoctor={currentDoctor}
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