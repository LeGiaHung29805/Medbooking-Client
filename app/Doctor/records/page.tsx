"use client";

import { useState, useEffect, useMemo } from "react";
import MedicalRecordsTab from "../components/MedicalRecordsTab";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { 
  Search, 
  Filter, 
  Download, 
  Printer, 
  FileText, 
  BarChart3, 
  Plus,
  Calendar,
  User,
  Pill,
  Stethoscope
} from "lucide-react";

import type { 
  MedicalRecord, 
  Prescription,
  PatientDetail
} from  "@/lib/model";

export default function RecordsPage() {
  // ==================== STATES ====================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedPatient, setSelectedPatient] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Custom date range
  const [customDateRange, setCustomDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date()
  });

  // ==================== MOCK DATA GENERATION ====================
  const generateMockMedicalRecords = (): MedicalRecord[] => {
    const records: MedicalRecord[] = [];
    const patientNames = [
      "Trần Thị Lan", "Lê Văn Minh", "Phạm Văn Hùng", "Nguyễn Thị Hoa",
      "Đỗ Văn Tài", "Hoàng Thị Mai", "Vũ Văn Đức", "Bùi Thị Thu",
      "Trịnh Văn Sơn", "Lý Thị Nga", "Mai Văn Tuấn", "Đinh Thị Hà",
      "Ngô Văn Bình", "Phan Thị Linh", "Hồ Văn Cường", "Đặng Thị Dung"
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
      "Viêm gan B mạn tính"
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
      { name: "Cetirizine", dosage: "10mg", frequency: "1 lần/ngày" },
      { name: "Vitamin D3", dosage: "1000IU", frequency: "1 lần/ngày" },
      { name: "Calcium", dosage: "1000mg", frequency: "1 lần/ngày" },
      { name: "Levothyroxine", dosage: "50mcg", frequency: "1 lần/ngày sáng sớm" },
      { name: "Alprazolam", dosage: "0.25mg", frequency: "Khi cần, tối đa 3 viên/ngày" }
    ];
    
    const tests = [
      "Xét nghiệm máu CBC",
      "Xét nghiệm sinh hóa máu",
      "X-quang phổi",
      "Siêu âm bụng",
      "Điện tâm đồ",
      "Nội soi dạ dày",
      "Đo mật độ xương",
      "Test hơi thở",
      "Xét nghiệm chức năng gan",
      "Xét nghiệm đường huyết",
      "Đo huyết áp 24h",
      "Test dị ứng"
    ];
    
    // Generate records for each patient
    patientNames.forEach((patientName, patientIndex) => {
      const recordCount = Math.floor(Math.random() * 3) + 1; // 1-3 records per patient
      
      for (let i = 0; i < recordCount; i++) {
        const recordDate = new Date();
        recordDate.setDate(recordDate.getDate() - Math.floor(Math.random() * 90)); // Last 90 days
        
        const diagnosisIndex = (patientIndex + i) % diagnoses.length;
        const treatmentIndex = (patientIndex + i) % treatments.length;
        
        // Generate prescriptions (1-3 medicines)
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
        
        // Generate tests (0-3 tests)
        const testCount = Math.floor(Math.random() * 4);
        const recordTests: string[] = [];
        for (let t = 0; t < testCount; t++) {
          const testIndex = Math.floor(Math.random() * tests.length);
          if (!recordTests.includes(tests[testIndex])) {
            recordTests.push(tests[testIndex]);
          }
        }
        
        records.push({
          id: patientIndex * 10 + i + 1,
          patientName,
          age: 25 + Math.floor(Math.random() * 50),
          diagnosis: diagnoses[diagnosisIndex],
          treatment: treatments[treatmentIndex],
          prescriptions,
          tests: recordTests,
          date: recordDate.toISOString().split('T')[0],
          status: Math.random() > 0.3 ? "completed" : "pending"
        });
      }
    });
    
    return records;
  };

  // ==================== COMPONENT STATES ====================
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [patientList, setPatientList] = useState<string[]>([]);

  // ==================== DATA LOADING ====================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRecords = generateMockMedicalRecords();
        setMedicalRecords(mockRecords);
        setFilteredRecords(mockRecords);
        
        // Extract unique patient names
        const uniquePatients = Array.from(new Set(mockRecords.map(record => record.patientName)));
        setPatientList(uniquePatients);
        
        setError(false);
      } catch (err) {
        console.error("❌ Lỗi khi tải bệnh án:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==================== FILTERING & SORTING ====================
  useEffect(() => {
    let filtered = [...medicalRecords];
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.patientName.toLowerCase().includes(term) ||
        record.diagnosis.toLowerCase().includes(term) ||
        record.treatment.toLowerCase().includes(term) ||
        record.prescriptions.some(p => p.medicine.toLowerCase().includes(term))
      );
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }
    
    // Filter by patient
    if (selectedPatient !== "all") {
      filtered = filtered.filter(record => record.patientName === selectedPatient);
    }
    
    // Filter by date
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
    const completed = medicalRecords.filter(r => r.status === "completed").length;
    const pending = medicalRecords.filter(r => r.status === "pending").length;
    const uniquePatients = patientList.length;
    
    // Most common diagnoses
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
    const record = medicalRecords.find(r => r.id === id);
    if (record) {
      setSelectedRecord(record);
      setShowDetailModal(true);
    }
  };

  const handleGeneratePrescriptionPDF = (record: MedicalRecord) => {
    // In real app, generate PDF
    const pdfContent = `
      ĐƠN THUỐC - BỆNH VIỆN ĐA KHOA
      ===============================
      Bác sĩ: BS. Nguyễn Văn A
      Chuyên khoa: Nội tổng quát
      Ngày: ${new Date().toLocaleDateString('vi-VN')}
      
      THÔNG TIN BỆNH NHÂN
      -------------------
      Họ tên: ${record.patientName}
      Tuổi: ${record.age}
      Ngày khám: ${record.date}
      Chẩn đoán: ${record.diagnosis}
      
      ĐƠN THUỐC
      ---------
      ${record.prescriptions.map((pres, index) => `
      ${index + 1}. ${pres.medicine}
         - Liều lượng: ${pres.dosage}
         - Cách dùng: ${pres.frequency}
      `).join('\n')}
      
      HƯỚNG DẪN
      ---------
      ${record.treatment}
      
      LỊCH TÁI KHÁM
      -------------
      Tái khám sau 7 ngày hoặc khi có triệu chứng bất thường
      
      Lưu ý: Tuân thủ đúng liều lượng và thời gian dùng thuốc
      ===============================
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
    
    alert(`📄 Đã tạo đơn thuốc cho ${record.patientName}`);
  };

  const handleAddRecord = () => {
    setShowAddRecord(true);
    // In real app, open form modal
    alert("📝 Mở form thêm bệnh án mới");
  };

  const handleExportRecords = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalRecords: filteredRecords.length,
      filters: {
        searchTerm,
        statusFilter,
        dateFilter,
        patient: selectedPatient
      },
      records: filteredRecords.map(record => ({
        id: record.id,
        patient: record.patientName,
        age: record.age,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        prescriptions: record.prescriptions,
        tests: record.tests,
        date: record.date,
        status: record.status
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
    
    alert(`📥 Đã xuất ${filteredRecords.length} bệnh án thành công!`);
  };

  const handlePrintRecords = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Danh sách bệnh án - BS. Nguyễn Văn A</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .status-completed { color: green; }
              .status-pending { color: orange; }
              .summary { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>Danh sách bệnh án - BS. Nguyễn Văn A</h1>
            <div class="summary">
              <p><strong>Tổng số bệnh án:</strong> ${filteredRecords.length}</p>
              <p><strong>Bệnh nhân:</strong> ${selectedPatient === "all" ? "Tất cả" : selectedPatient}</p>
              <p><strong>Trạng thái:</strong> ${statusFilter === "all" ? "Tất cả" : statusFilter === "completed" ? "Đã hoàn thành" : "Đang xử lý"}</p>
              <p><strong>Ngày in:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Bệnh nhân</th>
                  <th>Tuổi</th>
                  <th>Ngày khám</th>
                  <th>Chẩn đoán</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRecords.map((record, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${record.patientName}</td>
                    <td>${record.age}</td>
                    <td>${record.date}</td>
                    <td>${record.diagnosis}</td>
                    <td class="status-${record.status}">${record.status === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              Trang 1/1 • In từ hệ thống Quản lý Bác sĩ
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleRefreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const newRecords = generateMockMedicalRecords();
      setMedicalRecords(newRecords);
      const uniquePatients = Array.from(new Set(newRecords.map(record => record.patientName)));
      setPatientList(uniquePatients);
      setLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSelectedPatient("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  // ==================== RENDER LOADING/ERROR ====================
  if (loading) {
    return <LoadingState message="Đang tải danh sách bệnh án..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Không thể tải danh sách bệnh án" 
        onRetry={handleRefreshData}
      />
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="space-y-6">
      {/* Header section */}
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
            
            {/* Stats chips */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <span className="font-bold">{stats.total}</span> bệnh án
              </div>
              <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="font-bold">{stats.completed}</span> đã hoàn thành
              </div>
              <div className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <span className="font-bold">{stats.pending}</span> đang xử lý
              </div>
              <div className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                <span className="font-bold">{stats.uniquePatients}</span> bệnh nhân
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddRecord}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Thêm bệnh án
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handlePrintRecords}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                In danh sách
              </button>
              
              <button
                onClick={handleExportRecords}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Xuất file
              </button>
            </div>
          </div>
        </div>
        
        {/* View mode and sort */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 ${viewMode === "list" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"}`}
            >
              Danh sách
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 ${viewMode === "grid" ? "bg-emerald-600 text-white" : "bg-white text-gray-700"}`}
            >
              Lưới
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "name" | "status")}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="date">Ngày khám</option>
              <option value="name">Tên bệnh nhân</option>
              <option value="status">Trạng thái</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Filters section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm bệnh án
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tên bệnh nhân, chẩn đoán, thuốc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả bệnh nhân</option>
              {patientList.map(patient => (
                <option key={patient} value={patient}>{patient}</option>
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>
        </div>
        
        {/* Custom date range */}
        {dateFilter === "custom" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={customDateRange.start.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    start: new Date(e.target.value)
                  }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={customDateRange.end.toISOString().split('T')[0]}
                  onChange={(e) => setCustomDateRange(prev => ({
                    ...prev,
                    end: new Date(e.target.value)
                  }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Filter actions */}
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
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
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
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
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
          <div className="text-sm text-gray-600">
            Trung bình {stats.total > 0 ? (stats.total / stats.uniquePatients).toFixed(1) : 0} bệnh án/bệnh nhân
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
  {stats.topDiagnoses.length > 0 ? 
    (stats.topDiagnoses[0] as any).count : 0}
</div>
              <div className="text-sm text-gray-600">Chẩn đoán phổ biến nhất</div>
            </div>
          </div>
          <div className="text-sm text-gray-500 truncate">
            {stats.topDiagnoses.length > 0 ? stats.topDiagnoses[0].diagnosis : "Không có dữ liệu"}
          </div>
        </div>
      </div>

      {/* Main Records Content */}
      <MedicalRecordsTab
        medicalRecords={filteredRecords}
        handleViewMedicalRecord={handleViewMedicalRecord}
        generatePrescriptionPDF={handleGeneratePrescriptionPDF}
        viewMode={viewMode}
      />

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{filteredRecords.length}</span> bệnh án được tìm thấy
          </div>
          <button
            onClick={handleAddRecord}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm bệnh án mới
          </button>
        </div>
      </div>

      {/* Detail Modal (Simplified) */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết bệnh án - {selectedRecord.patientName}
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
                  <div className="font-semibold">{selectedRecord.patientName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Tuổi</div>
                  <div className="font-semibold">{selectedRecord.age}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ngày khám</div>
                  <div className="font-semibold">{selectedRecord.date}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Trạng thái</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedRecord.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRecord.status === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Chẩn đoán</div>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedRecord.diagnosis}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Điều trị</div>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedRecord.treatment}</div>
              </div>
              
              {selectedRecord.prescriptions.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Đơn thuốc</div>
                  <div className="space-y-2">
                    {selectedRecord.prescriptions.map((pres, index) => (
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
                  In đơn thuốc
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