"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return (
        <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">
          Chờ duyệt
        </span>
      );
    case "Confirmed":
      return (
        <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">
          Đã xác nhận
        </span>
      );
    case "Completed":
      return (
        <span className="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">
          Hoàn thành
        </span>
      );
    case "Cancelled":
      return (
        <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
          Đã hủy
        </span>
      );
    case "CheckedIn":
      return (
        <span className="px-2 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full">
          Đã Check-in
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
          {status}
        </span>
      );
  }
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Model.Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [selectedAppt, setSelectedAppt] = useState<Model.Appointment | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  // Sử dụng useCallback để tránh warning trong useEffect
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Api.getAllAppointments();
      // Sắp xếp giảm dần theo thời gian (Mới nhất lên đầu)
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.StartTime).getTime() - new Date(a.StartTime).getTime()
      );
      setAppointments(sortedData);
    } catch (error) {
      console.error("Lỗi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openModal = (appt: Model.Appointment) => {
    setSelectedAppt(appt);
    setCancelReason("");
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAppt) return;
    try {
      await Api.confirmAppointment(selectedAppt.AppointmentID);
      alert(`Đã duyệt lịch hẹn #${selectedAppt.AppointmentID}`);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Duyệt thất bại. Vui lòng thử lại.");
    }
  };

  const handleCheckIn = async () => {
    if (!selectedAppt) return;
    try {
      await Api.checkInAppointment(selectedAppt.AppointmentID);
      alert(`Đã check-in cho lịch hẹn #${selectedAppt.AppointmentID}`);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Check-in thất bại. Vui lòng thử lại.");
    }
  };

  const handleCancel = async () => {
    if (!selectedAppt) return;
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy!");
      return;
    }
    try {
      await Api.adminCancelAppointment(
        selectedAppt.AppointmentID,
        cancelReason
      );
      alert(`Đã hủy lịch hẹn #${selectedAppt.AppointmentID}`);
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      alert("Hủy thất bại. Vui lòng thử lại.");
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const statusMatch =
        filterStatus === "all" || item.Status === filterStatus;

      // Map field an toàn với dấu ? để tránh lỗi nếu dữ liệu null
      const pName = item.patient?.FullName?.toLowerCase() || "";
      const dName = item.doctor?.user?.FullName?.toLowerCase() || "";
      const idStr = item.AppointmentID.toString();
      const search = searchTerm.toLowerCase();

      const searchMatch =
        pName.includes(search) ||
        dName.includes(search) ||
        idStr.includes(search);
      return statusMatch && searchMatch;
    });
  }, [appointments, filterStatus, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <section className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 min-h-[80vh]">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Lịch Hẹn
              </h1>
              <p className="text-gray-500 mt-1">
                Xem và xử lý các yêu cầu đặt khám.
              </p>
            </div>
            <button
              onClick={loadData}
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              Làm mới dữ liệu
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Tìm theo mã, tên bệnh nhân, bác sĩ..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400"></span>
            </div>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Confirmed">Đã xác nhận</option>
              <option value="CheckedIn">Đã Check-in</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Đang tải lịch hẹn...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase w-20">
                        Mã
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Bệnh nhân
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Bác sĩ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((item) => (
                      <tr
                        key={item.AppointmentID}
                        className="hover:bg-blue-50 transition duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          #{item.AppointmentID}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            {item.patient?.FullName || "---"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.patient?.PhoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-blue-700">
                            BS. {item.doctor?.user?.FullName || "Chưa xếp"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.doctor?.specialty?.SpecialtyName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(item.StartTime).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(item.StartTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.Status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(item)}
                            className="text-blue-600 hover:text-blue-900 font-semibold hover:underline"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <span className="text-2xl block mb-2"></span>
                          Không tìm thấy dữ liệu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {isModalOpen && selectedAppt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900">
                    Chi tiết Lịch hẹn #{selectedAppt.AppointmentID}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                  <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                      Triệu chứng / Ghi chú
                    </p>
                    <p className="font-medium text-gray-800">
                      {selectedAppt.InitialSymptoms || "Không có mô tả"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                      Bệnh nhân
                    </p>
                    <p className="font-bold text-lg">
                      {selectedAppt.patient?.FullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAppt.patient?.PhoneNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                      Bác sĩ phụ trách
                    </p>
                    <p className="font-bold text-lg text-blue-700">
                      {selectedAppt.doctor?.user?.FullName || "Chưa phân công"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAppt.doctor?.specialty?.SpecialtyName}
                    </p>
                  </div>

                  {/* Hiển thị link file đính kèm nếu có */}
                  {selectedAppt.file_path && (
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                        File đính kèm
                      </p>
                      <a
                        href={selectedAppt.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Xem tài liệu đính kèm
                      </a>
                    </div>
                  )}

                  {selectedAppt.Status !== "Cancelled" &&
                    selectedAppt.Status !== "Completed" && (
                      <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Hành động xử lý:
                        </label>
                        <div className="flex gap-3 mb-4">
                          {selectedAppt.Status === "Pending" && (
                            <button
                              onClick={handleConfirm}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold"
                            >
                              Duyệt Lịch
                            </button>
                          )}
                          {selectedAppt.Status === "Confirmed" && (
                            <button
                              onClick={handleCheckIn}
                              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-bold"
                            >
                              Check-in
                            </button>
                          )}
                        </div>

                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Lý do hủy..."
                            className="flex-1 border border-red-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                          />
                          <button
                            onClick={handleCancel}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-bold"
                          >
                            Hủy Lịch
                          </button>
                        </div>
                      </div>
                    )}

                  {selectedAppt.Status === "Cancelled" && (
                    <div className="col-span-1 md:col-span-2 bg-gray-100 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-red-600 font-bold uppercase">
                        Lịch đã bị hủy
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Lý do: {selectedAppt.CancellationReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
