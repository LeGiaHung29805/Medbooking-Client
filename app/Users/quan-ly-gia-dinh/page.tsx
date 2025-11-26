"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import LayoutUsers from "@/components/layoutUsers";

interface Member {
  id: number;
  name: string;
  relation: string;
  dob?: string;
  phone?: string;
  gender?: string;
  avatar?: string;
}

export default function QuanLyGiaDinh() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    dob: "",
    phone: "",
    gender: "",
    avatar: "",
  });
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setFormData({
      name: "",
      relation: "",
      dob: "",
      phone: "",
      gender: "",
      avatar: "",
    });
    setEditingId(null);
  };

  const startAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (member: Member) => {
    setFormData({
      name: member.name,
      relation: member.relation,
      dob: member.dob || "",
      phone: member.phone || "",
      gender: member.gender || "",
      avatar: member.avatar || "",
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveMember = () => {
    if (!formData.name || !formData.relation) {
      alert("Vui lòng nhập đủ tên và quan hệ!");
      return;
    }

    if (editingId) {
      setMembers(
        members.map((m) =>
          m.id === editingId
            ? {
              ...m,
              ...formData,
              avatar: formData.avatar || "/default-avatar.png",
            }
            : m
        )
      );
    } else {
      const newMember: Member = {
        id: Date.now(),
        ...formData,
        avatar: formData.avatar || "/default-avatar.png",
      };
      setMembers([...members, newMember]);
    }

    resetForm();
    setShowForm(false);
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <LayoutUsers>
      <div className="p-6">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Quản lý gia đình</h1>
          <button
            onClick={startAdd}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm thành viên
          </button>
        </div>

        {/* Nếu chưa có thành viên */}
        {members.length === 0 ? (
          <div className="bg-white border rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[250px]">
            <div className="text-gray-400 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zm8 2c-1.858 0-5.5.928-5.5 2.75V18h11v-2.25C21.5 13.928 17.858 13 16 13zm-8 0c-.923 0-2.21.207-3.178.592C3.5 14.104 2.5 15.016 2.5 16.25V18h7v-2.25c0-1.094.603-2.058 1.516-2.641C10.204 13.394 9.077 13 8 13z"></path>
              </svg>
            </div>
            <p className="font-medium mb-1">Chưa có thành viên nào</p>
            <p className="text-gray-500 mb-4">
              Bạn chưa thêm thành viên nào vào gia đình
            </p>
            <button
              onClick={startAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm thành viên đầu tiên
            </button>
          </div>
        ) : (
          // Nếu có thành viên → render danh sách
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Thành viên</th>
                  <th className="py-2">Quan hệ</th>
                  <th className="py-2">Ngày sinh</th>
                  <th className="py-2">Điện thoại</th>
                  <th className="py-2">Giới tính</th>
                  <th className="py-2 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{member.name}</span>
                    </td>
                    <td className="py-3">{member.relation}</td>
                    <td className="py-3">{member.dob || "-"}</td>
                    <td className="py-3">{member.phone || "-"}</td>
                    <td className="py-3">{member.gender || "-"}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => startEdit(member)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Edit className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form inline thêm/sửa */}
        {showForm && (
          <div className="mt-6 bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Sửa thành viên" : "Thêm thành viên"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Tên thành viên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Quan hệ</label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                >
                  <option value="">-- Chọn quan hệ --</option>
                  <option value="Bố">Bố</option>
                  <option value="Mẹ">Mẹ</option>
                  <option value="Anh">Anh</option>
                  <option value="Chị">Chị</option>
                  <option value="Em">Em</option>
                  <option value="Con trai">Con trai</option>
                  <option value="Con gái">Con gái</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              {/*chọn ảnh đại diện */}

              <div>
                <label className="block text-sm font-medium">
                  Ảnh đại diện (chọn ảnh)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setFormData({ ...formData, avatar: previewUrl });
                    }
                  }}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
                {formData.avatar && (
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    className="mt-2 w-16 h-16 rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center"
              >
                <X className="w-4 h-4 mr-2" /> Hủy
              </button>
              <button
                onClick={saveMember}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutUsers>
  );
}
