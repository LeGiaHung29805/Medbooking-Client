'use client';

import React, { useState } from 'react';

// --- 1. TYPE DEFINITIONS ---
interface Doctor {
    id: number;
    name: string;
    specialty: string;
    avatar: string;
}

interface WorkSlot {
    id: number;
    doctor_id: number;
    date: string; // YYYY-MM-DD
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    status: 'available' | 'booked' | 'off';
}

// --- 2. FAKE DATA ---
const doctorsData: Doctor[] = [
    { id: 1, name: "Dr. Lê Thị Bích", specialty: "Tim mạch", avatar: "https://ui-avatars.com/api/?name=Le+Thi+Bich&background=random" },
    { id: 2, name: "Dr. Phạm Minh Tuấn", specialty: "Da liễu", avatar: "https://ui-avatars.com/api/?name=Pham+Minh+Tuan&background=random" },
    { id: 3, name: "Dr. Nguyễn Văn C", specialty: "Nhi khoa", avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+C&background=random" },
];

const initialSlots: WorkSlot[] = [
    { id: 101, doctor_id: 1, date: "2025-11-25", start_time: "08:00", end_time: "08:30", status: "booked" },
    { id: 102, doctor_id: 1, date: "2025-11-25", start_time: "08:30", end_time: "09:00", status: "available" },
    { id: 103, doctor_id: 1, date: "2025-11-25", start_time: "09:00", end_time: "09:30", status: "available" },
    { id: 104, doctor_id: 2, date: "2025-11-25", start_time: "14:00", end_time: "14:30", status: "available" },
    { id: 105, doctor_id: 2, date: "2025-11-25", start_time: "14:30", end_time: "15:00", status: "booked" },
];

// --- 3. COMPONENT ---
export default function ScheduleManagementPage() {
    // State
    const [slots, setSlots] = useState<WorkSlot[]>(initialSlots);
    const [selectedDate, setSelectedDate] = useState<string>("2025-11-25");
    const [selectedDoctor, setSelectedDoctor] = useState<string>("all");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSlot, setNewSlot] = useState({
        doctor_id: 1,
        date: "2025-11-25",
        start_time: "08:00",
        end_time: "08:30"
    });

    // --- HELPER FUNCTIONS ---

    // Lọc dữ liệu hiển thị
    const filteredSlots = slots.filter(slot => {
        const matchDate = slot.date === selectedDate;
        const matchDoctor = selectedDoctor === "all" || slot.doctor_id.toString() === selectedDoctor;
        return matchDate && matchDoctor;
    });

    // Lấy thông tin bác sĩ từ ID
    const getDoctorInfo = (id: number) => doctorsData.find(d => d.id === id);

    // Xóa slot (Chỉ xóa slot chưa đặt)
    const handleDeleteSlot = (id: number, status: string) => {
        if (status === 'booked') {
            alert("Không thể xóa lịch đã có người đặt!");
            return;
        }
        if (confirm("Bạn có chắc muốn xóa khung giờ này?")) {
            setSlots(slots.filter(s => s.id !== id));
        }
    };

    // Thêm slot mới
    const handleAddSlot = () => {
        const newItem: WorkSlot = {
            id: Date.now(), // Fake ID
            doctor_id: Number(newSlot.doctor_id),
            date: newSlot.date,
            start_time: newSlot.start_time,
            end_time: newSlot.end_time,
            status: 'available'
        };
        setSlots([...slots, newItem]);
        setIsModalOpen(false);
        alert("Đã thêm lịch làm việc mới!");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">

            {/* SECTION CHÍNH: Container responsive */}
            <section className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[600px]">

                {/* 1. Header & Filters */}
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Lịch Trình Bác Sĩ</h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý ca làm việc và thời gian trống</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Chọn ngày */}
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        {/* Chọn bác sĩ */}
                        <select
                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                        >
                            <option value="all">Tất cả bác sĩ</option>
                            {doctorsData.map(d => (
                                <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
                            ))}
                        </select>

                        {/* Nút thêm mới */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-md flex items-center justify-center gap-2"
                        >
                            <span className="text-xl leading-none">+</span> Tạo Lịch
                        </button>
                    </div>
                </div>

                {/* 2. Content Area (Grid View) */}
                <div className="p-6 bg-gray-50/50 flex-1 overflow-y-auto">
                    {filteredSlots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-lg font-medium">Chưa có lịch làm việc nào</p>
                            <p className="text-sm">Hãy chọn ngày khác hoặc tạo lịch mới</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSlots.map((slot) => {
                                const doc = getDoctorInfo(slot.doctor_id);
                                return (
                                    <div key={slot.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between">

                                        {/* Thông tin bên trái */}
                                        <div className="flex items-center gap-3">
                                            <img src={doc?.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-200" />
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{doc?.name}</p>
                                                <p className="text-xs text-gray-500">{doc?.specialty}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
                                                        {slot.start_time} - {slot.end_time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trạng thái & Nút xóa */}
                                        <div className="flex flex-col items-end gap-2">
                                            {slot.status === 'available' ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Trống</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">Đã đặt</span>
                                            )}

                                            {slot.status === 'available' && (
                                                <button
                                                    onClick={() => handleDeleteSlot(slot.id, slot.status)}
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

            {/* --- MODAL THÊM LỊCH (ADD SCHEDULE) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Tạo Khung Giờ Làm Việc</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bác sĩ</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSlot.doctor_id}
                                    onChange={(e) => setNewSlot({ ...newSlot, doctor_id: Number(e.target.value) })}
                                >
                                    {doctorsData.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày làm việc</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newSlot.date}
                                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newSlot.start_time}
                                        onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc</label>
                                    <input
                                        type="time"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newSlot.end_time}
                                        onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-white text-sm font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleAddSlot}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-bold shadow-sm"
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