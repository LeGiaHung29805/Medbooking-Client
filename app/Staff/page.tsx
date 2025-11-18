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
import Dashboard from "./components/Dashboard";
import AppointmentManagement from "./components/AppointmentManagement";
import PatientManagement from "./components/PatientManagement";
import DoctorSchedule from "./components/DoctorSchedule";

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-5 flex items-center space-x-3">
            <img
              src="image/HUNRE_LOGO.svg"
              alt="Medbooking"
              className="w-60 h-12 object-cover"
            />
            <div className="bg-red-600 text-white font-bold text-xl px-4 py-2 rounded-lg ml-auto">
              ADMIN
            </div>
          </div>

          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📊 Bảng điều khiển
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "appointments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📅 Quản lý lịch hẹn
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "patients"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              👥 Quản lý bệnh nhân
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "schedule"
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
