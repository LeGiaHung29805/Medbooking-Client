"use client";

import { useState } from "react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
}

interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "unavailable";
  patientName?: string;
  appointmentId?: string;
}

export default function DoctorSchedule() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("2025-11-15");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const doctors: Doctor[] = [
    {
      id: "DOC001",
      name: "BS. Trần Thị B",
      specialty: "Nội khoa",
      phone: "0981234567",
      email: "tranthib@hospital.com",
    },
    {
      id: "DOC002",
      name: "BS. Phạm Văn D",
      specialty: "Ngoại khoa",
      phone: "0982345678",
      email: "phamvand@hospital.com",
    },
    {
      id: "DOC003",
      name: "BS. Nguyễn Văn G",
      specialty: "Tim mạch",
      phone: "0983456789",
      email: "nguyenvang@hospital.com",
    },
    {
      id: "DOC004",
      name: "BS. Lê Thị H",
      specialty: "Da liễu",
      phone: "0984567890",
      email: "lethih@hospital.com",
    },
  ];

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    // BS. Trần Thị B
    {
      id: "TS001",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "08:00",
      endTime: "08:30",
      status: "available",
    },
    {
      id: "TS002",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "08:30",
      endTime: "09:00",
      status: "available",
    },
    {
      id: "TS003",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "09:00",
      endTime: "09:30",
      status: "booked",
      patientName: "Nguyễn Văn A",
      appointmentId: "APT001",
    },
    {
      id: "TS004",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "09:30",
      endTime: "10:00",
      status: "available",
    },
    {
      id: "TS005",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "10:00",
      endTime: "10:30",
      status: "available",
    },
    {
      id: "TS006",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "10:30",
      endTime: "11:00",
      status: "available",
    },
    {
      id: "TS007",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "14:00",
      endTime: "14:30",
      status: "booked",
      patientName: "Trần Văn E",
      appointmentId: "APT003",
    },
    {
      id: "TS008",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "14:30",
      endTime: "15:00",
      status: "available",
    },
    {
      id: "TS009",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "15:00",
      endTime: "15:30",
      status: "available",
    },
    {
      id: "TS010",
      doctorId: "DOC001",
      date: "2025-11-15",
      startTime: "15:30",
      endTime: "16:00",
      status: "unavailable",
    },

    // BS. Phạm Văn D
    {
      id: "TS011",
      doctorId: "DOC002",
      date: "2025-11-15",
      startTime: "08:00",
      endTime: "08:30",
      status: "available",
    },
    {
      id: "TS012",
      doctorId: "DOC002",
      date: "2025-11-15",
      startTime: "08:30",
      endTime: "09:00",
      status: "available",
    },
    {
      id: "TS013",
      doctorId: "DOC002",
      date: "2025-11-15",
      startTime: "09:00",
      endTime: "09:30",
      status: "available",
    },
    {
      id: "TS014",
      doctorId: "DOC002",
      date: "2025-11-15",
      startTime: "09:30",
      endTime: "10:00",
      status: "available",
    },
    {
      id: "TS015",
      doctorId: "DOC002",
      date: "2025-11-15",
      startTime: "10:00",
      endTime: "10:30",
      status: "available",
    },
    {
      id: "TS016",
      doctorId: "DOC002",
      date: "2025-11-15",
      startTime: "10:30",
      endTime: "11:00",
      status: "booked",
      patientName: "Lê Thị C",
      appointmentId: "APT002",
    },

    // BS. Nguyễn Văn G
    {
      id: "TS017",
      doctorId: "DOC003",
      date: "2025-11-15",
      startTime: "08:00",
      endTime: "08:30",
      status: "available",
    },
    {
      id: "TS018",
      doctorId: "DOC003",
      date: "2025-11-15",
      startTime: "08:30",
      endTime: "09:00",
      status: "available",
    },
    {
      id: "TS019",
      doctorId: "DOC003",
      date: "2025-11-15",
      startTime: "09:00",
      endTime: "09:30",
      status: "available",
    },
    {
      id: "TS020",
      doctorId: "DOC003",
      date: "2025-11-15",
      startTime: "13:00",
      endTime: "13:30",
      status: "unavailable",
    },
    {
      id: "TS021",
      doctorId: "DOC003",
      date: "2025-11-15",
      startTime: "13:30",
      endTime: "14:00",
      status: "unavailable",
    },

    // BS. Lê Thị H
    {
      id: "TS022",
      doctorId: "DOC004",
      date: "2025-11-15",
      startTime: "08:00",
      endTime: "08:30",
      status: "available",
    },
    {
      id: "TS023",
      doctorId: "DOC004",
      date: "2025-11-15",
      startTime: "08:30",
      endTime: "09:00",
      status: "available",
    },
    {
      id: "TS024",
      doctorId: "DOC004",
      date: "2025-11-15",
      startTime: "09:00",
      endTime: "09:30",
      status: "available",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "booked":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "unavailable":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Còn trống";
      case "booked":
        return "Đã đặt";
      case "unavailable":
        return "Không khả dụng";
      default:
        return status;
    }
  };

  const filteredSlots = timeSlots.filter((slot) => {
    const matchesDoctor = !selectedDoctor || slot.doctorId === selectedDoctor;
    const matchesDate = slot.date === selectedDate;
    return matchesDoctor && matchesDate;
  });

  const availableSlots = filteredSlots.filter(
    (slot) => slot.status === "available"
  );

  const updateSlotStatus = (
    slotId: string,
    newStatus: "available" | "booked" | "unavailable"
  ) => {
    setTimeSlots(
      timeSlots.map((slot) =>
        slot.id === slotId ? { ...slot, status: newStatus } : slot
      )
    );
    setShowEditModal(false);
    setSelectedSlot(null);
  };

  const editSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Lịch làm việc bác sĩ
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Xem và quản lý lịch làm việc của các bác sĩ
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn bác sĩ
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả bác sĩ</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn ngày
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Khung giờ còn trống</p>
              <p className="text-2xl font-bold text-blue-600">
                {availableSlots.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      {selectedDoctor === "" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => {
            const doctorSlots = filteredSlots.filter(
              (slot) => slot.doctorId === doctor.id
            );
            const availableCount = doctorSlots.filter(
              (slot) => slot.status === "available"
            ).length;
            const bookedCount = doctorSlots.filter(
              (slot) => slot.status === "booked"
            ).length;

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-lg">
                      {doctor.name.split(" ").pop()?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {doctor.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {doctor.email}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Còn trống:</span>
                    <span className="text-lg font-bold text-green-600">
                      {availableCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đã đặt:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {bookedCount}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoctor(doctor.id)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xem lịch chi tiết
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {doctors.find((d) => d.id === selectedDoctor)?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {doctors.find((d) => d.id === selectedDoctor)?.specialty} -{" "}
                {selectedDate}
              </p>
            </div>
            <button
              onClick={() => setSelectedDoctor("")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Quay lại
            </button>
          </div>

          <div className="p-6">
            {filteredSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`border-2 rounded-lg p-4 ${getStatusColor(
                      slot.status
                    )}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded">
                        {getStatusText(slot.status)}
                      </span>
                      <span className="text-xs text-gray-500">{slot.id}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    {slot.patientName && (
                      <div className="text-sm text-gray-600 mb-2">
                        <p>👤 {slot.patientName}</p>
                        <p className="text-xs">#{slot.appointmentId}</p>
                      </div>
                    )}
                    <button
                      onClick={() => editSlot(slot)}
                      className="w-full mt-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Không có khung giờ nào trong ngày này
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Chỉnh sửa khung giờ
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Khung giờ</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedSlot.startTime} - {selectedSlot.endTime}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Ngày: {selectedSlot.date}
                </p>
                {selectedSlot.patientName && (
                  <p className="text-sm text-gray-600">
                    Bệnh nhân: {selectedSlot.patientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cập nhật trạng thái
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      updateSlotStatus(selectedSlot.id, "available")
                    }
                    className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-colors ${
                      selectedSlot.status === "available"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">Còn trống</p>
                        <p className="text-xs text-gray-500">
                          Bệnh nhân có thể đặt lịch
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      updateSlotStatus(selectedSlot.id, "unavailable")
                    }
                    className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-colors ${
                      selectedSlot.status === "unavailable"
                        ? "border-gray-500 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Không khả dụng
                        </p>
                        <p className="text-xs text-gray-500">
                          Bác sĩ có việc đột xuất
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
