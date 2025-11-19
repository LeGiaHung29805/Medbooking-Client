"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ===============================================
// 1. DEFINITIONS AND MOCK DATA
// ===============================================

interface User {
    UserID: number;
    FullName: string;
    Email: string;
    PhoneNumber: string;
    Role: 'PATIENT' | 'DOCTOR' | 'STAFF' | 'ADMIN';
    Status: 'Active' | 'Inactive' | 'Pending';
    SpecialtyID?: number; // Chỉ có ở DOCTOR (từ bảng Doctors)
    DateOfBirth?: string; // KHỚP DB: Kiểu date, dùng string yyyy-mm-dd
    Gender?: string; // KHỚP DB: Kiểu varchar(10)
}

interface UserFormProps {
    user: User | null; // Null khi tạo mới
    onClose: () => void;
    onSuccess: (updatedUser: User) => void;
}

// KHỚP VỚI DB: Các giá trị Role và Status
const ROLES = ['PATIENT', 'DOCTOR', 'STAFF', 'ADMIN'];
const STATUSES = ['Active', 'Inactive', 'Pending'];
const USERS_PER_PAGE = 10;

// Dữ liệu giả lập (Mock Data)
const MOCK_USERS: User[] = [
    { UserID: 101, FullName: 'Nguyễn Văn A (Admin)', Email: 'admin@hunre.com', PhoneNumber: '0912345678', Role: 'ADMIN', Status: 'Active', DateOfBirth: '1985-05-15', Gender: 'Nam' },
    { UserID: 102, FullName: 'Trần Thị B (Bác sĩ Nội)', Email: 'dr.b@hunre.com', PhoneNumber: '0912345679', Role: 'DOCTOR', Status: 'Active', SpecialtyID: 1, DateOfBirth: '1990-08-22', Gender: 'Nữ' },
    { UserID: 103, FullName: 'Lê Văn C (Nhân viên)', Email: 'staff.c@hunre.com', PhoneNumber: '0912345680', Role: 'STAFF', Status: 'Active', DateOfBirth: '1995-01-01', Gender: 'Nam' },
    { UserID: 104, FullName: 'Phạm Thị D (Bệnh nhân)', Email: 'patient.d@mail.com', PhoneNumber: '0912345681', Role: 'PATIENT', Status: 'Active', DateOfBirth: '2000-11-20', Gender: 'Nữ' },
    { UserID: 105, FullName: 'Hoàng Văn E (Bác sĩ Da Liễu)', Email: 'dr.e@hunre.com', PhoneNumber: '0912345682', Role: 'DOCTOR', Status: 'Inactive', SpecialtyID: 2, DateOfBirth: '1988-03-10', Gender: 'Nam' },
    { UserID: 106, FullName: 'Vũ Thị F (Bệnh nhân)', Email: 'patient.f@mail.com', PhoneNumber: '0912345683', Role: 'PATIENT', Status: 'Active', DateOfBirth: '1975-12-05', Gender: 'Nữ' },
    { UserID: 107, FullName: 'Đặng Văn G (Admin Test)', Email: 'admin2@hunre.com', PhoneNumber: '0912345684', Role: 'ADMIN', Status: 'Pending', DateOfBirth: '1992-06-25', Gender: 'Khác' },
    { UserID: 108, FullName: 'Bùi Thị H (Bệnh nhân)', Email: 'patient.h@mail.com', PhoneNumber: '0912345685', Role: 'PATIENT', Status: 'Active', DateOfBirth: '2005-04-14', Gender: 'Nữ' },
    { UserID: 109, FullName: 'Lý Văn I (Bác sĩ Tim Mạch)', Email: 'dr.i@hunre.com', PhoneNumber: '0912345686', Role: 'DOCTOR', Status: 'Active', SpecialtyID: 3, DateOfBirth: '1970-09-30', Gender: 'Nam' },
    { UserID: 110, FullName: 'Ngô Thị K (Nhân viên)', Email: 'staff.k@hunre.com', PhoneNumber: '0912345687', Role: 'STAFF', Status: 'Active', DateOfBirth: '1998-02-18', Gender: 'Khác' },
    { UserID: 111, FullName: 'Trịnh Văn L', Email: 'patient.l@mail.com', PhoneNumber: '0912345688', Role: 'PATIENT', Status: 'Active', DateOfBirth: '1989-07-07', Gender: 'Nam' },
    { UserID: 112, FullName: 'Đỗ Thị M', Email: 'patient.m@mail.com', PhoneNumber: '0912345689', Role: 'PATIENT', Status: 'Active', DateOfBirth: '1999-10-10', Gender: 'Nữ' },
    { UserID: 113, FullName: 'Chu Văn N', Email: 'patient.n@mail.com', PhoneNumber: '0912345690', Role: 'PATIENT', Status: 'Inactive', DateOfBirth: '1980-03-29', Gender: 'Nam' },
    { UserID: 114, FullName: 'Hồ Thị P', Email: 'patient.p@mail.com', PhoneNumber: '0912345691', Role: 'PATIENT', Status: 'Active', DateOfBirth: '1994-05-05', Gender: 'Nữ' },
    { UserID: 115, FullName: 'Mai Văn Q', Email: 'patient.q@mail.com', PhoneNumber: '0912345692', Role: 'PATIENT', Status: 'Active', DateOfBirth: '2001-01-20', Gender: 'Nam' },
];

