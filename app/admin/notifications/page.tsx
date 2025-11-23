'use client';

import React, { useState } from 'react';

// --- 1. TYPE DEFINITIONS ---
interface NotificationLog {
    id: number;
    recipient: string; // Tên người nhận
    type: 'Reminder' | 'System' | 'Promotion';
    content: string;
    channel: 'In-App' | 'Email' | 'SMS';
    sent_at: string;
    status: 'sent' | 'failed' | 'pending';
}

// --- 2. FAKE DATA ---
const initialLogs: NotificationLog[] = [
    { id: 1, recipient: "Nguyễn Văn An", type: "Reminder", content: "Nhắc hẹn: Bạn có lịch khám tim mạch vào 08:00 ngày mai.", channel: "SMS", sent_at: "2025-11-24 08:00", status: "sent" },
    { id: 2, recipient: "Trần Thị Mai", type: "Reminder", content: "Nhắc hẹn: Bạn có lịch khám da liễu vào 09:00 ngày mai.", channel: "Email", sent_at: "2025-11-24 08:05", status: "sent" },
    { id: 3, recipient: "Toàn bộ hệ thống", type: "System", content: "Bảo trì hệ thống từ 00:00 - 02:00 ngày 26/11.", channel: "In-App", sent_at: "2025-11-23 10:00", status: "sent" },
    { id: 4, recipient: "Lê Văn Cường", type: "Reminder", content: "Nhắc hẹn: Tái khám...", channel: "SMS", sent_at: "2025-11-24 08:10", status: "failed" },
];

export default function NotificationManagerPage() {
    const [activeTab, setActiveTab] = useState<'broadcast' | 'logs'>('broadcast');
    const [logs, setLogs] = useState<NotificationLog[]>(initialLogs);

    // State form gửi thông báo
    const [broadcastForm, setBroadcastForm] = useState({
        title: '',
        content: '',
        targetGroup: 'all', // all, patients, doctors
        channel: 'in_app'
    });

    // Xử lý gửi thông báo (Giả lập)
    const handleSendBroadcast = (e: React.FormEvent) => {
        e.preventDefault();
        if (!broadcastForm.title || !broadcastForm.content) return alert("Vui lòng nhập đủ thông tin");

        const newLog: NotificationLog = {
            id: Date.now(),
            recipient: broadcastForm.targetGroup === 'all' ? "Toàn bộ hệ thống" : (broadcastForm.targetGroup === 'doctors' ? "Tất cả Bác sĩ" : "Tất cả Bệnh nhân"),
            type: 'System',
            content: `${broadcastForm.title}: ${broadcastForm.content}`,
            channel: broadcastForm.channel === 'in_app' ? 'In-App' : 'Email',
            sent_at: new Date().toLocaleString(),
            status: 'sent'
        };

        setLogs([newLog, ...logs]);
        alert("Đã gửi thông báo thành công!");
        setBroadcastForm({ title: '', content: '', targetGroup: 'all', channel: 'in_app' });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <section className="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[600px]">

                {/* HEADER */}
                <div className="p-6 border-b border-gray-100 bg-white">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Thông báo</h1>
                    <p className="text-sm text-gray-500 mt-1">Gửi thông báo hệ thống và giám sát nhắc lịch tự động</p>

                    {/* TABS */}
                    <div className="flex gap-6 mt-6 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('broadcast')}
                            className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === 'broadcast' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Soạn Thông Báo Mới
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            Nhật Ký Gửi & Nhắc Lịch
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-6 bg-gray-50/30 flex-1">

                    {/* TAB 1: Gửi thông báo (Broadcast) */}
                    {activeTab === 'broadcast' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form nhập liệu */}
                            <div className="lg:col-span-2 space-y-6">
                                <form onSubmit={handleSendBroadcast} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Soạn tin nhắn hệ thống</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng nhận</label>
                                            <select
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={broadcastForm.targetGroup}
                                                onChange={(e) => setBroadcastForm({ ...broadcastForm, targetGroup: e.target.value })}
                                            >
                                                <option value="all">Tất cả người dùng (All Users)</option>
                                                <option value="patients">Chỉ Bệnh nhân (Patients)</option>
                                                <option value="doctors">Chỉ Bác sĩ (Doctors)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kênh gửi</label>
                                            <select
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={broadcastForm.channel}
                                                onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                                            >
                                                <option value="in_app">Thông báo trên App/Web</option>
                                                <option value="email">Gửi qua Email</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Ví dụ: Thông báo bảo trì..."
                                            value={broadcastForm.title}
                                            onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết</label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Nhập nội dung thông báo..."
                                            value={broadcastForm.content}
                                            onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-bold shadow-md transition flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            Gửi Thông Báo Ngay
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Panel bên phải: Cấu hình nhắc lịch tự động */}
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">Cấu hình Nhắc lịch</h3>
                                            <p className="text-xs text-gray-500">Tự động chạy bởi CronJob</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-white p-3 rounded border border-blue-100">
                                            <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đang Bật ●</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-3 rounded border border-blue-100">
                                            <span className="text-sm font-medium text-gray-700">Thời gian quét</span>
                                            <span className="text-sm font-bold text-gray-900">06:00 AM / Hàng ngày</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white p-3 rounded border border-blue-100">
                                            <span className="text-sm font-medium text-gray-700">Điều kiện</span>
                                            <span className="text-sm font-bold text-gray-900">Trước 1 ngày (24h)</span>
                                        </div>

                                        <div className="pt-2 text-xs text-gray-500 italic">
                                            *Lưu ý: Hệ thống sẽ tự động quét bảng Appointments và gửi thông báo cho bệnh nhân có lịch vào ngày mai.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Nhật ký (Logs) */}
                    {activeTab === 'logs' && (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian gửi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người nhận</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung tóm tắt</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kênh</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.sent_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.recipient}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {log.type === 'Reminder'
                                                    ? <span className="text-blue-600 font-medium">Nhắc lịch</span>
                                                    : <span className="text-purple-600 font-medium">Hệ thống</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={log.content}>
                                                {log.content}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{log.channel}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {log.status === 'sent' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Đã gửi</span>}
                                                {log.status === 'failed' && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Thất bại</span>}
                                                {log.status === 'pending' && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Đang chờ</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
}