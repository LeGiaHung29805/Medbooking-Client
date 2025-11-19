"use client";

import React, { useState, useMemo } from 'react';

// ===============================================
// 1. INTERFACE & MOCK DATA
// ===============================================

// KHỚP DB: SpecialtyID, SpecialtyName, Description, ImageURL
interface Specialty {
    SpecialtyID: number;
    SpecialtyName: string;
    Description: string;
    ImageURL?: string; // KHỚP DB: Thêm Link ảnh
}

interface SpecialtyFormProps {
    specialty: Specialty | null; // Null khi tạo mới
    onClose: () => void;
    onSuccess: (updatedSpecialty: Specialty) => void;
}

// Dữ liệu giả lập (Đã thêm ImageURL)
const INITIAL_SPECIALTIES: Specialty[] = [
    { SpecialtyID: 1, SpecialtyName: 'Nội Tổng Quát', Description: 'Khám và điều trị các bệnh lý nội khoa thông thường.', ImageURL: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=NTQ' },
    { SpecialtyID: 2, SpecialtyName: 'Da Liễu', Description: 'Chẩn đoán và điều trị các bệnh về da, tóc, móng và thẩm mỹ da.', ImageURL: 'https://placehold.co/40x40/FF3B30/FFFFFF?text=DL' },
    { SpecialtyID: 3, SpecialtyName: 'Tim Mạch', Description: 'Chẩn đoán, điều trị và phòng ngừa các bệnh tim và mạch máu.', ImageURL: 'https://placehold.co/40x40/007AFF/FFFFFF?text=TM' },
    { SpecialtyID: 4, SpecialtyName: 'Răng Hàm Mặt', Description: 'Khám, chữa các bệnh về răng, miệng, hàm và vùng mặt.', ImageURL: 'https://placehold.co/40x40/FF9500/FFFFFF?text=RHM' },
    { SpecialtyID: 5, SpecialtyName: 'Sản Phụ Khoa', Description: 'Chăm sóc sức khỏe phụ nữ, thai sản và sinh sản.', ImageURL: 'https://placehold.co/40x40/5856D6/FFFFFF?text=SPK' },
    { SpecialtyID: 6, SpecialtyName: 'Nhi Khoa', Description: 'Chăm sóc sức khỏe trẻ em và thanh thiếu niên.', ImageURL: 'https://placehold.co/40x40/A2845E/FFFFFF?text=NK' },
];

// ===============================================
// 2. MODAL THÊM/SỬA CHUYÊN KHOA (ĐÃ GỘP VÀO)
// ===============================================

const SpecialtyFormModal: React.FC<SpecialtyFormProps> = ({ specialty, onClose, onSuccess }) => {
    const isEdit = !!specialty;
    const [formData, setFormData] = useState({
        SpecialtyName: specialty?.SpecialtyName || '',
        Description: specialty?.Description || '',
        ImageURL: specialty?.ImageURL || '', // KHỚP DB: ImageURL
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call (thay thế cho việc gọi ApiClient)
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedSpecialty: Specialty = {
            ...specialty,
            SpecialtyID: specialty?.SpecialtyID || Date.now(), // Tạo ID mới nếu là tạo mới
            SpecialtyName: formData.SpecialtyName,
            Description: formData.Description,
            ImageURL: formData.ImageURL, // LƯU DB
        };

        console.log(isEdit ? "Cập nhật chuyên khoa:" : "Tạo chuyên khoa:", updatedSpecialty);
        // Logic gọi API: if (isEdit) ApiClient.adminUpdateSpecialty(...) else ApiClient.adminCreateSpecialty(...)

        setLoading(false);
        onClose();
        onSuccess(updatedSpecialty); // Truyền dữ liệu mới về component cha
    };

    return (
        // Modal Backdrop: Sử dụng opacity thấp để nhìn thấy nội dung phía sau
        <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Sửa Chuyên khoa' : 'Thêm Chuyên khoa mới'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Tên Chuyên khoa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên Chuyên khoa</label>
                            <input
                                type="text"
                                name="SpecialtyName"
                                value={formData.SpecialtyName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Link Ảnh (ImageURL) - KHỚP DB */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link Ảnh Minh Họa (ImageURL)</label>
                            <input
                                type="url"
                                name="ImageURL"
                                value={formData.ImageURL}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder='VD: https://placehold.co/40x40/007AFF/FFFFFF?text=ICON'
                            />
                            {formData.ImageURL && (
                                <img
                                    src={formData.ImageURL}
                                    alt="Preview"
                                    className='w-12 h-12 rounded-full object-cover mt-2 border border-gray-200'
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/40x40/FEE2E2/000?text=Loi'; }}
                                />
                            )}
                        </div>

                        {/* Mô tả */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea
                                name="Description"
                                value={formData.Description}
                                onChange={handleChange}
                                rows={3}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

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
                                    <span className="mr-2">💾</span> {isEdit ? 'Cập nhật' : 'Thêm mới'}
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

export default function SpecialtyManagementPage() {
    const [specialties, setSpecialties] = useState<Specialty[]>(INITIAL_SPECIALTIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

    // Giả lập hàm tìm kiếm
    const filteredSpecialties = useMemo(() => {
        if (!searchQuery) return specialties;
        const query = searchQuery.toLowerCase();
        return specialties.filter(s =>
            s.SpecialtyName.toLowerCase().includes(query) ||
            s.Description.toLowerCase().includes(query)
        );
    }, [specialties, searchQuery]);

    // Xử lý khi API call thành công (tạo mới/cập nhật)
    const handleSuccess = (updatedSpecialty: Specialty) => {
        setIsModalOpen(false);

        setSpecialties(prevSpecialties => {
            const existingIndex = prevSpecialties.findIndex(s => s.SpecialtyID === updatedSpecialty.SpecialtyID);

            if (existingIndex > -1) {
                // Cập nhật
                return prevSpecialties.map((s, index) => index === existingIndex ? updatedSpecialty : s);
            } else {
                // Tạo mới (thêm vào đầu danh sách)
                return [updatedSpecialty, ...prevSpecialties];
            }
        });
    };

    // Xử lý mở modal
    const handleOpenModal = (specialty: Specialty | null = null) => {
        setSelectedSpecialty(specialty);
        setIsModalOpen(true);
    };

    // Xử lý xóa (vô hiệu hóa)
    const handleDelete = (specialtyId: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa chuyên khoa này? Việc này sẽ ảnh hưởng đến các bác sĩ và dịch vụ liên quan.")) {
            // Logic gọi API: ApiClient.adminDeleteSpecialty(specialtyId);
            setSpecialties(prev => prev.filter(s => s.SpecialtyID !== specialtyId));
            console.log(`Đã xóa SpecialtyID: ${specialtyId}`);
        }
    };

    // Render
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
                        ➕
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
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">ID</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">Ảnh</th> {/* KHỚP DB: Cột Ảnh */}
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">Tên Chuyên khoa</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-auto">Mô tả</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSpecialties.map((specialty) => (
                                <tr key={specialty.SpecialtyID} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-700 font-semibold">{specialty.SpecialtyID}</td>
                                    {/* Cột Ảnh */}
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <img
                                            src={specialty.ImageURL || 'https://placehold.co/40x40/E0E0E0/000?text=CK'}
                                            alt={specialty.SpecialtyName}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/40x40/E0E0E0/000?text=CK'; }}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{specialty.SpecialtyName}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{specialty.Description}</td>
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
                            ))}
                            {filteredSpecialties.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        Không tìm thấy chuyên khoa nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Đã gộp vào file này */}
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