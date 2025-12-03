// app/Doctor/layout.tsx
"use client";

import { useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import Header from "./Header";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "schedule" | "records" | "settings">("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("api_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      {/* Sidebar duy nhất - DoctorSidebar */}
      <DoctorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentDoctor={{
          FullName: "Nguyễn Văn A",
          specialty: { SpecialtyName: "Nội tổng quát" }
        }}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className={`flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "ml-0" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}