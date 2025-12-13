"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Send,
  History,
  Loader,
  Megaphone,
  CalendarClock,
  CheckCircle2
} from "lucide-react";
import * as Api from "@/lib/ApiClient";

interface NotificationLog {
  id: number | string;
  recipient: string;
  title: string;
  content: string;
  type: "SystemAlert" | "AppointmentReminder" | "Other";
  sent_at: string;
  status: string;
}

export default function NotificationManagerPage() {
  const [activeTab, setActiveTab] = useState<"broadcast" | "logs">("broadcast");
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Form gửi thông báo (Mặc định chọn Bệnh nhân & In-app)
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    content: "",
    targetGroup: "patients",
    channel: "in_app",
  });

  //LOAD DỮ LIỆU LOGS
  const loadData = useCallback(async () => {
    if (activeTab !== "logs") return;

    setLoading(true);
    try {
      const data = await Api.getNotificationLogs();

      // Xử lý dữ liệu trả về từ Laravel
      const arrayData = Array.isArray(data) ? data : (data as any)?.data || [];

      if (Array.isArray(arrayData)) {
        const mappedLogs: NotificationLog[] = arrayData.map(
          (item: any, index: number) => ({
            id: item.NotificationID || index,
            // Nếu có quan hệ user thì lấy tên, không thì lấy nhóm đích
            recipient: item.user ? item.user.FullName : (item.target_group === 'patients' ? 'Tất cả Bệnh nhân' : 'Tất cả'),
            title: item.Title || "Không tiêu đề",
            content: item.Content,
            type: item.NotificationType || "Other",
            sent_at: item.created_at
              ? new Date(item.created_at).toLocaleString("vi-VN")
              : "N/A",
            status: item.Status || "Sent",
          })
        );
        setLogs(mappedLogs);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Lỗi tải logs:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // GỬI THÔNG BÁO
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.content) return;

    if (!confirm("Bạn có chắc chắn muốn gửi thông báo này tới toàn bộ danh sách đã chọn?")) return;

    try {
      await Api.sendNotification({
        Title: broadcastForm.title,
        Content: broadcastForm.content,
        TargetGroup: broadcastForm.targetGroup,
        Channel: broadcastForm.channel,
      });

      alert("Đã gửi thông báo thành công!");

      // Reset form
      setBroadcastForm({
        title: "",
        content: "",
        targetGroup: "patients",
        channel: "in_app",
      });

      // Chuyển sang tab logs để xem kết quả
      setActiveTab("logs");
    } catch (error: any) {
      console.error(error);
      alert("Gửi thất bại: " + (error.response?.data?.message || "Lỗi hệ thống"));
    }
  };

  //Icon cho loại thông báo
  const getTypeIcon = (type: string) => {
    if (type === 'AppointmentReminder') return <CalendarClock className="w-5 h-5 text-blue-600" />;
    if (type === 'SystemAlert') return <Megaphone className="w-5 h-5 text-orange-600" />;
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  // Helper: Tên hiển thị loại
  const getTypeName = (type: string) => {
    if (type === 'AppointmentReminder') return "Nhắc hẹn tự động";
    if (type === 'SystemAlert') return "Thông báo hệ thống";
    return "Khác";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden min-h-[600px] flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Megaphone className="w-7 h-7 text-blue-600" />
              Quản lý Thông báo
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gửi tin tức hệ thống và giám sát tin nhắc hẹn tự động.
            </p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("broadcast")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "broadcast"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Soạn tin mới
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "logs"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <History className="w-4 h-4 inline-block mr-2" />
              Lịch sử gửi
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 bg-gray-50/50">

          {activeTab === "broadcast" && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSendBroadcast} className="bg-white p-8 rounded-xl border shadow-sm space-y-6">

                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Gửi thông báo thủ công</h3>
                    <p className="text-xs text-gray-500">Tin nhắn sẽ hiện trên trang web/app của người dùng</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Đối tượng nhận</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                      value={broadcastForm.targetGroup}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, targetGroup: e.target.value })}
                    >
                      <option value="patients">Chỉ Bệnh nhân</option>
                      <option value="all">Tất cả (Bác sĩ + Bệnh nhân)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kênh gửi</label>
                    <input
                      disabled
                      value="Thông báo In-App"
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-3 py-2.5 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Thông báo bảo trì hệ thống ngày 15/12..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    placeholder="Nhập nội dung chi tiết..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={broadcastForm.content}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition flex justify-center items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi Thông Báo Ngay
                </button>
              </form>
            </div>
          )}
          {activeTab === "logs" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Thời gian</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Loại tin</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tiêu đề / Nội dung</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Người nhận</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                            Chưa có lịch sử thông báo nào
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.sent_at}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(log.type)}
                                <span className={`text-sm font-semibold ${log.type === 'AppointmentReminder' ? 'text-blue-700' : 'text-orange-700'}`}>
                                  {getTypeName(log.type)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <p className="text-sm font-bold text-gray-800 truncate">{log.title}</p>
                                <p className="text-xs text-gray-500 truncate">{log.content}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {log.recipient}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã gửi
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}