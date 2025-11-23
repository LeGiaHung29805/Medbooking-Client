"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { adminCreateDoctor, adminUpdateDoctor, getDoctors } from "@/lib/ApiClient";

// ===============================================
// 1. INTERFACE & MOCK DATA
// ===============================================

interface Specialty {
    id: number;
    name: string;
}

interface DoctorUser {
    UserID: number;
    FullName: string;
    Email: string;
    PhoneNumber: string;
    Status: 'Active' | 'Inactive' | 'Pending' | 'on_leave';
    SpecialtyID: number;
    Degree: string;
    YearsOfExperience: number;
    ProfileDescription: string;
    ImageURL?: string;
}

interface DoctorFormProps {
    doctor: DoctorUser | null;
    specialties: Specialty[];
    onClose: () => void;
    onSuccess: (updatedDoctor: DoctorUser) => void;
}

const DOCTORS_PER_PAGE = 10;
const STATUSES = ['Active', 'Inactive'];

// Dữ liệu giả lập Chuyên khoa
const MOCK_SPECIALTIES: Specialty[] = [
    { id: 1, name: 'Nội Tổng Quát' },
    { id: 2, name: 'Da Liễu' },
    { id: 3, name: 'Tim Mạch' },
    { id: 4, name: 'Răng Hàm Mặt' },
    { id: 5, name: 'Nhi Khoa' },
    { id: 6, name: 'Phụ Sản' },
    { id: 7, name: 'Tai Mũi Họng' },
    { id: 8, name: 'Cơ Xương Khớp' },
    { id: 9, name: 'Tiết Niệu' },
    { id: 10, name: 'Mắt' },
    { id: 11, name: 'Truyền Nhiễm' },
    { id: 12, name: 'Thần Kinh' },
    { id: 13, name: 'Ung Bướu' },
    { id: 14, name: 'Ngoại Tổng Quát' },
    { id: 15, name: 'Gây Mê Hồi Sức' },
    { id: 16, name: 'Chẩn Đoán Hình Ảnh' },
];

  const DOCTORS_FROM_FRONTEND: DoctorUser[] = [
      {
        UserID: 1,
        FullName: "Nguyễn Hoàng A",
        Email: "dr.a@hunre.com",
        PhoneNumber: "0901234561",
        Status: "Active",
        SpecialtyID: 1,
        Degree: "Thạc sĩ, Bác sĩ chuyên khoa II",
        YearsOfExperience: 20,
        ProfileDescription: "20 năm kinh nghiệm Sản Phụ khoa",
        ImageURL: "/image/doctors/doctor1.jpg",
    
    },

    {
        UserID: 2,
        FullName: "Trần Thu B",
        Email: "dr.b@hunre.com",
        PhoneNumber: "0901234562",
        Status: "Active",
        SpecialtyID: 2,
        Degree: "Bác sĩ CKI",
        YearsOfExperience: 15,
        ProfileDescription: "15 năm kinh nghiệm Nội khoa",
        ImageURL: "/image/doctors/doctor2.jpg",
    },

    {
        UserID: 3,
        FullName: "Lê Văn C",
        Email: "dr.c@hunre.com",
        PhoneNumber: "0901234563",
        Status: "on_leave",
        SpecialtyID: 3,
        Degree: "PGS. TS, Bác sĩ",
        YearsOfExperience: 25,
        ProfileDescription: "25 năm kinh nghiệm Ngoại khoa",
        ImageURL: "/image/doctors/doctor1.jpg",
    },
    
    {
        UserID: 4,
        FullName: "Phạm Thị D",
        Email: "dr.d@hunre.com",
        PhoneNumber: "0901234564",
        Status: "Active",
        SpecialtyID: 4,
        Degree: "Thạc sĩ, Bác sĩ chuyên khoa I",
        YearsOfExperience: 15,
        ProfileDescription: "15 năm kinh nghiệm Tai Mũi Họng",
        ImageURL: "/image/doctors/doctor4.jpg",
    },

    {
        UserID: 5,
        FullName: "Hoàng Văn E",
        Email: "dr.e@hunre.com",
        PhoneNumber: "0901234565",
        Status: "Active",
        SpecialtyID: 5,
        Degree: "Bác sĩ chuyên khoa I",
        YearsOfExperience: 10,
        ProfileDescription: "10 năm kinh nghiệm Răng Hàm Mặt",
        ImageURL: "/image/doctors/doctor5.jpg",
    },

    {
        UserID: 6,
        FullName: "Ngô Thị F",
        Email: "dr.f@hunre.com",
        PhoneNumber: "0901234566",
        Status: "Active",
        SpecialtyID: 6,
        Degree: "Bác sĩ nội trú",
        YearsOfExperience: 6,
        ProfileDescription: "6 năm kinh nghiệm Nhi khoa",
        ImageURL: "/image/doctors/doctor6.jpg",
    },

    {
        UserID: 7,
        FullName: "Vũ Văn G",
        Email: "dr.g@hunre.com",
        PhoneNumber: "0901234567",
        Status: "Active",
        SpecialtyID: 7,
        Degree: "Thạc sĩ, Bác sĩ chuyên khoa II",
        YearsOfExperience: 18,
        ProfileDescription: "18 năm kinh nghiệm Da liễu",
        ImageURL: "/image/doctors/doctor7.jpg",
    },

    {
        UserID: 8,
        FullName: "Bùi Thị H",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234568",
        Status: "on_leave",
        SpecialtyID: 8,
        Degree: "Bác sĩ chuyên khoa II",
        YearsOfExperience: 22,
        ProfileDescription: "22 năm kinh nghiệm Cơ Xương Khớp",
        ImageURL: "/image/doctors/doctor8.jpg",
    },

    {
        UserID: 9,
        FullName: "Đặng Văn I",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234569",
        Status: "Active",
        SpecialtyID: 9,
        Degree: "Bác sĩ chuyên khoa I",
        YearsOfExperience: 11,  
        ProfileDescription: "11 năm kinh nghiệm Tiết niệu",
        ImageURL: "/image/doctors/doctor9.jpg",
    },

    {
        UserID: 10,
        FullName: "Phan Thị K",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234570",
        Status: "Active",
        SpecialtyID: 10,
        Degree: "Bác sĩ chuyên khoa II",
        YearsOfExperience: 16,
        ProfileDescription: "16 năm kinh nghiệm Mắt",
        ImageURL: "/image/doctors/doctor10.jpg",
    },

    {
        UserID: 11,
        FullName: "Trương Văn L",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234571",
        Status: "Active",
        SpecialtyID: 11,
        Degree: "Thạc sĩ",
        YearsOfExperience: 14,
        ProfileDescription: "14 năm kinh nghiệm Truyền nhiễm",
        ImageURL: "/image/doctors/doctor11.jpg",
    },

    {
        UserID: 12,
        FullName: "Nguyễn Thị M",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234572",
        Status: "Inactive",
        SpecialtyID: 12,
        Degree: "Bác sĩ chuyên khoa I",
        YearsOfExperience: 9,
        ProfileDescription: "9 năm kinh nghiệm Thần kinh",
        ImageURL: "/image/doctors/doctor12.jpg",
    },

    {
        UserID: 13,
        FullName: "Lý Văn N",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234573",
        Status: "Active",
        SpecialtyID: 13,
        Degree: "TS.BS, Bác sĩ chuyên khoa II",
        YearsOfExperience: 28,
        ProfileDescription: "28 năm kinh nghiệm Ung bướu",
        ImageURL: "/image/doctors/doctor13.jpg",
    },

    {
        UserID: 14,
        FullName: "Phùng Thị O",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234574",
        Status: "Active",
        SpecialtyID: 14,
        Degree: "Bác sĩ chuyên khoa I",
        YearsOfExperience: 13,
        ProfileDescription: "13 năm kinh nghiệm Ngoại Tổng quát",
        ImageURL: "/image/doctors/doctor14.jpg",
    },

    {
        UserID: 15,
        FullName: "Đỗ Văn P",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234575",
        Status: "Active",
        SpecialtyID: 15,
        Degree: "Bác sĩ Gây mê hồi sức",
        YearsOfExperience: 12,
        ProfileDescription: "12 năm kinh nghiệm Gây mê hồi sức",
        ImageURL: "/image/doctors/doctor15.jpg",
    },

    {
        UserID: 16,
        FullName: "Hà Thị Q",
        Email: "dr.h@hunre.com",
        PhoneNumber: "0901234576",
        Status: "Active",
        SpecialtyID: 16,
        Degree: "Bác sĩ Chẩn đoán hình ảnh",
        YearsOfExperience: 8,
        ProfileDescription: "8 năm kinh nghiệm Chẩn đoán hình ảnh",
        ImageURL: "/image/doctors/doctor16.jpg",
    }

] as DoctorUser[];

