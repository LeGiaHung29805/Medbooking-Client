"use client";

import React, { useState, useEffect, useCallback } from "react";
import * as Api from "@/lib/ApiClient";


interface NotificationLog {
  id: number | string;
  recipient: string;
  type: "Reminder" | "System" | "Promotion";
  content: string;
  channel: "In-App" | "Email" | "SMS";
  sent_at: string;
  status: "Sent" | "Failed" | "Pending";
}

export default function NotificationManagerPage() {
  const [activeTab, setActiveTab] = useState<"broadcast" | "logs">("broadcast");
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);

  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    content: "",
    targetGroup: "all",
    channel: "in_app",
  });

  const loadData = useCallback(async () => {
    if (activeTab !== "logs") return;

    setLoading(true);
    try {
      const data = await Api.getNotificationLogs();

      const arrayData = Array.isArray(data) ? data : (data as any)?.data || [];

      if (Array.isArray(arrayData)) {
        const mappedLogs: NotificationLog[] = arrayData.map(
          (item: any, index: number) => ({

            id: item.id || `temp-${index}-${Date.now()}`,
            recipient: item.recipient_name || item.target_group || "N/A",
            type: item.type || "System",
            content: item.content,
            channel: item.channel || "In-App",
            sent_at: item.created_at
              ? new Date(item.created_at).toLocaleString("vi-VN")
              : "Vừa xong",
            status: item.status || "Sent",
          })
        );
        setLogs(mappedLogs);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử thông báo:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.content)
      return alert("Vui lòng nhập đủ thông tin");

    if (!confirm("Bạn có chắc chắn muốn gửi thông báo này?")) return;

    try {
      await Api.sendNotification({
        Title: broadcastForm.title,
        Content: broadcastForm.content,
        TargetGroup: broadcastForm.targetGroup,
        Channel: broadcastForm.channel,
      });

      alert("Đã gửi thông báo thành công!");
      setBroadcastForm({
        title: "",
        content: "",
        targetGroup: "all",
        channel: "in_app",
      });

      if (activeTab === "logs") loadData();
    } catch (error) {
      console.error(error);
      alert("Gửi thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <section className="max-w-6xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[600px]">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 bg-white">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Thông báo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gửi thông báo hệ thống và giám sát tin nhắn tự động
          </p>

          {/* TABS */}
          <div className="flex gap-6 mt-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("broadcast")}
              className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === "broadcast"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Soạn Thông Báo
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`pb-3 text-sm font-bold transition border-b-2 ${activeTab === "logs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Nhật Ký Gửi
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 bg-gray-50/30 flex-1">
          {/* TAB 1: BROADCAST */}
          {activeTab === "broadcast" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                <form
                  onSubmit={handleSendBroadcast}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5"
                >
                  <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
                    Nội dung tin nhắn
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Đối tượng nhận
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={broadcastForm.targetGroup}
                        onChange={(e) =>
                          setBroadcastForm({
                            ...broadcastForm,
                            targetGroup: e.target.value,
                          })
                        }
                      >
                        <option value="all">Tất cả người dùng</option>
                        <option value="patients">Chỉ Bệnh nhân</option>
                        <option value="doctors">Chỉ Bác sĩ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Kênh gửi
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        value={broadcastForm.channel}
                        onChange={(e) =>
                          setBroadcastForm({
                            ...broadcastForm,
                            channel: e.target.value,
                          })
                        }
                      >
                        <option value="in_app">
                          Thông báo trên App/Web
                        </option>
                        <option value="email">Gửi qua Email</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ví dụ: Thông báo bảo trì hệ thống..."
                      required
                      value={broadcastForm.title}
                      onChange={(e) =>
                        setBroadcastForm({
                          ...broadcastForm,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nội dung chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Nhập nội dung thông báo..."
                      required
                      value={broadcastForm.content}
                      onChange={(e) =>
                        setBroadcastForm({
                          ...broadcastForm,
                          content: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition flex items-center gap-2 w-full justify-center md:w-auto"
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
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Gửi Thông Báo Ngay
                    </button>
                  </div>
                </form>
              </div>

              {/* Info Panel */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Cấu hình Nhắc lịch
                      </h3>
                      <p className="text-xs text-gray-500">
                        Tự động chạy bởi hệ thống
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between bg-white p-3 rounded-lg border shadow-sm">
                      <span>Trạng thái</span>
                      <span className="text-green-600 font-bold">
                        Đang Bật ●
                      </span>
                    </div>
                    <div className="flex justify-between bg-white p-3 rounded-lg border shadow-sm">
                      <span>Thời gian quét</span>
                      <span className="font-bold">06:00 AM</span>
                    </div>
                    <div className="flex justify-between bg-white p-3 rounded-lg border shadow-sm">
                      <span>Điều kiện</span>
                      <span className="font-bold">Trước 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGS */}
          {activeTab === "logs" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  Đang tải dữ liệu...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                          Người nhận
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                          Nội dung
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                          Kênh
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log, index) => (
                        // Fix Key Error: Dùng log.id hoặc fallback index
                        <tr
                          key={log.id || index}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.sent_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {log.recipient}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.type === "Reminder" ? (
                              <span className="text-blue-600 font-bold">
                                Reminder
                              </span>
                            ) : (
                              <span className="text-purple-600 font-bold">
                                System
                              </span>
                            )}
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                            title={log.content}
                          >
                            {log.content}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              {log.channel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {log.status === "Sent" && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                Thành công
                              </span>
                            )}
                            {log.status === "Failed" && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                Thất bại
                              </span>
                            )}
                            {log.status === "Pending" && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                                Đang chờ
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {logs.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            Chưa có nhật ký thông báo nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
