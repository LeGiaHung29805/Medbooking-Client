"use client";

import { useState } from "react";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "checked-in";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  reason: string;
}

export default function AppointmentManagement() {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDoctor, setFilterDoctor] = useState<string>("all");

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT001",
      patientName: "Nguyễn Văn A",
      patientPhone: "0901234567",
      patientEmail: "nguyenvana@email.com",
      doctorName: "BS. Trần Thị B",
      doctorId: "DOC001",
      date: "2025-11-15",
      time: "09:00",
      status: "pending",
      reason: "Khám tổng quát",
    },
    {
      id: "APT002",
      patientName: "Lê Thị C",
      patientPhone: "0912345678",
      patientEmail: "lethic@email.com",
      doctorName: "BS. Phạm Văn D",
      doctorId: "DOC002",
      date: "2025-11-15",
      time: "10:30",
      status: "confirmed",
      reason: "Khám chuyên khoa",
    },
    {
      id: "APT003",
      patientName: "Trần Văn E",
      patientPhone: "0923456789",
      patientEmail: "tranvane@email.com",
      doctorName: "BS. Trần Thị B",
      doctorId: "DOC001",
      date: "2025-11-15",
      time: "14:00",
      status: "checked-in",
      reason: "Tái khám",
    },
    {
      id: "APT004",
      patientName: "Phạm Thị F",
      patientPhone: "0934567890",
      patientEmail: "phamthif@email.com",
      doctorName: "BS. Nguyễn Văn G",
      doctorId: "DOC003",
      date: "2025-11-16",
      time: "09:00",
      status: "confirmed",
      reason: "Khám tim mạch",
    },
    {
      id: "APT005",
      patientName: "Hoàng Văn H",
      patientPhone: "0945678901",
      patientEmail: "hoangvanh@email.com",
      doctorName: "BS. Trần Thị B",
      doctorId: "DOC001",
      date: "2025-11-16",
      time: "11:00",
      status: "cancelled",
      reason: "Khám da liễu",
    },
  ]);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "checked-in":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "checked-in":
        return "Đã check-in";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const updateAppointmentStatus = (
    id: string,
    newStatus: AppointmentStatus
  ) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const matchesDoctor =
      filterDoctor === "all" || apt.doctorId === filterDoctor;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý tất cả lịch hẹn của bệnh nhân
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Tạo lịch hẹn mới</span>
        </button>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân, bác sĩ, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="checked-in">Đã check-in</option>
              <option value="cancelled">Đã hủy</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
          <div>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả bác sĩ</option>
              <option value="DOC001">BS. Trần Thị B</option>
              <option value="DOC002">BS. Phạm Văn D</option>
              <option value="DOC003">BS. Nguyễn Văn G</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Lịch
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Bảng
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "calendar" ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded">
                      {getStatusText(appointment.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {appointment.id}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {appointment.patientName}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>👨‍⚕️ {appointment.doctorName}</p>
                    <p>📅 {appointment.date}</p>
                    <p>🕐 {appointment.time}</p>
                    <p>📋 {appointment.reason}</p>
                  </div>
                  <div className="flex space-x-2">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "confirmed")
                        }
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                      >
                        Xác nhận
                      </button>
                    )}
                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "checked-in")
                        }
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                      >
                        Check-in
                      </button>
                    )}
                    {(appointment.status === "pending" ||
                      appointment.status === "confirmed") && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "cancelled")
                        }
                        className="flex-1 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.patientPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {appointment.status === "pending" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "confirmed")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Xác nhận
                      </button>
                    )}
                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "checked-in")
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Check-in
                      </button>
                    )}
                    {(appointment.status === "pending" ||
                      appointment.status === "confirmed") && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "cancelled")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tạo lịch hẹn mới
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ đệm
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn bác sĩ
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>BS. Trần Thị B - Nội khoa</option>
                  <option>BS. Phạm Văn D - Ngoại khoa</option>
                  <option>BS. Nguyễn Văn G - Tim mạch</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày khám
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ khám
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do khám
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Tạo lịch hẹn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
