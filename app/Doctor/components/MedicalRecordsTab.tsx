"use client";

import { use, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { MedicalRecord } from "@/lib/model"
// import { generatePrescriptionPDF } from "../components/InPrescriptionPDF";
interface MedicalRecordsTabProps {
  medicalRecords: MedicalRecord[]
  handleViewMedicalRecord: (id: number) => void
  generatePrescriptionPDF: (record: MedicalRecord) => void
  viewMode?: "list" | "grid"
}
const statusConfig: Record<string, { label: string; classes: string }> = {
  Completed: { label: "Đã hoàn thành", classes: "bg-emerald-100 text-emerald-800" },
  Pending: { label: "Đang chờ xử lý", classes: "bg-yellow-100 text-yellow-800" },
  Confirmed: { label: "Đã xác nhận", classes: "bg-blue-100 text-blue-800" },
  CheckedIn: { label: "Đã có mặt", classes: "bg-indigo-100 text-indigo-800" },
};
const MedicalRecordsTab = ({
  medicalRecords,
  handleViewMedicalRecord,
  generatePrescriptionPDF
}: MedicalRecordsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // Filter records
  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch =
      (record.patient?.FullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (record.Diagnosis?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || record.appointment?.Status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Quản lý bệnh án ({filteredRecords.length})</h2>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Completed">Đã hoàn thành</option>
            <option value="Pending">Đang chờ xử lý</option>
            <option value="Confirm">Đã xác nhận</option>
            <option value="CheckedIn">Đã có mặt</option>
          </select>
        </div>
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>Không tìm thấy bệnh án nào</p>
          <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentItems.map((record) => {
            const currentStatus = record.appointment?.Status || "Pending";
            const config = statusConfig[currentStatus] || statusConfig.Pending

            return (

              <div key={record.RecordID} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{record.patient?.FullName}</h3>
                    <p className="text-sm text-slate-600">Ngày sinh: {record.patient?.DateOfBirth ? (
                      new Date(record.patient.DateOfBirth).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    ) : (
                      "Chưa cập nhật"
                    )}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.classes}`}>
                    {config.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Chẩn đoán:</p>
                    <p className="text-sm text-slate-600">{record.Diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Điều trị:</p>
                    <p className="text-sm text-slate-600">{record.Notes}</p>
                  </div>
                </div>
                {record.prescriptions?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Đơn thuốc:</p>
                    <div className="text-sm text-slate-600 space-y-1">
                      {record.prescriptions?.map((pres, index) => (
                        <div key={index} className="flex gap-2">
                          <span>• {pres.medicine}</span>
                          <span>{pres.dosage}</span>
                          <span>({pres.frequency})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewMedicalRecord(record.RecordID)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => generatePrescriptionPDF(record)}
                    className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-100 transition-colors"
                  >
                    In Bệnh Án
                  </button>
                </div>
              </div>

            );
          })}
        </div>

      )}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 border-t pt-6">
          <p className="text-sm text-slate-600">
            Hiển thị trang <span className="font-semibold text-slate-900">{currentPage}</span> trên {totalPages}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
            >
              Trước
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${currentPage === i + 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>

  )
}

export default MedicalRecordsTab;