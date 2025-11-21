"use client";

import React, { useState, useEffect, useMemo } from "react";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";

// ===============================================
// 1. COMPONENT FORM MODAL
// ===============================================

interface DoctorFormProps {
  doctor: Model.Doctor | null;
  specialties: Model.Specialty[];
  onClose: () => void;
  onSuccess: () => void;
}

const DoctorFormModal: React.FC<DoctorFormProps> = ({
  doctor,
  specialties,
  onClose,
  onSuccess,
}) => {
  const isEdit = !!doctor;
  const [loading, setLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // --- Map dữ liệu API vào Form ---
  const [formData, setFormData] = useState({
    FullName: doctor?.user?.FullName || "",
    Email: doctor?.user?.Email || "",
    Password: "",
    PhoneNumber: doctor?.user?.PhoneNumber || "",
    SpecialtyID: doctor?.SpecialtyID || specialties[0]?.SpecialtyID || 0,
    Degree: doctor?.Degree || "",
    YearsOfExperience: doctor?.YearsOfExperience || 1,
    ProfileDescription: doctor?.ProfileDescription || "",
    Status: doctor?.user?.Status || "HoatDong",
    // Giữ nguyên ImageURL để map với logic hiển thị cũ
    ImageURL: doctor?.imageURL || doctor?.user?.avatar_url || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Logic preview ảnh: Ưu tiên file chọn > Link ảnh cũ > Rỗng
  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : formData.ImageURL;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "SpecialtyID" || name === "YearsOfExperience"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, ImageURL: "" }));
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate password khi tạo mới
    if (!isEdit && !formData.Password) {
      alert("Vui lòng nhập mật khẩu khi tạo tài khoản mới.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("FullName", formData.FullName);
      data.append("Email", formData.Email);
      data.append("PhoneNumber", formData.PhoneNumber);
      data.append("SpecialtyID", formData.SpecialtyID.toString());
      data.append("Degree", formData.Degree);
      data.append("YearsOfExperience", formData.YearsOfExperience.toString());
      data.append("Status", formData.Status);

      if (formData.ProfileDescription)
        data.append("ProfileDescription", formData.ProfileDescription);
      if (formData.Password && (isResettingPassword || !isEdit)) {
        data.append("Password", formData.Password);
      }
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      if (isEdit && doctor) {
        await Api.adminUpdateDoctor(doctor.DoctorID, data);
        alert("Cập nhật thành công!");
      } else {
        await Api.adminCreateDoctor(data);
        alert("Tạo hồ sơ thành công!");
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert("Lỗi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Lớp phủ bên ngoài
    <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Container chính của Modal */}
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Sửa hồ sơ Bác sĩ" : "Thêm Bác sĩ mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* THÔNG TIN CHUNG */}
            <h3 className="col-span-full text-lg font-bold mt-2 border-b pb-1">
              Thông tin Tài khoản & Cơ bản
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ và Tên
              </label>
              <input
                type="text"
                name="FullName"
                value={formData.FullName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chuyên khoa
              </label>
              <select
                name="SpecialtyID"
                value={formData.SpecialtyID}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {specialties.map((s) => (
                  <option key={s.SpecialtyID} value={s.SpecialtyID}>
                    {s.SpecialtyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (Tài khoản đăng nhập)
              </label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Mật khẩu/Reset */}
            <div className="col-span-1 md:col-span-2">
              {(isResettingPassword || !isEdit) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {!isEdit ? "Mật khẩu" : "Mật khẩu mới (Tạm thời)"}
                  </label>
                  <input
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required={!isEdit}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {isEdit && (
                    <p className="mt-1 text-xs text-red-500">
                      Mật khẩu mới sẽ được băm và lưu.
                    </p>
                  )}
                </div>
              )}

              {isEdit && !isResettingPassword && (
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-150 mt-1"
                >
                  <span className="w-4 h-4 mr-1">🔑</span>
                  <span>Reset Mật khẩu</span>
                </button>
              )}
            </div>

            {/* THÔNG TIN CHUYÊN MÔN */}
            <h3 className="col-span-full text-lg font-bold mt-4 border-b pb-1">
              Thông tin Chuyên môn
            </h3>

            {/* INPUT ẢNH */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh Đại Diện (Profile Picture)
              </label>
              <div className="flex items-start space-x-4">
                {/* Preview Image */}
                <img
                  src={
                    previewUrl ||
                    "https://placehold.co/64x64/E0E0E0/000?text=👤"
                  }
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/64x64/E0E0E0/000?text=👤";
                  }}
                />

                {/* File Input */}
                <div className="flex flex-col space-y-2 flex-grow">
                  <input
                    type="file"
                    name="avatarFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {/* URL Input Fallback (nếu code cũ có dùng) */}
                  <input
                    type="url"
                    name="ImageURL"
                    value={formData.ImageURL}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md text-sm hidden" // Ẩn đi vì đã dùng upload file
                    disabled={!!selectedFile}
                  />

                  {/* Nút xóa ảnh */}
                  {(previewUrl || formData.ImageURL) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 text-sm ml-auto flex-shrink-0"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Kích thước gợi ý: 1:1, dưới 1MB.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bằng cấp
              </label>
              <input
                type="text"
                name="Degree"
                value={formData.Degree}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Năm kinh nghiệm
              </label>
              <input
                type="number"
                name="YearsOfExperience"
                value={formData.YearsOfExperience}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Mô tả hồ sơ (ProfileDescription)
              </label>
              <textarea
                name="ProfileDescription"
                value={formData.ProfileDescription}
                onChange={handleChange}
                rows={3}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Trạng thái (Chỉ khi sửa) */}
            {isEdit && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="HoatDong">Active (Hoạt động)</option>
                  <option value="Khoa">Inactive (Khóa)</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 animate-spin">💾</span> Đang lưu...
                </>
              ) : (
                <>
                  <span className="mr-2">💾</span>{" "}
                  {isEdit ? "Cập nhật" : "Tạo hồ sơ"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===============================================
// 2. MAIN COMPONENT
// ===============================================

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<Model.Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Model.Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Model.Doctor | null>(
    null
  );
  const ITEMS_PER_PAGE = 10;

  // --- Load Data ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [docsData, specsData] = await Promise.all([
        Api.getDoctors(),
        Api.getSpecialties(),
      ]);
      setDoctors(docsData);
      setSpecialties(specsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  // --- Handlers ---
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn VÔ HIỆU HÓA bác sĩ này?")) {
      try {
        await Api.adminDeleteDoctor(id);
        setDoctors((prev) => prev.filter((d) => d.DoctorID !== id));
        alert("Đã xóa thành công.");
      } catch (error) {
        alert("Xóa thất bại.");
      }
    }
  };

  const handleOpenModal = (doctor: Model.Doctor | null = null) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    loadData();
  };

  // --- Filter ---
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Map data chuẩn API vào biến local để search
      const name = doc.user?.FullName?.toLowerCase() || "";
      const email = doc.user?.Email?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesSpec =
        filterSpecialty === "ALL" ||
        doc.SpecialtyID === Number(filterSpecialty);

      return matchesSearch && matchesSpec;
    });
  }, [doctors, searchQuery, filterSpecialty]);

  const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const currentDoctors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDoctors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDoctors, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSpecialty]);

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
        🧑‍⚕️ Quản lý Hồ sơ Bác sĩ
      </h1>

      {/* Thanh Điều khiển */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-wrap items-center justify-between space-y-3 md:space-y-0">
          <div className="flex space-x-3 items-center w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
                className="p-2 pl-10 border border-gray-300 rounded-lg w-full md:w-72 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>

            <div className="relative">
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Tất cả Chuyên khoa</option>
                {specialties.map((s) => (
                  <option key={s.SpecialtyID} value={s.SpecialtyID}>
                    {s.SpecialtyName}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ⚙️
              </span>
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md w-full md:w-auto"
          >
            <span>➕</span>
            <span>Thêm Bác sĩ Mới</span>
          </button>
        </div>
      </div>

      {/* Bảng Danh sách Bác sĩ */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Họ và Tên
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chuyên khoa
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bằng cấp/KN
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentDoctors.map((doctor) => {
                // Lấy dữ liệu từ object lồng nhau (doctor.user)
                const fullName = doctor.user?.FullName || "N/A";
                const email = doctor.user?.Email || "N/A";
                const phone = doctor.user?.PhoneNumber || "N/A";
                const status = doctor.user?.Status || "HoatDong";
                const avatar =
                  doctor.imageURL ||
                  doctor.user?.avatar_url ||
                  "https://placehold.co/40x40/E0E0E0/000?text=👤";

                // Tìm tên chuyên khoa
                const specName =
                  specialties.find((s) => s.SpecialtyID === doctor.SpecialtyID)
                    ?.SpecialtyName || "---";

                return (
                  <tr key={doctor.DoctorID} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <div className="relative w-10 h-10">
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-full h-full rounded-full object-cover border border-gray-300"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://placehold.co/40x40/E0E0E0/000?text=👤";
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                      {fullName}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-blue-600">
                      {specName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {doctor.Degree}
                      <br />
                      <span className="text-xs text-gray-500">
                        {doctor.YearsOfExperience} năm
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {email}
                      <br />
                      <span className="text-xs text-gray-500">{phone}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          status === "HoatDong"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {status === "HoatDong" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(doctor)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <span className="w-4 h-4">✏️</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.DoctorID)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Vô hiệu hóa"
                      >
                        <span className="w-4 h-4">🗑️</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {currentDoctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    {loading
                      ? "Đang tải dữ liệu..."
                      : "Không tìm thấy bác sĩ nào khớp với tiêu chí tìm kiếm/lọc."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân Trang */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Hiển thị {currentDoctors.length} trên tổng số {filteredDoctors.length}{" "}
          bác sĩ
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-medium text-blue-600">
            Trang {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {isModalOpen && (
        <DoctorFormModal
          doctor={selectedDoctor}
          specialties={specialties}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
