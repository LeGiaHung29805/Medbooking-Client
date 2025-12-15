"use client";

import { useState, useEffect, useCallback } from "react";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";

// Định nghĩa Interface cho UI (Map từ Model Backend sang)
interface TimeSlotUI {
  id: number;
  doctorId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: "available" | "booked" | "unavailable";
}

export default function DoctorSchedule() {
  // Data State
  const [doctors, setDoctors] = useState<Model.Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotUI[]>([]);
  const [loading, setLoading] = useState(false);

  // UI State
  const [selectedDoctor, setSelectedDoctor] = useState<string>(""); // Lưu ID dạng string
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Mặc định hôm nay
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotUI | null>(null);

  // --- 1. LOAD BÁC SĨ ---

  // --- 2. LOAD SLOT (Khi chọn Bác sĩ) ---
  // Gọi API lấy lịch trống
  const loadSlots = useCallback(async () => {
    if (!selectedDoctor) return;

    setLoading(true);
    try {
      const data = await Api.getDoctorAvailability(Number(selectedDoctor));

      // 🛡️ Guard array
      const safeData = Array.isArray(data) ? data : [];

      const mappedSlots: TimeSlotUI[] = safeData.map((slot) => {
        const startObj = new Date(slot.StartTime);
        const endObj = new Date(slot.EndTime);

        return {
          id: slot.SlotID,
          doctorId: slot.DoctorID,
          date: startObj.toISOString().slice(0, 10), // YYYY-MM-DD (ổn định hơn locale)
          startTime: startObj.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          endTime: endObj.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "available",
        };
      });

      setTimeSlots(mappedSlots);
    } catch (error) {
      console.error("Lỗi tải lịch:", error);
      setTimeSlots([]); // 👈 fallback để không dính .length
    } finally {
      setLoading(false);
    }
  }, [selectedDoctor]);


  // --- 1. LOAD BÁC SĨ ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctors = await Api.getDoctors();
        setDoctors(Array.isArray(doctors) ? doctors : []);
      } catch (error) {
        console.error("Lỗi tải bác sĩ:", error);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);



  // --- 3. XỬ LÝ CẬP NHẬT / XÓA ---
  const updateSlotStatus = async (
    slotId: number,
    newStatus: "available" | "booked" | "unavailable"
  ) => {
    try {
      if (newStatus === "unavailable") {
        // === TRƯỜNG HỢP XÓA SLOT ===
        if (confirm("Bạn có chắc chắn muốn XÓA slot này không?")) {
          await Api.staffDeleteSlot(slotId);
          alert("✅ Đã xóa slot thành công.");
          setShowEditModal(false);
          loadSlots(); // Reload lại list
        }
      } else {
        // === TRƯỜNG HỢP GIỮ NGUYÊN (Hoặc cập nhật giờ - Logic ở nút Save) ===
        // Ở UI này nút bấm đang là chuyển status.
        // Nếu backend không hỗ trợ chuyển 'booked', ta chỉ đóng modal.
        alert(
          "Chức năng chuyển trạng thái nhanh đang phát triển. Vui lòng dùng chức năng Đặt lịch để chuyển sang Booked."
        );
        setShowEditModal(false);
      }
    } catch (error: any) {
      alert(
        "❌ Lỗi: " + (error.response?.data?.message || "Thao tác thất bại")
      );
    }
  };

  // Hàm lưu khi sửa giờ (trong Modal)
  const handleSaveTime = async (newStart: string, newEnd: string) => {
    if (!selectedSlot) return;
    try {
      // Format lại thành YYYY-MM-DD HH:mm:ss để gửi lên Server
      const fullStart = `${selectedSlot.date} ${newStart}:00`;
      const fullEnd = `${selectedSlot.date} ${newEnd}:00`;

      await Api.staffUpdateSlot(
        selectedSlot.id,
        selectedSlot.doctorId,
        fullStart,
        fullEnd
      );
      alert("✅ Cập nhật giờ thành công!");
      setShowEditModal(false);
      loadSlots();
    } catch (error: any) {
      alert(
        "❌ Lỗi cập nhật: " + (error.response?.data?.message || "Lỗi server")
      );
    }
  };

  const editSlot = (slot: TimeSlotUI) => {
    setSelectedSlot(slot);
    setShowEditModal(true);
  };

  // --- LỌC THEO NGÀY ---
  const filteredSlots = timeSlots.filter((slot) => slot.date === selectedDate);

  const availableCount = filteredSlots.filter(
    (s) => s.status === "available"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Lịch làm việc bác sĩ
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Xem và quản lý các slot khám bệnh (Availability)
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
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor.DoctorID} value={doctor.DoctorID}>
                    {doctor.user?.FullName || "Bác sĩ"} - {doctor.specialty?.SpecialtyName || "Chưa có chuyên khoa"}
                  </option>
                ))
              ) : (
                <option disabled>Đang tải bác sĩ...</option>
              )}
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
                {availableCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      {selectedDoctor === "" ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded shadow">
          Vui lòng chọn một bác sĩ để xem lịch.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Danh sách khung giờ
              </h2>
              <p className="text-sm text-gray-500">Ngày: {selectedDate}</p>
            </div>
            <button
              onClick={loadSlots} // Nút refresh
              className="text-blue-600 hover:underline text-sm"
            >
              Làm mới
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">Đang tải dữ liệu...</div>
            ) : filteredSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="border-2 rounded-lg p-4 border-green-200 bg-green-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-white text-green-800">
                        Available
                      </span>
                      <span className="text-xs text-gray-500">#{slot.id}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {slot.startTime} - {slot.endTime}
                    </div>

                    <button
                      onClick={() => editSlot(slot)}
                      className="w-full mt-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                    >
                      Chỉnh sửa / Xóa
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Không có khung giờ trống nào trong ngày này.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditModal && selectedSlot && (
        <EditSlotModal
          slot={selectedSlot}
          onClose={() => setShowEditModal(false)}
          onDelete={() => updateSlotStatus(selectedSlot.id, "unavailable")}
          onSave={handleSaveTime}
        />
      )}
    </div>
  );
}

// Component Modal tách nhỏ để dễ quản lý
function EditSlotModal({
  slot,
  onClose,
  onDelete,
  onSave,
}: {
  slot: TimeSlotUI;
  onClose: () => void;
  onDelete: () => void;
  onSave: (start: string, end: string) => void;
}) {
  const [start, setStart] = useState(slot.startTime);
  const [end, setEnd] = useState(slot.endTime);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Chỉnh sửa khung giờ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Ngày: {slot.date}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="text-xs">Bắt đầu</label>
                <input
                  type="time"
                  className="border p-1 rounded w-full"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs">Kết thúc</label>
                <input
                  type="time"
                  className="border p-1 rounded w-full"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thao tác
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onSave(start, end)}
                className="w-full px-4 py-3 text-left rounded-lg border-2 border-blue-200 hover:border-blue-500 bg-blue-50 flex items-center"
              >
                <span className="mr-2">💾</span> Lưu thay đổi giờ
              </button>

              <button
                onClick={onDelete}
                className="w-full px-4 py-3 text-left rounded-lg border-2 border-red-200 hover:border-red-500 bg-red-50 flex items-center"
              >
                <span className="mr-2">🗑️</span> Xóa (Không khả dụng)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
