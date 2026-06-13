"use client";

import { useState, useEffect, useMemo } from "react";
import MedicalRecordsTab from "../components/MedicalRecordsTab";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  Search,
  Download,
  Printer,
  FileText,
  BarChart3,
  Plus,
  User,
  Stethoscope
} from "lucide-react";

import type {
  MedicalRecord,
  Prescription
} from "@/lib/model";
import { doctorService } from "@/app/services/doctorService";
export default function RecordsPage() {
  // ==================== STATES ====================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  // ==================== MOCK DATA ====================
  const generateMockMedicalRecords = (): MedicalRecord[] => {
    const records: MedicalRecord[] = [];
    const patientNames = [
      "Trần Thị Lan", "Lê Văn Minh", "Phạm Văn Hùng", "Nguyễn Thị Hoa",
      "Đỗ Văn Tài", "Hoàng Thị Mai", "Vũ Văn Đức", "Bùi Thị Thu",
      "Trịnh Văn Sơn", "Lý Thị Nga", "Mai Văn Tuấn", "Đinh Thị Hà",
      "Ngô Văn Bình", "Phan Thị Linh", "Hồ Văn Cường", "Đặng Thị Dung",
      "Nguyễn Quốc Bảo", "Trần Văn Đạt", "Lê Thị Kim"
    ];

    const diagnoses = [
      "Viêm họng cấp do virus",
      "Tăng huyết áp độ 2",
      "Tiểu đường type 2",
      "Viêm phế quản cấp",
      "Rối loạn tiêu hóa",
      "Đau thắt ngực không ổn định",
      "Viêm da dị ứng",
      "Loãng xương độ 1",
      "Suy giáp",
      "Trào ngược dạ dày thực quản",
      "Viêm xoang mạn tính",
      "Thoái hóa khớp gối",
      "Rối loạn lo âu",
      "Mất ngủ mạn tính",
      "Gout cấp",
      "Viêm gan B mạn tính",
      "Suy thận cấp tính",
      "Viêm phổi",
      "Cảm cúm thông thường",
      "Đau dạ dày",
      "Viêm ruột thừa cấp"
    ];

    const treatments = [
      "Kháng sinh 7 ngày, nghỉ ngơi, uống nhiều nước",
      "Thuốc hạ áp, theo dõi huyết áp hàng ngày, ăn kiêng muối",
      "Insulin, chế độ ăn kiêng đường, theo dõi đường huyết",
      "Kháng sinh, thuốc giãn phế quản, vật lý trị liệu hô hấp",
      "Men tiêu hóa, thuốc chống co thắt, chế độ ăn nhẹ",
      "Nitroglycerin, aspirin, theo dõi tim mạch, hạn chế vận động",
      "Thuốc kháng histamine, kem bôi corticoid, tránh dị nguyên",
      "Bổ sung canxi, vitamin D, tập thể dục nhẹ nhàng",
      "Hormone thay thế, theo dõi chức năng tuyến giáp",
      "Thuốc ức chế bơm proton, thay đổi lối sống",
      "Kháng sinh, thuốc xịt mũi, rửa mũi bằng nước muối",
      "Thuốc giảm đau, vật lý trị liệu, giảm cân",
      "Thuốc chống trầm cảm, tư vấn tâm lý, tập thư giãn",
      "Thuốc an thần nhẹ, vệ sinh giấc ngủ, thiền định",
      "Colchicine, thuốc chống viêm, chế độ ăn kiêng purin",
      "Thuốc kháng virus, theo dõi chức năng gan định kỳ"
    ];

    const medicines = [
      { name: "Amoxicillin", dosage: "500mg", frequency: "3 lần/ngày" },
      { name: "Paracetamol", dosage: "500mg", frequency: "Khi sốt >38.5°C" },
      { name: "Losartan", dosage: "50mg", frequency: "1 lần/ngày" },
      { name: "Metformin", dosage: "850mg", frequency: "2 lần/ngày" },
      { name: "Omeprazole", dosage: "20mg", frequency: "1 lần/ngày trước ăn" },
      { name: "Atorvastatin", dosage: "20mg", frequency: "1 lần/ngày trước ngủ" },
      { name: "Aspirin", dosage: "81mg", frequency: "1 lần/ngày" },
      { name: "Cetirizine", dosage: "10mg", frequency: "1 lần/ngày" }
    ];

    // Generate records for each patient
    patientNames.forEach((patientName, patientIndex) => {
      const recordCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < recordCount; i++) {
        const recordDate = new Date();
        recordDate.setDate(recordDate.getDate() - Math.floor(Math.random() * 90));

        const diagnosisIndex = (patientIndex + i) % diagnoses.length;
        const treatmentIndex = (patientIndex + i) % treatments.length;

        const prescriptionCount = Math.floor(Math.random() * 3) + 1;
        const prescriptions: Prescription[] = [];
        for (let p = 0; p < prescriptionCount; p++) {
          const medIndex = Math.floor(Math.random() * medicines.length);
          prescriptions.push({
            medicine: medicines[medIndex].name,
            dosage: medicines[medIndex].dosage,
            frequency: medicines[medIndex].frequency
          });
        }

        // records.push({
        //   id: patientIndex * 10 + i + 1,
        //   patientName,
        //   age: 25 + Math.floor(Math.random() * 50),
        //   diagnosis: diagnoses[diagnosisIndex],
        //   treatment: treatments[treatmentIndex],
        //   prescriptions,
        //   tests: ["Xét nghiệm máu CBC", "X-quang phổi"],
        //   date: recordDate.toISOString().split('T')[0],
        //   status: Math.random() > 0.3 ? "completed" : "pending"
        // });
      }
    });

    return records;
  };

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [patientList, setPatientList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, selectedPatient]);
  // DATA LOADING 
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // GỌI API THẬT thay vì dùng mock
        const data = await doctorService.getMedicalRecords();

        // Kiểm tra nếu data trả về là mảng
        const records = Array.isArray(data) ? data : (data?.data || []);

        setMedicalRecords(records);
        setFilteredRecords(records);

        const uniqueNames = Array.from(
          new Set(records.map((r: any) => r.patient?.FullName).filter(Boolean))
        ) as string[];

        setPatientList(uniqueNames.sort());

        setError(false);
      } catch (err) {
        console.error("❌ Lỗi khi tải bệnh án từ API:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==================== FILTERING ====================
  useEffect(() => {
    let filtered = [...medicalRecords];

    // Search filter
    if (searchTerm.trim()) {
      const term = (searchTerm || "").toLowerCase().trim();
      filtered = filtered.filter(record =>
        (record?.patient?.FullName || "").toLowerCase().includes(term) ||
        (record?.Diagnosis || "").toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(record =>
        (record?.appointment?.Status || "").toLowerCase() === (statusFilter || "").toLowerCase()
      );
    }

    // Patient filter
    if (selectedPatient !== "all") {
      filtered = filtered.filter(record => record.patient?.FullName === selectedPatient);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= startOfDay;
          });
          break;

        case "week":
          const weekAgo = new Date(startOfDay);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= weekAgo;
          });
          break;

        case "month":
          const monthAgo = new Date(startOfDay);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= monthAgo;
          });
          break;

        case "custom":
          filtered = filtered.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= customDateRange.start && recordDate <= customDateRange.end;
          });
          break;
      }
    }

    // Sort records
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;

        case "name":
          comparison = a.patientName.localeCompare(b.patientName);
          break;

        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredRecords(filtered);
  }, [searchTerm, statusFilter, dateFilter, selectedPatient, sortBy, sortOrder, medicalRecords, customDateRange]);

  // ==================== STATISTICS ====================
  const stats = useMemo(() => {
    const total = medicalRecords.length;
    const completed = medicalRecords.filter(r => r.appointment?.Status === "Completed").length;
    const pending = total - completed;
    const uniquePatients = patientList.length;

    const diagnosisCounts = medicalRecords.reduce((acc, record) => {
      acc[record.diagnosis] = (acc[record.diagnosis] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDiagnoses = Object.entries(diagnosisCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([diagnosis, count]) => ({ diagnosis, count }));

    return {
      total,
      completed,
      pending,
      uniquePatients,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      topDiagnoses
    };
  }, [medicalRecords, patientList]);

  // ==================== EVENT HANDLERS ====================
  const handleViewMedicalRecord = (id: number) => {
    const record = medicalRecords.find(r => r.RecordID === id);
    if (record) {
      setSelectedRecord(record);
      setShowDetailModal(true);
    }
  };

  const handleGeneratePrescriptionPDF = (record: MedicalRecord) => {
    const pdfContent = `
      BỆNH VIỆN ĐA KHOA
      ===============================
      Bác sĩ: ${record.doctor?.user.FullName}
      Ngày: ${new Date().toLocaleDateString('vi-VN')}
      
      THÔNG TIN BỆNH NHÂN
      -------------------
      Họ tên: ${record.patient?.FullName}
      Ngày sinh: ${record.patient?.DateOfBirth}
      Ngày khám: ${record.created_at}
      Chẩn đoán: ${record.Diagnosis}
      
      
      HƯỚNG DẪN
      ---------
      ${record.Notes}
      
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `don-thuoc-${record.patientName}-${record.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`Đã tạo đơn thuốc cho ${record.patientName}`);
  };

  // const handleAddRecord = async () => {
  //   const patientName = prompt("Tên bệnh nhân:");
  //   const diagnosis = prompt("Chẩn đoán:");

  //   if (patientName && diagnosis) {
  //     const payload = {
  //       patientName,
  //       diagnosis,
  //       date: new Date().toISOString().split('T')[0],
  //       status: "pending"
  //     };

  //     const res = await doctorService.createMedicalRecord(payload);
  //     if (res.success) {
  //       handleRefreshData(); // Tải lại danh sách sau khi thêm
  //       alert("Đã lưu bệnh án vào hệ thống!");
  //     }
  //   }
  // };

  const handleExportRecords = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalRecords: filteredRecords.length,
      filters: { searchTerm, statusFilter, dateFilter, patient: selectedPatient },
      records: filteredRecords.map(record => ({
        id: record.id,
        patient: record.patient?.FullName,
        age: record.patient?.DateOfBirth,
        diagnosis: record.Diagnosis,
        treatment: record.Notes,
        prescriptions: record.prescriptions,
        tests: record.tests,
        date: record.date,
        status: record.appointment?.Status
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benh-an-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`Đã xuất ${filteredRecords.length} bệnh án thành công!`);
  };

  const handlePrintRecords = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Danh sách bệnh án</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            <h1>Danh sách bệnh án - BS. Nguyễn Văn A</h1>
            <div style="margin-bottom: 20px;">
              <p><strong>Tổng số bệnh án:</strong> ${filteredRecords.length}</p>
              <p><strong>Ngày in:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Bệnh nhân</th>
                  <th>Ngày sinh</th>
                  <th>Ngày khám</th>
                  <th>Chẩn đoán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRecords.map((record, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${record.patient?.FullName}</td>
                    <td>${record.patient?.DateOfBirth}</td>
                    <td>${record.created_at}</td>
                    <td>${record.Diagnosis}</td>
                    <td>${record.appointment?.Status === 'Completed' ? 'Đã hoàn thành' : 'Đang xử lý'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getMedicalRecords();
      // setMedicalRecords(Array.isArray(data) ? data : data.data);
    } catch (err) {
      alert("Không thể làm mới dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSelectedPatient("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  // RENDER LOADING/ERROR
  if (loading) {
    return <LoadingState message="Đang tải danh sách bệnh án..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Không thể tải danh sách bệnh án"
      // onRetry={handleRefreshData}
      />
    );
  }

  // MAIN RENDER
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-600" />
              Quản lý bệnh án
            </h1>
            <p className="text-gray-600 mt-2">
              Lưu trữ và quản lý thông tin bệnh án bệnh nhân
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span className="font-bold">{stats.total}</span> bệnh án
              </div>
              <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
                <span className="font-bold">{stats.completed}</span> đã hoàn thành
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                <span className="font-bold">{stats.pending}</span> đang xử lý
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* <button
              onClick={handleAddRecord}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm bệnh án
            </button> */}

            <div className="flex gap-2">
              <button
                onClick={handlePrintRecords}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                In
              </button>

              <button
                onClick={handleExportRecords}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Xuất file
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm bệnh án
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tên bệnh nhân, chẩn đoán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="pending">Đang xử lý</option>
            </select>
          </div>

          {/* Patient filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bệnh nhân
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {patientList.map((patient, index) => (
                <option
                  key={`patient-${patient}-${index}`}
                  value={patient}
                >
                  {patient}
                </option>
              ))}
            </select>
          </div>

          {/* Date filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold">{filteredRecords.length}</span> / {medicalRecords.length} bệnh án
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              Xóa bộ lọc
            </button>
            <button
              onClick={handleRefreshData}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.uniquePatients}</div>
              <div className="text-sm text-gray-600">Bệnh nhân đã khám</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.topDiagnoses.length > 0 ? stats.topDiagnoses[0].count : 0}
              </div>
              <div className="text-sm text-gray-600">Chẩn đoán phổ biến nhất</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Records Content */}
      <MedicalRecordsTab
        medicalRecords={filteredRecords}
        handleViewMedicalRecord={handleViewMedicalRecord}
        generatePrescriptionPDF={handleGeneratePrescriptionPDF}
      />

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Cập nhật: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{filteredRecords.length}</span> bệnh án
          </div>
          {/* <button
            onClick={handleAddRecord}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm bệnh án
          </button> */}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết bệnh án - {selectedRecord.patient?.FullName}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Bệnh nhân</div>
                  <div className="font-semibold">{selectedRecord.patient?.FullName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ngày sinh</div>
                  <div className="font-semibold">
                    {selectedRecord.patient?.DateOfBirth ? (
                      new Date(selectedRecord.patient?.DateOfBirth).toLocaleDateString('vi-VN')
                    ) : (
                      "Chưa có ngày sinh"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ngày khám</div>
                  <div className="font-semibold">

                    {selectedRecord.appointment?.StartTime ? (
                      new Date(selectedRecord.appointment.StartTime.replace(' ', 'T')).toLocaleDateString('vi-VN')
                    ) : (
                      "Chưa có ngày khám"
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Trạng thái</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${selectedRecord.appointment?.Status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {selectedRecord.appointment?.Status === 'Completed' ? 'Đã hoàn thành' : 'Đang xử lý'}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Chẩn đoán</div>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedRecord.Diagnosis}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Điều trị</div>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedRecord.Notes}</div>
              </div>

              {selectedRecord.prescriptions?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Đơn thuốc</div>
                  <div className="space-y-2">
                    {selectedRecord.prescriptions?.map((pres, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium">{pres.medicine}</div>
                        <div className="text-sm text-gray-600">
                          {pres.dosage} • {pres.frequency}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    handleGeneratePrescriptionPDF(selectedRecord);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  In Bệnh Án
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}