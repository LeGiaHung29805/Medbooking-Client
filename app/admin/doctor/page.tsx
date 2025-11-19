"use client";

import React, { useState, useMemo } from 'react';


interface Specialty {
    id: number;
    name: string;
}

interface DoctorUser {
    UserID: number;
    FullName: string;
    Email: string;
    PhoneNumber: string;
    Status: 'Active' | 'Inactive' | 'Pending'; // Từ bảng Users
    // Các trường từ bảng Doctors
    SpecialtyID: number;
    Degree: string;
    YearsOfExperience: number;
    ProfileDescription: string;
}

interface DoctorFormProps {
    doctor: DoctorUser | null; // Null khi tạo mới
    specialties: Specialty[];
    onClose: () => void;
    onSuccess: (updatedDoctor: DoctorUser) => void;
}

const DOCTORS_PER_PAGE = 10;
const STATUSES = ['Active', 'Inactive'];

const MOCK_SPECIALTIES: Specialty[] = [
    { id: 1, name: 'Nội Tổng Quát' },
    { id: 2, name: 'Da Liễu' },
    { id: 3, name: 'Tim Mạch' },
    { id: 4, name: 'Răng Hàm Mặt' },
];

// Dữ liệu giả lập Bác sĩ
const INITIAL_DOCTORS: DoctorUser[] = [
    { UserID: 201, FullName: 'Trần Thị B (Nội)', Email: 'dr.b@hunre.com', PhoneNumber: '0912345679', Status: 'Active', SpecialtyID: 1, Degree: 'Thạc sĩ', YearsOfExperience: 15, ProfileDescription: 'Chuyên gia khám và chữa trị các bệnh nội khoa cấp tính.' },
    { UserID: 202, FullName: 'Hoàng Văn E (Da Liễu)', Email: 'dr.e@hunre.com', PhoneNumber: '0912345682', Status: 'Inactive', SpecialtyID: 2, Degree: 'Tiến sĩ', YearsOfExperience: 8, ProfileDescription: 'Có kinh nghiệm lâu năm trong điều trị mụn trứng cá và các bệnh tự miễn.' },
    { UserID: 203, FullName: 'Lý Văn I (Tim Mạch)', Email: 'dr.i@hunre.com', PhoneNumber: '0912345686', Status: 'Active', SpecialtyID: 3, Degree: 'Bác sĩ CKII', YearsOfExperience: 22, ProfileDescription: 'Giám đốc chuyên môn khoa Tim mạch, chuyên về can thiệp mạch vành.' },
    { UserID: 204, FullName: 'Phạm Thị K (RHM)', Email: 'dr.k@hunre.com', PhoneNumber: '0912345687', Status: 'Active', SpecialtyID: 4, Degree: 'Bác sĩ', YearsOfExperience: 5, ProfileDescription: 'Chuyên về chỉnh nha và thẩm mỹ nụ cười.' },
    ...Array.from({ length: 7 }, (_, i) => ({
        UserID: 205 + i,
        FullName: `Bác sĩ Test ${i + 1}`,
        Email: `dr.test${i + 1}@hunre.com`,
        PhoneNumber: `098765432${i}`,
        Status: 'Active' as const,
        SpecialtyID: (i % 4) + 1,
        Degree: 'Bác sĩ',
        YearsOfExperience: 3 + i,
        ProfileDescription: `Mô tả ngắn gọn về kinh nghiệm bác sĩ Test ${i + 1}`,
    }))
];

