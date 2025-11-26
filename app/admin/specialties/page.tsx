"use client";

import React, { useState, useEffect, useMemo } from "react";
// 1. Import API và Model thật
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";

// ===============================================
// 1. MODAL FORM (Logic API đã được tích hợp vào UI cũ)
// ===============================================

interface SpecialtyFormProps {
  specialty: Model.Specialty | null; // Dùng Model thật
  onClose: () => void;
  onSuccess: () => void;
}

const SpecialtyFormModal: React.FC<SpecialtyFormProps> = ({
  specialty,
  onClose,
  onSuccess,
}) => {
  const isEdit = !!specialty;
  const [loading, setLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    SpecialtyName: specialty?.SpecialtyName || "",
    Description: specialty?.Description || "",
  });

  // State xử lý file ảnh
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Logic hiển thị ảnh preview:
  // Nếu có ảnh cũ từ server -> hiển thị (nối thêm domain nếu cần)
  // Nếu chọn ảnh mới -> hiển thị blob local
  const getInitialPreview = () => {
    if (specialty?.imageURL) {
      return specialty.imageURL.startsWith("http")
        ? specialty.imageURL
        : `http://127.0.0.1:8000${specialty.imageURL}`;
    }
    return "";
  };

  const [previewUrl, setPreviewUrl] = useState<string>(getInitialPreview());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Xem trước ảnh local
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Chuẩn bị FormData (Bắt buộc để gửi file)
      const data = new FormData();
      data.append("SpecialtyName", formData.SpecialtyName);
      if (formData.Description)
        data.append("Description", formData.Description);

      // Gửi file ảnh với key là 'imageURL' (Khớp Backend)
      if (selectedFile) {
        data.append("imageURL", selectedFile);
      }

      // 2. Gọi API thật
      if (isEdit && specialty) {
        await Api.adminUpdateSpecialty(specialty.SpecialtyID, data);
        alert("✅ Cập nhật chuyên khoa thành công!");
      } else {
        await Api.adminCreateSpecialty(data);
        alert("✅ Tạo chuyên khoa mới thành công!");
      }

      onSuccess(); // Load lại danh sách
      onClose();
    } catch (error: any) {
      console.error("Error:", error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      alert("❌ " + msg);
    } finally {
      setLoading(false);
    }
  };

  // --- GIAO DIỆN CŨ CỦA BẠN (GIỮ NGUYÊN) ---
  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Sửa Chuyên khoa" : "Thêm Chuyên khoa mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Tên Chuyên khoa */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên Chuyên khoa
              </label>
              <input
                type="text"
                name="SpecialtyName"
                value={formData.SpecialtyName}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Link Ảnh (Đã sửa thành Upload File) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ảnh Minh Họa
              </label>

              {/* Input File thay vì Input Text */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* Preview Ảnh */}
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover mt-2 border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://placehold.co/40x40/E0E0E0/000?text=CK";
                  }}
                />
              ) : (
                <div className="mt-2 text-xs text-gray-400">Chưa có ảnh</div>
              )}
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
                  <span className="mr-2 animate-spin">⌛</span> Đang lưu...
                </>
              ) : (
                <>
                  <span className="mr-2">💾</span>{" "}
                  {isEdit ? "Cập nhật" : "Thêm mới"}
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
// 2. MAIN COMPONENT (Kết nối API thật)
// ===============================================

export default function SpecialtyManagementPage() {
  const [specialties, setSpecialties] = useState<Model.Specialty[]>([]); // Dữ liệu thật
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<Model.Specialty | null>(null);

  // --- LOAD DATA TỪ API ---
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await Api.getSpecialties(); // Gọi API GET
      setSpecialties(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu
  useEffect(() => {
    loadData();
  }, []);

  // --- FILTER CLIENT-SIDE ---
  const filteredSpecialties = useMemo(() => {
    if (!searchQuery) return specialties;
    const query = searchQuery.toLowerCase();
    return specialties.filter(
      (s) =>
        s.SpecialtyName.toLowerCase().includes(query) ||
        (s.Description || "").toLowerCase().includes(query)
    );
  }, [specialties, searchQuery]);

  // --- HANDLERS ---
  const handleSuccess = () => {
    setIsModalOpen(false);
    loadData(); // Reload data từ server để thấy thay đổi mới nhất
  };

  const handleOpenModal = (specialty: Model.Specialty | null = null) => {
    setSelectedSpecialty(specialty);
    setIsModalOpen(true);
  };

  // Xử lý xóa thật
  const handleDelete = async (specialtyId: number) => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa chuyên khoa này? Việc này sẽ ảnh hưởng đến các bác sĩ liên quan."
      )
    ) {
      try {
        await Api.adminDeleteSpecialty(specialtyId); // Gọi API DELETE
        // Xóa trên giao diện ngay lập tức
        setSpecialties((prev) =>
          prev.filter((s) => s.SpecialtyID !== specialtyId)
        );
        alert("🗑️ Đã xóa thành công.");
      } catch (error) {
        console.error(error);
        alert("❌ Xóa thất bại. Có thể do ràng buộc dữ liệu (còn Bác sĩ).");
      }
    }
  };

  // --- RENDER (GIỮ NGUYÊN GIAO DIỆN CŨ) ---
  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
        🏥 Quản lý Danh mục Chuyên khoa
      </h1>

      {/* Thanh Điều khiển */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-wrap items-center justify-between space-y-3 md:space-y-0">
          {/* Tìm kiếm */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên chuyên khoa..."
              className="p-2 pl-10 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* Nút Thêm mới */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md w-full md:w-auto"
          >
            <span>➕</span>
            <span>Thêm Chuyên khoa</span>
          </button>
        </div>
      </div>

      {/* Bảng Danh sách Chuyên khoa */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">
                  Ảnh
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                  Tên Chuyên khoa
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-auto">
                  Mô tả
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredSpecialties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Không tìm thấy chuyên khoa nào.
                  </td>
                </tr>
              ) : (
                filteredSpecialties.map((specialty) => (
                  <tr key={specialty.SpecialtyID} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700 font-semibold">
                      {specialty.SpecialtyID}
                    </td>

                    {/* Cột Ảnh (Xử lý đường dẫn thật) */}
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <img
                        src={
                          specialty.imageURL
                            ? specialty.imageURL.startsWith("http")
                              ? specialty.imageURL
                              : `http://127.0.0.1:8000${specialty.imageURL}`
                            : "https://placehold.co/40x40/E0E0E0/000?text=CK"
                        }
                        alt={specialty.SpecialtyName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://placehold.co/40x40/E0E0E0/000?text=CK";
                        }}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {specialty.SpecialtyName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {specialty.Description}
                    </td>
                    <td className="py-3 px-4 text-sm flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(specialty)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(specialty.SpecialtyID)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SpecialtyFormModal
          specialty={selectedSpecialty}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
