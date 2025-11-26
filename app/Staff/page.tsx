// "use client";
// import Link from "next/link";
// import { useState } from "react";

// export default function Header() {
//   const [query, setQuery] = useState("");
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleSubmit();
//     }
//   };
//   const handleSubmit = () => {
//     console.log("Search submitted:", query);
//     // TODO: Redirect hoặc lọc sản phẩm
//   };
//   return (
//     <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md sticky top-0 z-50">
//       <div className="max-w-8xl mx-auto flex justify-between items-center p-4">
//         <Link href="/" className="hover:opacity-60">
//           <h1 className="text-xl font-bold">HUNRE Hospital</h1>
//         </Link>
//         <div className="flex items-center space-x-6">
//           <Link href="/admin" className="hover:opacity-80">
//             Admin
//           </Link>{" "}
//           <Link href="/admin/users" className="hover:opacity-80">
//             Quản lí người dùng
//           </Link>
//           <Link href="/admin/doctor" className="hover:opacity-80">
//             Quản lí bác sĩ
//           </Link>
//           <Link href="/admin/specialties" className="hover:opacity-80">
//             Quản lí chuyên khoa
//           </Link>
//           <Link href="/admin/services" className="hover:opacity-80">
//             Quản lí dịch vụ khám
//           </Link>
//           <Link href="/admin/medicalrecord" className="hover:opacity-80">
//             Quản lí hồ sơ bệnh án
//           </Link>
//           <Link href="/admin/manager" className="hover:opacity-80">
//             Quản lí thống kê - báo cáo
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import Router
import { LogOut } from "lucide-react"; // Import Icon
import * as Api from "@/lib/ApiClient"; // 2. Import API

import Dashboard from "./components/Dashboard";
import AppointmentManagement from "./components/AppointmentManagement";
import PatientManagement from "./components/PatientManagement";
import DoctorSchedule from "./components/DoctorSchedule";

export default function StaffPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loggingOut, setLoggingOut] = useState(false); // State loading logout

  // 3. Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    setLoggingOut(true);
    try {
      await Api.logout(); // Gọi API logout để xóa token server (nếu có)
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      // Xóa token client và chuyển hướng
      localStorage.removeItem("api_token");
      localStorage.removeItem("user_role");
      router.push("/login"); // Chuyển về trang đăng nhập
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/image/HUNRE_LOGO.svg"
                alt="Medbooking"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Right Side: Badge & Logout */}
            <div className="flex items-center gap-4">
              <div className="bg-red-600 text-white font-bold text-sm px-3 py-1 rounded shadow-sm">
                STAFF / ADMIN
              </div>

              {/* Nút Đăng Xuất */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? "Đang thoát..." : "Đăng xuất"}
              </button>
            </div>
          </div>

          {/* Tabs Menu */}
          <div className="flex space-x-8 overflow-x-auto border-t border-gray-100 pt-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${activeTab === "dashboard"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              📊 Bảng điều khiển
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${activeTab === "appointments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              📅 Quản lý lịch hẹn
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${activeTab === "patients"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              👥 Quản lý bệnh nhân
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${activeTab === "schedule"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              🗓️ Lịch làm việc bác sĩ
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "appointments" && <AppointmentManagement />}
        {activeTab === "patients" && <PatientManagement />}
        {activeTab === "schedule" && <DoctorSchedule />}
      </main>
    </div>
  );
}