const MOCK_SPECIALTIES = [
    { id: 1, name: 'Nội Tổng Quát' },
    { id: 2, name: 'Da Liễu' },
    { id: 3, name: 'Tim Mạch' },
];
const UserFormModal: React.FC<UserFormProps> = ({ user, onClose, onSuccess }) => {
    const isEdit = !!user;
    // State quản lý việc Reset Mật khẩu
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [formData, setFormData] = useState({
        FullName: user?.FullName || '',
        Email: user?.Email || '',
        PhoneNumber: user?.PhoneNumber || '',
        DateOfBirth: user?.DateOfBirth || '',
        Gender: user?.Gender || 'Nam',
        Role: user?.Role || 'PATIENT',
        Status: user?.Status || 'Active',
        SpecialtyID: user?.SpecialtyID || (user?.Role === 'DOCTOR' ? MOCK_SPECIALTIES[0].id : undefined),
        Password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'SpecialtyID' ? parseInt(value) : value }));

        if (name === 'Role') {
            if (value !== 'DOCTOR') {
                setFormData(prev => ({ ...prev, SpecialtyID: undefined }));
            } else if (value === 'DOCTOR' && !prev.SpecialtyID) {
                setFormData(prev => ({ ...prev, SpecialtyID: MOCK_SPECIALTIES[0].id }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if ((!isEdit || isResettingPassword) && !formData.Password) {
            if (!isEdit) {
                alert("Vui lòng nhập mật khẩu khi tạo tài khoản mới.");
            } else if (isResettingPassword) {
                alert("Vui lòng nhập mật khẩu mới hoặc Hủy thao tác Reset.");
            }
            setLoading(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedUser: User = {
            ...user,
            UserID: user?.UserID || Date.now(),
            FullName: formData.FullName,
            Email: formData.Email,
            PhoneNumber: formData.PhoneNumber,
            DateOfBirth: formData.DateOfBirth,
            Gender: formData.Gender,
            Role: formData.Role as User['Role'],
            Status: formData.Status as User['Status'],
            SpecialtyID: formData.Role === 'DOCTOR' ? formData.SpecialtyID : undefined,
        };

        if (isEdit) {
            console.log(`[API UPDATE] UserID ${updatedUser.UserID}: Gửi thông tin. Mật khẩu: ${formData.Password ? 'Có đổi' : 'Không đổi'}`);
        } else {
            console.log(`[API CREATE] Tạo mới User Role: ${updatedUser.Role}.`);
        }

        setLoading(false);
        onClose();
        onSuccess(updatedUser);
    };

    return (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Sửa thông tin người dùng' : 'Thêm người dùng mới'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tên */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                            <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                            <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                            <select name="Gender" value={formData.Gender} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {/* Vai trò */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                            <select name="Role" value={formData.Role} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" disabled={isEdit && user.Role === 'ADMIN'}>
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Chuyên khoa (Chỉ cho Bác sĩ) */}
                        {formData.Role === 'DOCTOR' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                                <select name="SpecialtyID" value={formData.SpecialtyID} onChange={handleChange} required={formData.Role === 'DOCTOR'} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    {MOCK_SPECIALTIES.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Mật khẩu (Chỉ khi tạo mới HOẶC khi Admin chọn reset) */}
                        {(isResettingPassword || !isEdit) && (
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">{!isEdit ? 'Mật khẩu' : 'Mật khẩu mới (Tạm thời)'}</label>
                                <input type="password" name="Password" value={formData.Password} onChange={handleChange} required={!isEdit} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                                {isEdit && <p className="mt-1 text-xs text-red-500">Mật khẩu mới sẽ được băm và ghi đè lên mật khẩu cũ.</p>}
                            </div>
                        )}

                        {/* Nút Reset (Chỉ hiện khi sửa và chưa mở ô nhập) */}
                        {isEdit && !isResettingPassword && (
                            <div className="col-span-1 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => setIsResettingPassword(true)}
                                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-150"
                                >
                                    <span className="w-4 h-4 mr-1">✏️</span>
                                    <span>Reset Mật khẩu</span>
                                </button>
                            </div>
                        )}

                        {/* Trạng thái (Chỉ khi sửa) */}
                        {isEdit && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select name="Status" value={formData.Status} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                            Hủy
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="mr-2 animate-spin">💾</span> Đang lưu...
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">💾</span> {isEdit ? 'Cập nhật' : 'Tạo tài khoản'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        let filtered = users;

        if (filterRole && filterRole !== 'ALL') {
            filtered = filtered.filter(u => u.Role === filterRole);
        }

        if (searchQuery) {
            filtered = filtered.filter(u =>
                u.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.PhoneNumber.includes(searchQuery)
            );
        }
        return filtered;
    }, [users, filterRole, searchQuery]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const currentUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    // Xử lý khi API call thành công (tạo mới/cập nhật)
    const handleSuccess = (updatedUser: User) => {
        setIsModalOpen(false);

        setUsers(prevUsers => {
            const existingIndex = prevUsers.findIndex(u => u.UserID === updatedUser.UserID);

            if (existingIndex > -1) {
                // Cập nhật
                return prevUsers.map((u, index) => index === existingIndex ? updatedUser : u);
            } else {
                // Tạo mới (thêm vào đầu danh sách)
                return [updatedUser, ...prevUsers];
            }
        });
    };

    // Xử lý mở modal
    const handleOpenModal = (user: User | null = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // Xử lý xóa (vô hiệu hóa) - Đổi trạng thái thành Inactive
    const handleDelete = (userId: number) => {
        if (confirm("Bạn có chắc chắn muốn VÔ HIỆU HÓA người dùng này?")) {
            // Logic gọi API: ApiClient.adminUpdateUser(userId, { Status: 'Inactive' });
            setUsers(prev => prev.map(u => u.UserID === userId ? { ...u, Status: 'Inactive' } : u));
            console.log(`Đã vô hiệu hóa UserID: ${userId}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
                👤 Quản lý Tài khoản Người dùng
            </h1>

            {/* Thanh Điều khiển */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <div className="flex flex-wrap items-center justify-between space-y-3 md:space-y-0">

                    {/* Tìm kiếm & Lọc */}
                    <div className="flex space-x-3 items-center w-full md:w-auto">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, SĐT..."
                                className="p-2 pl-10 border border-gray-300 rounded-lg w-full md:w-72 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset trang khi tìm kiếm
                                }}
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔍
                            </span>
                        </div>

                        <div className="relative">
                            <select
                                value={filterRole}
                                onChange={(e) => {
                                    setFilterRole(e.target.value);
                                    setCurrentPage(1); // Reset trang khi lọc
                                }}
                                className="p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">Tất cả Vai trò</option>
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                ⚙️
                            </span>
                        </div>
                    </div>

                    {/* Nút Thêm người dùng */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md w-full md:w-auto"
                    >
                        <span>➕</span>
                        <span>Thêm Người Dùng Mới</span>
                    </button>
                </div>
            </div>

            {/* Bảng Danh sách Người dùng */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Họ và Tên</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Liên hệ</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày sinh/GT</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vai trò</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user) => (
                                <tr key={user.UserID} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.UserID}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{user.FullName}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {user.Email}
                                        <br /><span className="text-xs text-gray-500">{user.PhoneNumber}</span>
                                    </td>
                                    {/* Cột mới: Ngày sinh/Giới tính */}
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {user.DateOfBirth}
                                        <br /><span className="text-xs text-gray-500">{user.Gender}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${user.Role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                            user.Role === 'DOCTOR' ? 'bg-green-100 text-green-800' :
                                                user.Role === 'STAFF' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${user.Status === 'Active' ? 'bg-green-100 text-green-700' :
                                            user.Status === 'Inactive' ? 'bg-gray-200 text-gray-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                            {user.Status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm flex space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                            title="Chỉnh sửa"
                                        >
                                            <span className="w-4 h-4">✏️</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.UserID)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                            title="Vô hiệu hóa"
                                        >
                                            <span className="w-4 h-4">🗑️</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentUsers.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        Không tìm thấy người dùng nào khớp với tiêu chí tìm kiếm/lọc.
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
                    Hiển thị {currentUsers.length} trên tổng số {filteredUsers.length} tài khoản
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        -
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-blue-600">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <UserFormModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}