const DoctorFormModal: React.FC<DoctorFormProps> = ({ doctor, specialties, onClose, onSuccess }) => {
    const isEdit = !!doctor;
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [formData, setFormData] = useState({
        FullName: doctor?.FullName || '',
        Email: doctor?.Email || '',
        PhoneNumber: doctor?.PhoneNumber || '',
        SpecialtyID: doctor?.SpecialtyID || specialties[0]?.id,
        Degree: doctor?.Degree || '',
        YearsOfExperience: doctor?.YearsOfExperience.toString() || '1',
        ProfileDescription: doctor?.ProfileDescription || '',
        Status: doctor?.Status || 'Active',
        Password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'SpecialtyID' || name === 'YearsOfExperience') ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!isEdit && !formData.Password) {
            alert("Vui lòng nhập mật khẩu khi tạo tài khoản mới.");
            setLoading(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedDoctor: DoctorUser = {
            ...doctor,
            UserID: doctor?.UserID || Date.now(),
            FullName: formData.FullName,
            Email: formData.Email,
            PhoneNumber: formData.PhoneNumber,
            SpecialtyID: formData.SpecialtyID as number,
            Degree: formData.Degree,
            YearsOfExperience: parseInt(formData.YearsOfExperience),
            ProfileDescription: formData.ProfileDescription,
            Status: formData.Status as DoctorUser['Status'],
        };

        if (isEdit) {
            // GỌI API CẬP NHẬT: ApiClient.adminUpdateDoctor(updatedDoctor.UserID, formData);
            console.log(`[API UPDATE] Bác sĩ ID ${updatedDoctor.UserID}.`);
        } else {
            // GỌI API TẠO MỚI: ApiClient.adminCreateDoctor(formData);
            console.log(`[API CREATE] Tạo mới Bác sĩ: ${updatedDoctor.FullName}.`);
        }

        setLoading(false);
        onClose();
        onSuccess(updatedDoctor);
    };

    return (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl my-8">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Sửa hồ sơ Bác sĩ' : 'Thêm Bác sĩ mới'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* THÔNG TIN CHUNG (Users Table) */}
                        <h3 className="col-span-full text-lg font-bold mt-2 border-b pb-1">Thông tin Tài khoản & Cơ bản</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                            <input type="text" name="FullName" value={formData.FullName} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                            <select name="SpecialtyID" value={formData.SpecialtyID} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                {specialties.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email (Tài khoản đăng nhập)</label>
                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {/* Mật khẩu/Reset */}
                        <div className="col-span-1 md:col-span-2">
                            {(isResettingPassword || !isEdit) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{!isEdit ? 'Mật khẩu' : 'Mật khẩu mới (Tạm thời)'}</label>
                                    <input type="password" name="Password" value={formData.Password} onChange={handleChange} required={!isEdit} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                                    {isEdit && <p className="mt-1 text-xs text-red-500">Mật khẩu mới sẽ được băm và lưu.</p>}
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

                        {/* THÔNG TIN CHUYÊN MÔN (Doctors Table) */}
                        <h3 className="col-span-full text-lg font-bold mt-4 border-b pb-1">Thông tin Chuyên môn</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                            <input type="text" name="Degree" value={formData.Degree} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Năm kinh nghiệm</label>
                            <input type="number" name="YearsOfExperience" value={formData.YearsOfExperience} onChange={handleChange} required min="1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Mô tả hồ sơ (ProfileDescription)</label>
                            <textarea name="ProfileDescription" value={formData.ProfileDescription} onChange={handleChange} rows={3} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        {/* Trạng thái (Chỉ khi sửa) */}
                        {isEdit && (
                            <div className="md:col-span-2">
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
                                    <span className="mr-2">💾</span> {isEdit ? 'Cập nhật' : 'Tạo hồ sơ'}
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
// 3. MAIN COMPONENT
// ===============================================

export default function DoctorManagementPage() {
    const [doctors, setDoctors] = useState<DoctorUser[]>(INITIAL_DOCTORS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorUser | null>(null);

    // Ánh xạ SpecialtyID sang tên chuyên khoa
    const specialtyMap = useMemo(() => {
        return MOCK_SPECIALTIES.reduce((map, s) => {
            map.set(s.id, s.name);
            return map;
        }, new Map<number, string>());
    }, []);

    // Giả lập hàm fetch data và filtering
    const filteredDoctors = useMemo(() => {
        let filtered = doctors;

        if (filterSpecialty && filterSpecialty !== 'ALL') {
            filtered = filtered.filter(d => d.SpecialtyID === parseInt(filterSpecialty));
        }

        if (searchQuery) {
            filtered = filtered.filter(d =>
                d.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                specialtyMap.get(d.SpecialtyID)?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [doctors, filterSpecialty, searchQuery, specialtyMap]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE);
    const currentDoctors = useMemo(() => {
        const startIndex = (currentPage - 1) * DOCTORS_PER_PAGE;
        return filteredDoctors.slice(startIndex, startIndex + DOCTORS_PER_PAGE);
    }, [filteredDoctors, currentPage]);

    // Xử lý khi API call thành công (tạo mới/cập nhật)
    const handleSuccess = (updatedDoctor: DoctorUser) => {
        setIsModalOpen(false);

        setDoctors(prevDoctors => {
            const existingIndex = prevDoctors.findIndex(d => d.UserID === updatedDoctor.UserID);

            if (existingIndex > -1) {
                // Cập nhật
                return prevDoctors.map((d, index) => index === existingIndex ? updatedDoctor : d);
            } else {
                // Tạo mới (thêm vào đầu danh sách)
                return [updatedDoctor, ...prevDoctors];
            }
        });
    };

    // Xử lý mở modal
    const handleOpenModal = (doctor: DoctorUser | null = null) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    // Xử lý xóa (vô hiệu hóa) - Đổi trạng thái thành Inactive
    const handleDelete = (userId: number) => {
        if (confirm("Bạn có chắc chắn muốn VÔ HIỆU HÓA bác sĩ này? Việc này sẽ ảnh hưởng đến lịch khám của bác sĩ.")) {
            // Logic gọi API: ApiClient.adminUpdateUser(userId, { Status: 'Inactive' });
            setDoctors(prev => prev.map(d => d.UserID === userId ? { ...d, Status: 'Inactive' } : d));
            console.log(`Đã vô hiệu hóa UserID: ${userId}`);
        }
    };

    // Render
    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
                🧑‍⚕️ Quản lý Hồ sơ Bác sĩ
            </h1>

            {/* Thanh Điều khiển */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <div className="flex flex-wrap items-center justify-between space-y-3 md:space-y-0">

                    {/* Tìm kiếm & Lọc */}
                    <div className="flex space-x-3 items-center w-full md:w-auto">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
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
                                value={filterSpecialty}
                                onChange={(e) => {
                                    setFilterSpecialty(e.target.value);
                                    setCurrentPage(1); // Reset trang khi lọc
                                }}
                                className="p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">Tất cả Chuyên khoa</option>
                                {MOCK_SPECIALTIES.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                ⚙️
                            </span>
                        </div>
                    </div>

                    {/* Nút Thêm bác sĩ */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md w-full md:w-auto"
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
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Họ và Tên</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chuyên khoa</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bằng cấp/KN</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Liên hệ</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentDoctors.map((doctor) => (
                                <tr key={doctor.UserID} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-700">{doctor.UserID}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{doctor.FullName}</td>
                                    <td className="py-3 px-4 text-sm font-semibold text-blue-600">
                                        {specialtyMap.get(doctor.SpecialtyID)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {doctor.Degree}
                                        <br /><span className="text-xs text-gray-500">{doctor.YearsOfExperience} năm</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {doctor.Email}
                                        <br /><span className="text-xs text-gray-500">{doctor.PhoneNumber}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${doctor.Status === 'Active' ? 'bg-green-100 text-green-700' :
                                                doctor.Status === 'Inactive' ? 'bg-gray-200 text-gray-700' :
                                                    'bg-orange-100 text-orange-700'
                                            }`}>
                                            {doctor.Status}
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
                                            onClick={() => handleDelete(doctor.UserID)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                            title="Vô hiệu hóa"
                                        >
                                            <span className="w-4 h-4">🗑️</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentDoctors.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        Không tìm thấy bác sĩ nào khớp với tiêu chí tìm kiếm/lọc.
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
                    Hiển thị {currentDoctors.length} trên tổng số {filteredDoctors.length} bác sĩ
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
                <DoctorFormModal
                    doctor={selectedDoctor}
                    specialties={MOCK_SPECIALTIES}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}