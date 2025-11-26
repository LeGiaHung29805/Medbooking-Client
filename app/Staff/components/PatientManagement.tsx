"use client";

import { useState } from "react";

interface Patient {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  medicalHistory: MedicalVisit[];
}

interface MedicalVisit {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  notes: string;
}

export default function PatientManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "PT001",
      username: "nguyenvana",
      firstName: "Văn A",
      lastName: "Nguyễn",
      email: "nguyenvana@email.com",
      phone: "0901234567",
      dateOfBirth: "1990-05-15",
      gender: "male",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      medicalHistory: [
        {
          id: "V001",
          date: "2025-10-15",
          doctor: "BS. Trần Thị B",
          diagnosis: "Cảm cúm thông thường",
          treatment: "Paracetamol 500mg x 3 lần/ngày",
          notes: "Tái khám sau 1 tuần nếu không khỏi",
        },
        {
          id: "V002",
          date: "2025-09-20",
          doctor: "BS. Phạm Văn D",
          diagnosis: "Đau dạ dày",
          treatment: "Omeprazole 20mg x 2 lần/ngày",
          notes: "Kiêng ăn cay, uống nhiều nước",
        },
      ],
    },
    {
      id: "PT002",
      username: "lethic",
      firstName: "Thị C",
      lastName: "Lê",
      email: "lethic@email.com",
      phone: "0912345678",
      dateOfBirth: "1985-08-22",
      gender: "female",
      address: "456 Đường XYZ, Quận 3, TP.HCM",
      medicalHistory: [
        {
          id: "V003",
          date: "2025-11-01",
          doctor: "BS. Nguyễn Văn G",
          diagnosis: "Cao huyết áp",
          treatment: "Thuốc hạ huyết áp theo đơn",
          notes: "Kiểm tra huyết áp hàng tuần",
        },
      ],
    },
    {
      id: "PT003",
      username: "tranvane",
      firstName: "Văn E",
      lastName: "Trần",
      email: "tranvane@email.com",
      phone: "0923456789",
      dateOfBirth: "1995-03-10",
      gender: "male",
      address: "789 Đường DEF, Quận 5, TP.HCM",
      medicalHistory: [],
    },
  ]);

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(searchLower) ||
      patient.lastName.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.id.toLowerCase().includes(searchLower)
    );
  });

  const viewPatientDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý bệnh nhân
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách tất cả bệnh nhân trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Thêm bệnh nhân mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, SĐT, Email, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold">{filteredPatients.length}</span>{" "}
            bệnh nhân
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày sinh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giới tính
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {patient.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">
                        {patient.lastName.charAt(0)}
                        {patient.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.lastName} {patient.firstName}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{patient.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.phone}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.dateOfBirth}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.gender === "male"
                    ? "Nam"
                    : patient.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => viewPatientDetail(patient)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Chi tiết
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thêm bệnh nhân mới
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ đệm *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  Thêm bệnh nhân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {showDetailModal && selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết bệnh nhân
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-xl">
                    {selectedPatient.lastName.charAt(0)}
                    {selectedPatient.firstName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedPatient.lastName} {selectedPatient.firstName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {selectedPatient.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedPatient.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={selectedPatient.phone}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    value={selectedPatient.dateOfBirth}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    value={selectedPatient.gender}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <textarea
                    value={selectedPatient.address}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                  Lưu thay đổi
                </button>
              </div>
            </div>

            {/* Medical History */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lịch sử khám bệnh
              </h3>
              {selectedPatient.medicalHistory.length > 0 ? (
                <div className="space-y-4">
                  {selectedPatient.medicalHistory.map((visit) => (
                    <div
                      key={visit.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {visit.diagnosis}
                          </p>
                          <p className="text-sm text-gray-500">
                            Ngày khám: {visit.date}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                          {visit.id}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Bác sĩ:</span>{" "}
                          {visit.doctor}
                        </p>
                        <p>
                          <span className="font-medium">Điều trị:</span>{" "}
                          {visit.treatment}
                        </p>
                        <p>
                          <span className="font-medium">Ghi chú:</span>{" "}
                          {visit.notes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Chưa có lịch sử khám bệnh</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
