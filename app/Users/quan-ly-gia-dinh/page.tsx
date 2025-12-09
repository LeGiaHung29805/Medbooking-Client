"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, X, Search, UserCheck } from "lucide-react";
import LayoutUsers from "@/components/layoutUsers";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";
import DataThumbnail from "@/components/thumnail/DataThumbnail";
import { AxiosError } from "axios";

export default function QuanLyGiaDinh() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [members, setMembers] = useState<Model.FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE FORM TÌM KIẾM & THÊM ---
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<Model.User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [relation, setRelation] = useState("");

  // --- 1. USE EFFECT: Load dữ liệu khi vào trang ---
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await Api.getFamilyMembers();
      setMembers(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- 2. HÀM TÌM KIẾM NGƯỜI DÙNG ĐỂ THÊM ---
  const handleSearchUser = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      // Gọi API tìm user
      const users = await Api.searchUserPublic(searchQuery);
      // Lấy người đầu tiên tìm thấy khác với chính mình (logic lọc tùy backend)
      if (users.length > 0) {
        setSearchResult(users[0]);
      } else {
        alert("Không tìm thấy người dùng này trong hệ thống.");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tìm kiếm.");
    } finally {
      setIsSearching(false);
    }
  };

  // --- 3. HÀM LƯU (LIÊN KẾT) THÀNH VIÊN ---
  const saveMember = async () => {
    if (!searchResult) {
      alert("Vui lòng tìm kiếm người thân trước!");
      return;
    }
    if (!relation) {
      alert("Vui lòng chọn mối quan hệ!");
      return;
    }

    try {
      // Gọi API thêm thành viên
      await Api.addFamilyMember(searchResult.UserID, relation);
      alert("✅ Thêm thành viên thành công!");

      // Reset form và load lại danh sách
      resetForm();
      setShowForm(false);
      loadData();
    } catch (error: unknown) { // 1. Khai báo là unknown (không biết trước kiểu lỗi)
      let msg = "Thêm thất bại";

      // 2. Kiểm tra xem lỗi có phải từ Axios không
      if (error instanceof AxiosError && error.response?.data?.message) {
        // TypeScript giờ đã hiểu cấu trúc bên trong error
        msg = error.response.data.message;
      }

      alert("❌ " + msg);
    }
  };

  // --- 4. HÀM XÓA THÀNH VIÊN ---
  const removeMember = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy liên kết với thành viên này?")) return;

    try {
      await Api.removeFamilyMember(id);
      // Cập nhật UI ngay lập tức (Optimistic UI)
      setMembers(members.filter((m) => m.UserID !== id));
    } catch (error) {
      console.log(error)
      alert("Xóa thất bại.");
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setSearchResult(null);
    setRelation("");
  };

  return (
    <LayoutUsers>
      <div className="p-6 min-h-screen bg-gray-50">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Quản lý gia đình</h1>
            <p className="text-gray-500 text-sm">Liên kết tài khoản người thân để đặt lịch hộ.</p>
          </div>
        </div>

        {/* Form Thêm Thành Viên (Logic Tìm kiếm -> Link) */}
        {showForm ? (
          <div className="bg-white border rounded-xl shadow-sm p-6 mb-6 animate-in slide-in-from-top-2">
            <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" /> Thêm thành viên mới
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột Trái: Tìm kiếm */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Bước 1: Tìm người thân (SĐT/Email)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button
                    onClick={handleSearchUser}
                    disabled={isSearching}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                  >
                    {isSearching ? "..." : <Search className="w-5 h-5" />}
                  </button>
                </div>

                {/* Kết quả tìm kiếm */}
                {searchResult && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-12 h-12">
                      <DataThumbnail src={searchResult.avatar_url} alt={searchResult.FullName} fallbackType="user" className="rounded-full w-full h-full" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{searchResult.FullName}</p>
                      <p className="text-xs text-gray-500">{searchResult.PhoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cột Phải: Chọn quan hệ & Lưu */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Bước 2: Chọn quan hệ</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white disabled:bg-gray-100"
                  disabled={!searchResult}
                >
                  <option value="">-- Họ là gì của bạn? --</option>
                  <option value="Bố">Bố</option>
                  <option value="Mẹ">Mẹ</option>
                  <option value="Vợ">Vợ</option>
                  <option value="Chồng">Chồng</option>
                  <option value="Con">Con</option>
                  <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                  <option value="Ông/Bà">Ông/Bà</option>
                </select>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => { resetForm(); setShowForm(false); }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center text-gray-600"
                  >
                    <X className="w-4 h-4 mr-2" /> Hủy
                  </button>
                  <button
                    onClick={saveMember}
                    disabled={!searchResult || !relation}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" /> Lưu lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Nút mở form */
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 shadow-sm transition"
          >
            <Plus className="w-5 h-5 mr-2" /> Thêm thành viên
          </button>
        )}

        {/* Danh sách thành viên */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải dữ liệu...</div>
        ) : members.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">
              <UserCheck className="w-10 h-10" />
            </div>
            <p className="font-medium text-gray-800 mb-1">Chưa có thành viên nào</p>
            <p className="text-gray-500">Hãy thêm người thân để bắt đầu.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase">
                <tr>
                  <th className="py-4 px-6">Thành viên</th>
                  <th className="py-4 px-6">Quan hệ</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Ngày sinh</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Điện thoại</th>
                  <th className="py-4 px-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.UserID} className="hover:bg-green-50 transition duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0">
                          <DataThumbnail src={member.avatar_url} alt={member.FullName} fallbackType="user" className="rounded-full w-full h-full border" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{member.FullName}</p>
                          <p className="text-xs text-gray-500 sm:hidden">{member.PhoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                        {member.RelationType || member.pivot?.RelationType}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell text-gray-600">{member.DateOfBirth || "---"}</td>
                    <td className="py-4 px-6 hidden sm:table-cell text-gray-600">{member.PhoneNumber || "---"}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => removeMember(member.UserID)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                        title="Hủy liên kết"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutUsers>
  );
}