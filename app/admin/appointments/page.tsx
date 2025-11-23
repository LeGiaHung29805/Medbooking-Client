"use client"; // QUAN TRỌNG: Phải là 'use client' chứ không phải 'user client'

import React, { useState } from 'react';

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (Để TypeScript không báo lỗi) ---
interface Patient {
    id: number;
    full_name: string;
    phone_number: string;
}

interface Doctor {
    id: number;
    full_name: string;
    specialty: string;
}

interface Service {
    id: number;
    service_name: string;
    price: number;
}

interface Schedule {
    date: string;
    time_slot: string;
}

interface Appointment {
    appointment_id: number;
    patient: Patient;
    doctor: Doctor;
    service: Service;
    schedule: Schedule;
    status: string;
    initial_symptoms: string;
    cancellation_reason?: string; // Dấu ? nghĩa là có thể có hoặc không
    created_at: string;
}

// --- 2. FAKE DATA ---
const initialData: Appointment[] = [
    {
        appointment_id: 1001,
        patient: { id: 205, full_name: "Nguyễn Văn An", phone_number: "0912345678" },
        doctor: { id: 501, full_name: "Dr. Lê Thị Bích", specialty: "Tim mạch" },
        service: { id: 30, service_name: "Khám tim mạch tổng quát", price: 500000 },
        schedule: { date: "2025-11-25", time_slot: "09:00 - 09:30" },
        status: "pending",
        initial_symptoms: "Hay bị đau thắt ngực trái khi vận động mạnh",
        created_at: "2025-11-20T08:00:00"
    },
    {
        appointment_id: 1002,
        patient: { id: 206, full_name: "Trần Thị Mai", phone_number: "0987654321" },
        doctor: { id: 502, full_name: "Dr. Phạm Minh Tuấn", specialty: "Da liễu" },
        service: { id: 32, service_name: "Điều trị mụn viêm", price: 300000 },
        schedule: { date: "2025-11-25", time_slot: "10:00 - 10:30" },
        status: "confirmed",
        initial_symptoms: "Da mặt nổi nhiều mụn đỏ, ngứa",
        created_at: "2025-11-21T09:15:00"
    },
    {
        appointment_id: 1003,
        patient: { id: 207, full_name: "Lê Văn Cường", phone_number: "0909123123" },
        doctor: { id: 501, full_name: "Dr. Lê Thị Bích", specialty: "Tim mạch" },
        service: { id: 30, service_name: "Khám tim mạch tổng quát", price: 500000 },
        schedule: { date: "2025-11-24", time_slot: "14:00 - 14:30" },
        status: "cancelled",
        cancellation_reason: "Bệnh nhân bận việc đột xuất",
        initial_symptoms: "Tái khám định kỳ",
        created_at: "2025-11-18T10:00:00"
    }
];

// --- 3. COMPONENT CHÍNH (PAGE) ---
export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>(initialData);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // State cho Modal
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cancelReason, setCancelReason] = useState<string>('');

    // --- HELPER FUNCTIONS ---
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">Chờ duyệt</span>;
            case 'confirmed': return <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">Đã xác nhận</span>;
            case 'completed': return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Hoàn thành</span>;
            case 'cancelled': return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Đã hủy</span>;
            default: return <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    const filteredAppointments = appointments.filter(item => {
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesSearch =
            item.patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.appointment_id.toString().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    const openModal = (appt: Appointment) => {
        setSelectedAppt(appt);
        setCancelReason('');
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (!selectedAppt) return;
        const updatedList = appointments.map(app =>
            app.appointment_id === selectedAppt.appointment_id ? { ...app, status: 'confirmed' } : app
        );
        setAppointments(updatedList);
        setIsModalOpen(false);
        alert(`Đã duyệt lịch hẹn #${selectedAppt.appointment_id}`);
    };

    const handleCancel = () => {
        if (!selectedAppt) return;
        if (!cancelReason) {
            alert("Vui lòng nhập lý do hủy!");
            return;
        }
        const updatedList = appointments.map(app =>
            app.appointment_id === selectedAppt.appointment_id
                ? { ...app, status: 'cancelled', cancellation_reason: cancelReason }
                : app
        );
        setAppointments(updatedList);
        setIsModalOpen(false);
    };

    // --- RENDER GIAO DIỆN ---
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <section className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch Hẹn</h1>
                        <p className="text-gray-500">Xem và quản lý danh sách đặt khám của bệnh nhân</p>
                    </div>

                    {/* BỘ LỌC */}
                    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 flex-1">
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc mã lịch..."
                                className="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ duyệt</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                    </div>

                    {/* BẢNG DỮ LIỆU */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Lịch</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ / Dịch vụ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.map((item) => (
                                    <tr key={item.appointment_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{item.appointment_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.patient.full_name}</div>
                                            <div className="text-sm text-gray-500">{item.patient.phone_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.doctor.full_name}</div>
                                            <div className="text-sm text-gray-500">{item.service.service_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-blue-600">{item.schedule.time_slot}</div>
                                            <div className="text-sm text-gray-500">{item.schedule.date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="text-blue-600 hover:text-blue-900 font-semibold"
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAppointments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Không tìm thấy dữ liệu phù hợp.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MODAL */}
                    {isModalOpen && selectedAppt && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Chi tiết lịch hẹn #{selectedAppt.appointment_id}</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                                </div>

                                <div className="p-6 grid grid-cols-2 gap-4 text-gray-800">
                                    <div className="col-span-2 bg-blue-50 p-3 rounded border border-blue-100">
                                        <p className="text-sm text-gray-600">Triệu chứng ban đầu:</p>
                                        <p className="font-medium text-gray-800">{selectedAppt.initial_symptoms}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Bệnh nhân</p>
                                        <p className="font-medium">{selectedAppt.patient.full_name}</p>
                                        <p className="text-sm">{selectedAppt.patient.phone_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Bác sĩ</p>
                                        <p className="font-medium">{selectedAppt.doctor.full_name}</p>
                                        <p className="text-sm">{selectedAppt.doctor.specialty}</p>
                                    </div>

                                    {selectedAppt.status !== 'cancelled' && selectedAppt.status !== 'completed' && (
                                        <div className="col-span-2 mt-4 pt-4 border-t border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hành động quản trị:</label>
                                            {selectedAppt.status === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleConfirm}
                                                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                                    >
                                                        Xác nhận lịch hẹn
                                                    </button>
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <p className="text-sm text-red-600 font-medium mb-1">Hủy lịch hẹn này?</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Nhập lý do hủy..."
                                                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                                                        value={cancelReason}
                                                        onChange={(e) => setCancelReason(e.target.value)}
                                                    />
                                                    <button
                                                        onClick={handleCancel}
                                                        className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded hover:bg-red-100 transition text-sm font-medium"
                                                    >
                                                        Hủy Lịch
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedAppt.status === 'cancelled' && (
                                        <div className="col-span-2 bg-red-50 p-3 rounded border border-red-100 mt-2">
                                            <p className="text-sm text-red-800 font-bold">Lịch đã hủy</p>
                                            <p className="text-sm text-red-600">Lý do: {selectedAppt.cancellation_reason}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-6 py-3 bg-gray-50 text-right">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}