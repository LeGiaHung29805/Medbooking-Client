"use client";

import { useState } from "react";

export default function Dashboard() {
  const [pendingAppointments, setPendingAppointments] = useState([
    {
      id: "APT001",
      patientName: "Nguyễn Văn A",
      phone: "0901234567",
      doctor: "BS. Trần Thị B",
      time: "09:00",
      date: "15/11/2025",
      status: "pending",
    },
    {
      id: "APT002",
      patientName: "Lê Thị C",
      phone: "0912345678",
      doctor: "BS. Phạm Văn D",
      time: "10:30",
      date: "15/11/2025",
      status: "pending",
    },
    {
      id: "APT003",
      patientName: "Trần Văn E",
      phone: "0923456789",
      doctor: "BS. Trần Thị B",
      time: "14:00",
      date: "15/11/2025",
      status: "pending",
    },
  ]);

  const todayEvents = [
    {
      time: "09:00",
      event: "Khám tổng quát - BS. Trần Thị B",
      type: "appointment",
    },
    {
      time: "10:30",
      event: "Khám chuyên khoa - BS. Phạm Văn D",
      type: "appointment",
    },
    { time: "14:00", event: "Họp nhóm y tế", type: "meeting" },
    {
      time: "15:30",
      event: "Tư vấn bệnh nhân - BS. Trần Thị B",
      type: "appointment",
    },
  ];

  const confirmAppointment = (id: string) => {
    setPendingAppointments(pendingAppointments.filter((apt) => apt.id !== id));
    alert(`Đã xác nhận lịch hẹn ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Lịch hẹn hôm nay
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 12% so với hôm qua</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã check-in</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">18</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">75% tổng số lịch hẹn</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bệnh nhân đang làm việc
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Đang trong phòng khám</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bác sĩ làm việc
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">8 bác sĩ tổng cộng</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Lịch hẹn chờ xác nhận
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Cần gọi điện xác nhận với bệnh nhân
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded">
                            CHỜ XÁC NHẬN
                          </span>
                          <span className="text-xs text-gray-500">
                            {appointment.id}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mt-2">
                          {appointment.patientName}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>📞 {appointment.phone}</p>
                          <p>👨‍⚕️ {appointment.doctor}</p>
                          <p>
                            🕐 {appointment.time} - {appointment.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => confirmAppointment(appointment.id)}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Xác nhận
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                          Gọi điện
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar/Events */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Sự kiện hôm nay
              </h2>
              <p className="text-sm text-gray-500 mt-1">Thứ Bảy, 15/11/2025</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold ${
                          event.type === "appointment"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {event.time}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {event.event}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.type === "appointment" ? "Lịch khám" : "Họp"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white rounded-lg shadow mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Tháng 11, 2025</h3>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <div key={day} className="font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`py-2 rounded ${
                    day === 15
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
