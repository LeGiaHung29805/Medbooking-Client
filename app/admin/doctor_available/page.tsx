"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";

// ===============================================
// 1. TYPE DEFINITIONS & HELPERS
// ===============================================

// Interface cho form tạo mới
interface NewSlotForm {
  doctor_id: number;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
}

export default function ScheduleManagementPage() {
  // --- STATE ---
  const [doctors, setDoctors] = useState<Model.Doctor[]>([]);
  const [slots, setSlots] = useState<Model.AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter State
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState<NewSlotForm>({
    doctor_id: 0,
    date: new Date().toISOString().split("T")[0],
    start_time: "08:00",
    end_time: "08:30",
  });

  // --- 1. LOAD DANH SÁCH BÁC SĨ ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await Api.getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Lỗi tải danh sách bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  // --- 2. LOAD LỊCH LÀM VIỆC ---
  const loadSlots = useCallback(async () => {
    if (selectedDoctorId === "all") {
      setSlots([]);
      return;
    }

    setLoading(true);
    try {
      const docId = parseInt(selectedDoctorId);
      // Sử dụng API lấy lịch đã có sẵn
      const data = await Api.getDoctorAvailability(docId);
      setSlots(data);
    } catch (error) {
      console.error("Lỗi tải lịch:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDoctorId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // --- 3. FILTER LOGIC ---
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      // Cắt chuỗi datetime để lấy ngày
      const slotDate = slot.StartTime.split(" ")[0];
      return slotDate === selectedDate;
    });
  }, [slots, selectedDate]);

  // --- 4. HANDLERS ---

  const handleDeleteSlot = async (slotId: number, status: string) => {
    if (status === "Booked") {
      alert("❌ Không thể xóa lịch đã có người đặt!");
      return;
    }
    if (confirm("Bạn có chắc muốn xóa khung giờ này?")) {
      try {
        // [UPDATE] Dùng hàm adminDeleteSlot mới
        await Api.adminDeleteSlot(slotId);
        setSlots((prev) => prev.filter((s) => s.SlotID !== slotId));
        alert("🗑️ Đã xóa thành công.");
      } catch (error) {
        alert("❌ Xóa thất bại.");
      }
    }
  };

  const handleAddSlot = async () => {
    if (!newSlot.doctor_id) {
      alert("Vui lòng chọn bác sĩ!");
      return;
    }
    try {
      // [UPDATE] Gộp ngày + giờ thành chuỗi DateTime chuẩn (YYYY-MM-DD HH:mm)
      const startDateTime = `${newSlot.date} ${newSlot.start_time}`;
      const endDateTime = `${newSlot.date} ${newSlot.end_time}`;

      // Gọi hàm adminCreateSlot mới
      await Api.adminCreateSlot(newSlot.doctor_id, startDateTime, endDateTime);

      alert("✅ Đã thêm lịch làm việc mới!");
      setIsModalOpen(false);

      // Reload dữ liệu nếu đang xem đúng bác sĩ/ngày đó
      if (selectedDoctorId === newSlot.doctor_id.toString()) {
        loadSlots();
      } else {
        // Chuyển view sang bác sĩ vừa thêm
        setSelectedDoctorId(newSlot.doctor_id.toString());
        setSelectedDate(newSlot.date);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Thêm lịch thất bại. Có thể bị trùng giờ.");
    }
  };

  // Helper lấy thông tin bác sĩ
  const getDoctorInfo = (id: number) => doctors.find((d) => d.DoctorID === id);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <section className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[600px]">
        {/* Header & Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📅 Lịch Trình Bác Sĩ
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý ca làm việc và thời gian trống.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="all">-- Chọn Bác sĩ để xem --</option>
              {doctors.map((d) => (
                <option key={d.DoctorID} value={d.DoctorID}>
                  {d.user?.FullName} ({d.specialty?.SpecialtyName})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Tạo Lịch
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-gray-50/50 flex-1 overflow-y-auto">
          {selectedDoctorId === "all" ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium">
                👆 Vui lòng chọn một Bác sĩ để xem lịch trình
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
              Đang tải dữ liệu...
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium">
                Chưa có lịch làm việc nào trong ngày {selectedDate}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 text-sm hover:underline mt-2"
              >
                Tạo lịch ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlots.map((slot) => {
                const doc = getDoctorInfo(slot.DoctorID);
                const startTime = slot.StartTime.split(" ")[1]?.slice(0, 5);
                const endTime = slot.EndTime.split(" ")[1]?.slice(0, 5);

                return (
                  <div
                    key={slot.SlotID}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          doc?.imageURL ||
                          doc?.user?.avatar_url ||
                          "https://placehold.co/100x100?text=Dr"
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full bg-gray-100 object-cover border"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/100x100?text=Dr")
                        }
                      />
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {doc?.user?.FullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc?.specialty?.SpecialtyName}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                            {startTime} - {endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {slot.Status === "Available" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Trống
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          Đã đặt
                        </span>
                      )}

                      {slot.Status === "Available" && (
                        <button
                          onClick={() =>
                            handleDeleteSlot(slot.SlotID, slot.Status)
                          }
                          className="text-red-400 hover:text-red-600 text-xs font-medium hover:underline"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* MODAL THÊM LỊCH */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 text-lg">
                ✨ Tạo Khung Giờ Làm Việc
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bác sĩ <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={newSlot.doctor_id}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      doctor_id: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>-- Chọn bác sĩ --</option>
                  {doctors.map((d) => (
                    <option key={d.DoctorID} value={d.DoctorID}>
                      {d.user?.FullName} - {d.specialty?.SpecialtyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Ngày làm việc
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newSlot.date}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, date: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newSlot.start_time}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, start_time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Giờ kết thúc
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newSlot.end_time}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, end_time: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAddSlot}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition"
              >
                Lưu Lịch Trình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