// ===============================================
// 2. MODAL THÊM/SỬA BÁC SĨ
// ===============================================

const DoctorFormModal: React.FC<DoctorFormProps> = ({ doctor, specialties, onClose, onSuccess }) => {
    const isEdit = !!doctor;
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [formData, setFormData] = useState({
        FullName: doctor?.FullName || '',
        Email: doctor?.Email || '',
        PhoneNumber: doctor?.PhoneNumber || '',
        SpecialtyID: doctor?.SpecialtyID || specialties[0]?.id || 1,
        Degree: doctor?.Degree || '',
        YearsOfExperience: doctor?.YearsOfExperience?.toString() || '1',
        ProfileDescription: doctor?.ProfileDescription || '',
        Status: doctor?.Status || 'Active',
        Password: '',
        ImageURL: doctor?.ImageURL || '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : formData.ImageURL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'SpecialtyID' || name === 'YearsOfExperience') ? parseInt(value) || 0 : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setFormData(prev => ({ ...prev, ImageURL: '' }));
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // BỎ QUA API – DÙNG MOCK DATA ĐỂ TEST (BÌNH THƯỜNG 100% KHI BACKEND CHƯA CHẠY)
    console.log("Backend chưa chạy → dùng mock để lưu bác sĩ");

    const newDoctor: DoctorUser = {
        UserID: doctor?.UserID || Date.now(),
        FullName: formData.FullName,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
        SpecialtyID: formData.SpecialtyID,
        Degree: formData.Degree,
        YearsOfExperience: parseInt(formData.YearsOfExperience),
        ProfileDescription: formData.ProfileDescription,
        Status: formData.Status as any,
        ImageURL: selectedFile ? URL.createObjectURL(selectedFile) : formData.ImageURL || 'https://placehold.co/100x100/E0E0E0/666?text=New',
    };

    // Gọi onSuccess như thật
    onSuccess(newDoctor);
    alert(isEdit ? "Cập nhật thành công (mock)!" : "Tạo bác sĩ thành công (mock)!");
    setLoading(false);
};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Sửa hồ sơ Bác sĩ' : 'Thêm Bác sĩ mới'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            {(isResettingPassword || !isEdit) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {!isEdit ? 'Mật khẩu' : 'Mật khẩu mới'}
                                    </label>
                                    <input type="password" name="Password" value={formData.Password} onChange={handleChange} required={!isEdit} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                                    {isEdit && <p className="mt-1 text-xs text-red-500">Mật khẩu mới sẽ được băm và lưu.</p>}
                                </div>
                            )}

                            {isEdit && !isResettingPassword && (
                                <button type="button" onClick={() => setIsResettingPassword(true)} className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition duration-150 mt-1">
                                    <span>Reset Mật khẩu</span>
                                </button>
                            )}
                        </div>

                        <h3 className="col-span-full text-lg font-bold mt-4 border-b pb-1">Thông tin Chuyên môn</h3>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Đại Diện</label>
                            <div className="flex items-start space-x-4">
                                <img
                                    src={previewUrl || 'https://placehold.co/64x64/E0E0E0/000?text=Doctor'}
                                    alt="Avatar Preview"
                                    className="w-16 h-16 rounded-full object-cover border border-gray-300 flex-shrink-0"
                                />
                                <div className="flex flex-col space-y-2 flex-grow">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    <input 
                                        type="text" 
                                        name="ImageURL" 
                                        value={formData.ImageURL} 
                                        onChange={handleChange} 
                                        placeholder=" /image/doctors/doctor16.jpg hoặc https://..."
                                        className="block w-full p-2 border border-gray-300 rounded-md text-sm" 
                                        disabled={!!selectedFile}
                                    />
                                </div>
                                {(previewUrl || formData.ImageURL) && (
                                    <button type="button" onClick={handleRemoveImage} className="text-red-500 hover:text-red-700 text-sm ml-auto flex-shrink-0">Xóa</button>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Kích thước gợi ý: 1:1, dưới 1MB.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bằng cấp</label>
                            <input type="text" name="Degree" value={formData.Degree} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Năm kinh nghiệm</label>
                            <input type="number" name="YearsOfExperience" value={formData.YearsOfExperience} onChange={handleChange} required min="1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Mô tả hồ sơ</label>
                            <textarea name="ProfileDescription" value={formData.ProfileDescription} onChange={handleChange} rows={3} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                        </div>

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
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center">
                            {loading ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo hồ sơ')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ===============================================
// 3. TRANG CHÍNH
// ===============================================

export default function DoctorManagementPage() {
    const [doctors, setDoctors] = useState<DoctorUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorUser | null>(null);

    // Load danh sách bác sĩ từ API
useEffect(() => {
    setDoctors(DOCTORS_FROM_FRONTEND);
    setLoading(false);
}, []);

    const specialtyMap = useMemo(() => {
        return MOCK_SPECIALTIES.reduce((map, s) => {
            map.set(s.id, s.name);
            return map;
        }, new Map<number, string>());
    }, []);

    const filteredDoctors = useMemo(() => {
        let filtered = doctors;
        if (filterSpecialty !== 'ALL') {
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

    const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE);
    const currentDoctors = filteredDoctors.slice((currentPage - 1) * DOCTORS_PER_PAGE, currentPage * DOCTORS_PER_PAGE);

    const handleSuccess = (updatedDoctor: DoctorUser) => {
    setIsModalOpen(false);

    setDoctors(prev => {
        const index = prev.findIndex(d => d.UserID === updatedDoctor.UserID);

        // Nếu có => cập nhật
        if (index > -1) {
            return prev.map(d => 
                d.UserID === updatedDoctor.UserID ? updatedDoctor : d
            );
        }

        // Nếu không có => thêm mới
        return [...prev, updatedDoctor];
    });

    setSelectedDoctor(null);
};


    const handleOpenModal = (doctor: DoctorUser | null = null) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };
     
    // Vô hiệu hóa bác sĩ 
    // const handleDelete = (userId: number) => {
    //     if (confirm("Bạn có chắc chắn muốn VÔ HIỆU HÓA bác sĩ này?")) {
    //         setDoctors(prev => prev.map(d => d.UserID === userId ? { ...d, Status: 'Inactive' } : d));
    //     }
    // };

    //Xóa hẳn bác sĩ (nếu cần)
    const handleDelete = (userId: number) => {
        if (confirm("Bạn có chắc chắn muốn XÓA hẳn bác sĩ này?")) {
            setDoctors(prev => prev.filter(d => d.UserID !== userId));
        }
    };


    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải danh sách bác sĩ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
                Quản lý Hồ sơ Bác sĩ
            </h1>

            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <div className="flex flex-wrap items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex space-x-3 items-center w-full md:w-auto">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
                                className="p-2 pl-10 border border-gray-300 rounded-lg w-full md:w-72 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                        </div>

                        <div className="relative">
                            <select
                                value={filterSpecialty}
                                onChange={(e) => {
                                    setFilterSpecialty(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">Tất cả Chuyên khoa</option>
                                {MOCK_SPECIALTIES.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-150 shadow-md w-full md:w-auto"
                    >
                        <span>➕</span>
                        <span>Thêm Bác sĩ Mới</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
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
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <div className='relative w-10 h-10'>
                                            <img
                                                src={doctor.ImageURL || 'https://placehold.co/40x40/E0E0E0/666?text=BS'}
                                                alt={doctor.FullName}
                                                className="w-full h-full rounded-full object-cover border border-gray-300"
                                                onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = 'https://placehold.co/40x40/E0E0E0/666?text=BS';
                                                 }}
                                             />
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 font-medium">{doctor.FullName}</td>
                                    <td className="py-3 px-4 text-sm font-semibold text-blue-600">
                                        {specialtyMap.get(doctor.SpecialtyID) || 'Chưa xác định'}
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
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                            doctor.Status === 'Active' ? 'bg-green-100 text-green-700' :
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
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doctor.UserID)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                            title="Vô hiệu hóa"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentDoctors.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500">
                                        {doctors.length === 0 ? 'Chưa có bác sĩ nào' : 'Không tìm thấy bác sĩ nào khớp với tiêu chí tìm kiếm/lọc.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Phân trang - ĐÃ SỬA LỖI "ods" */}
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
                        ←
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-blue-600">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        →
                    </button>
                </div>
            </div>

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