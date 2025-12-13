"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DoctorSidebar from "./components/DoctorSidebar";
import Header from "./components/Header";
import { doctorService } from "../services/doctorService";

// Define type cho doctor profile
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

  // Hàm tải thông tin bác sĩ - ưu tiên cache, có thể force refresh
  const loadDoctorProfile = async (forceRefresh = false) => {
    try {
      // Ưu tiên lấy từ localStorage (cache nhanh)
      const cached = localStorage.getItem("doctorInfo");
      if (cached && !forceRefresh) {
        const parsed = JSON.parse(cached);

        setCurrentDoctor({
          FullName: parsed.FullName || "Bác sĩ",
          specialty: {
            SpecialtyName:
              typeof parsed.specialty === "string"
                ? parsed.specialty
                : (parsed.specialty?.SpecialtyName || "Chưa xác định")
          },
          email: parsed.email,
          phone: parsed.phone
        });
        return; // Dùng cache xong thì return, không gọi API
      }

      // Nếu không có cache hoặc force refresh → gọi API thật
      const profileData = await doctorService.getMyProfile();

      if (profileData) {
        const doctorData = {
          FullName: profileData.FullName || "Bác sĩ",
          specialty: {
            SpecialtyName: profileData.specialty?.SpecialtyName || "Chưa xác định"
          },
          email: profileData.email,
          phone: profileData.phone
        };

        // Cập nhật state
        setCurrentDoctor(doctorData);

        // Lưu vào cache để lần sau dùng nhanh
        localStorage.setItem("doctorInfo", JSON.stringify(doctorData));
      }
    } catch (error) {
      console.error("Không thể tải thông tin bác sĩ:", error);
      setCurrentDoctor({
        FullName: "Lỗi tải dữ liệu",
        specialty: { SpecialtyName: "Bác sĩ" }
      });
    }
  };

  // Load lần đầu khi mount
  useEffect(() => {
    loadDoctorProfile();
  }, []);

  // Lắng nghe sự kiện cập nhật từ Settings hoặc nơi khác
  useEffect(() => {
  const handleDoctorUpdate = () => {
    loadDoctorProfile(false); // ← Chỉ reload từ cache mới, KHÔNG gọi API
  };

  window.addEventListener("doctorInfoUpdated", handleDoctorUpdate);

  return () => {
    window.removeEventListener("doctorInfoUpdated", handleDoctorUpdate);
  };
}, []);

  // Tự động refresh khi có flag (nếu cần)
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