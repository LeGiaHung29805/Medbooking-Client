"use client";

import { useState, useEffect } from "react";
import { ClipboardX, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutUsers from "@/components/layoutUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import API & Model & Utils
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";
import { getFullImageUrl } from "@/lib/utils";
import DataThumbnail from "@/components/thumnail/DataThumbnail";

export default function KetQuaKhamBenh() {

  const [completedAppointments, setCompletedAppointments] = useState<Model.Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE UI ---
  const [selectedRecord, setSelectedRecord] = useState<Model.MedicalRecord | null>(null);
  const [openRecordModal, setOpenRecordModal] = useState(false);

  // 1. LOAD DỮ LIỆU
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const appointments = await Api.getMyAppointments();

        // Lọc ra các lịch ĐÃ HOÀN THÀNH (Completed) và CÓ KẾT QUẢ (medical_record)
        const finished = appointments.filter(
          (app) => app.Status === "Completed" && app.medical_record
        );

        setCompletedAppointments(finished);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. XỬ LÝ XEM CHI TIẾT
  const handleViewDetail = (record: Model.MedicalRecord) => {
    setSelectedRecord(record);
    setOpenRecordModal(true);
  };

  // Format ngày giờ
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <LayoutUsers>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-green-700 mb-2">
          Kết quả khám bệnh
        </h1>
        <p className="text-gray-600 mb-6">
          Danh sách các hồ sơ khám bệnh và kết quả điều trị của bạn.
        </p>

        {/* --- DANH SÁCH KẾT QUẢ --- */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : completedAppointments.length === 0 ? (
          <div className="bg-white border rounded-lg shadow-sm p-10 flex flex-col items-center justify-center min-h-[250px]">
            <ClipboardX className="w-12 h-12 text-gray-400 mb-3" />
            <p className="font-medium mb-1">Chưa có hồ sơ bệnh án</p>
            <p className="text-gray-500 text-sm">
              Bạn chưa có lịch khám nào đã hoàn thành để xem kết quả.
            </p>
          </div>
        ) : (
          <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700">
                  <th className="py-3 px-4">Ngày khám</th>
                  <th className="py-3 px-4">Bác sĩ</th>
                  <th className="py-3 px-4">Chẩn đoán</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {completedAppointments.map((app) => {
                  const record = app.medical_record!; // Chắc chắn có vì đã filter ở trên
                  const doctorName = app.doctor?.user?.FullName || "---";
                  const avatar = app.doctor?.imageURL || app.doctor?.user?.avatar_url;

                  return (
                    <tr
                      key={app.AppointmentID}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-blue-600">
                        {formatDate(app.StartTime)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8">
                            <DataThumbnail
                              src={avatar}
                              alt="Doctor"
                              fallbackType="doctor"
                              className="w-full h-full rounded-full border"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {doctorName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className="py-3 px-4 max-w-xs truncate"
                        title={record.Diagnosis}
                      >
                        {record.Diagnosis}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => handleViewDetail(record)}
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* --- MODAL CHI TIẾT --- */}
        <Dialog open={openRecordModal} onOpenChange={setOpenRecordModal}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Chi tiết hồ sơ bệnh án
              </DialogTitle>
            </DialogHeader>

            {selectedRecord && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold">
                      Bệnh nhân
                    </span>
                    {/* Lấy tên từ Appointment (hoặc currentUser nếu có state) */}
                    <span className="font-medium">
                      {selectedRecord.patient?.FullName || "Tôi"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold">
                      Ngày khám
                    </span>
                    <span className="font-medium">
                      {formatDate(selectedRecord.created_at)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-gray-500 uppercase font-bold">
                      Bác sĩ phụ trách
                    </span>
                    <span className="font-medium text-blue-700">
                      {selectedRecord.doctor?.user?.FullName}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold block mb-1 text-gray-800">
                    Chẩn đoán (Diagnosis):
                  </span>
                  <div className="bg-white border p-3 rounded text-gray-700 font-medium">
                    {selectedRecord.Diagnosis}
                  </div>
                </div>

                <div>
                  <span className="font-bold block mb-1 text-gray-800">
                    Ghi chú:
                  </span>
                  <div className="bg-white border p-3 rounded text-gray-600 whitespace-pre-line h-32 overflow-y-auto">
                    {selectedRecord.Notes || "Không có ghi chú."}
                  </div>
                </div>

                {/* File đính kèm (Exam Results) */}
                {selectedRecord.exam_results &&
                  selectedRecord.exam_results.length > 0 && (
                    <div>
                      <span className="font-bold block mb-2 text-gray-800">
                        Kết quả xét nghiệm / File đính kèm:
                      </span>
                      <div className="space-y-2">
                        {selectedRecord.exam_results.map((file, idx) => (
                          <a
                            key={file.ResultID}
                            href={getFullImageUrl(file.FilePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border rounded hover:bg-blue-50 transition group"
                          >
                            <div className="bg-blue-100 p-1.5 rounded text-blue-600">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate font-medium text-blue-700 group-hover:underline">
                                {file.FileDescription || `Tài liệu số ${idx + 1}`}
                              </p>
                              <p className="text-xs text-gray-400 uppercase">
                                {file.FileType}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayoutUsers>
  );
}