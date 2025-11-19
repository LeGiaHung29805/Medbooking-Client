"use client";

import React, { useState, useMemo } from 'react';

// ===============================================
// 1. INTERFACE & MOCK DATA
// ===============================================

interface Specialty {
    SpecialtyID: number;
    SpecialtyName: string;
}

interface Service {
    ServiceID: number;
    ServiceName: string;
    Description: string;
    EstimatedDuration: number; // Phút
    Price: number; // Giá tham khảo
    SpecialtyID: number;
    ImageURL?: string; // KHỚP DB: Đã thêm trường Link ảnh
}

interface ServiceFormProps {
    service: Service | null; // Null khi tạo mới
    specialties: Specialty[]; // Danh sách chuyên khoa để chọn
    onClose: () => void;
    onSuccess: (updatedService: Service) => void;
}

// KHAI BÁO CỐ ĐỊNH CHO PHÂN TRANG
const SERVICES_PER_PAGE = 10;

// Dữ liệu giả lập Chuyên khoa (Lấy từ bảng Specialties)
const MOCK_SPECIALTIES: Specialty[] = [
    { SpecialtyID: 1, SpecialtyName: 'Nội Tổng Quát' },
    { SpecialtyID: 2, SpecialtyName: 'Da Liễu' },
    { SpecialtyID: 3, SpecialtyName: 'Tim Mạch' },
    { SpecialtyID: 4, SpecialtyName: 'Răng Hàm Mặt' },
];

// Dữ liệu giả lập Dịch vụ (Lấy từ bảng Services)
const INITIAL_SERVICES: Service[] = [
    { ServiceID: 101, ServiceName: 'Khám tổng quát', Description: 'Kiểm tra sức khỏe cơ bản, đo huyết áp, nhịp tim.', EstimatedDuration: 15, Price: 250000, SpecialtyID: 1, ImageURL: 'https://placehold.co/40x40/007AFF/FFFFFF?text=KT' },
    { ServiceID: 102, ServiceName: 'Tư vấn Da Liễu', Description: 'Tư vấn chuyên sâu về các vấn đề da liễu.', EstimatedDuration: 25, Price: 400000, SpecialtyID: 2, ImageURL: 'https://placehold.co/40x40/FF3B30/FFFFFF?text=DL' },
    { ServiceID: 103, ServiceName: 'Siêu âm tim', Description: 'Dùng sóng siêu âm để kiểm tra cấu trúc tim.', EstimatedDuration: 40, Price: 850000, SpecialtyID: 3, ImageURL: 'https://placehold.co/40x40/34C759/FFFFFF?text=SA' },
    { ServiceID: 104, ServiceName: 'Lấy cao răng', Description: 'Làm sạch vôi răng và đánh bóng.', EstimatedDuration: 30, Price: 300000, SpecialtyID: 4, ImageURL: 'https://placehold.co/40x40/FF9500/FFFFFF?text=CR' },

];

// ===============================================
// 2. MODAL THÊM/SỬA DỊCH VỤ
// ===============================================

const ServiceFormModal: React.FC<ServiceFormProps> = ({ service, specialties, onClose, onSuccess }) => {
    const isEdit = !!service;
    const [formData, setFormData] = useState({
        ServiceName: service?.ServiceName || '',
        Description: service?.Description || '',
        EstimatedDuration: service?.EstimatedDuration.toString() || '15',
        Price: service?.Price.toString() || '0',
        SpecialtyID: service?.SpecialtyID || specialties[0]?.SpecialtyID,
        ImageURL: service?.ImageURL || '', // KHỚP DB: ImageURL
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Chuyển giá trị số sang number trước khi lưu vào state
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'EstimatedDuration' || name === 'Price' || name === 'SpecialtyID') ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedService: Service = {
            ...service,
            ServiceID: service?.ServiceID || Date.now(),
            ServiceName: formData.ServiceName,
            Description: formData.Description,
            EstimatedDuration: parseFloat(formData.EstimatedDuration),
            Price: parseFloat(formData.Price),
            SpecialtyID: parseFloat(formData.SpecialtyID as any),
            ImageURL: formData.ImageURL, // KHỚP DB: ImageURL
        };

        console.log(isEdit ? "Cập nhật dịch vụ:" : "Tạo dịch vụ:", updatedService);
        // Logic gọi API: if (isEdit) ApiClient.adminUpdateService(...) else ApiClient.adminCreateService(...)

        setLoading(false);
        onClose();
        onSuccess(updatedService);
    };

    return (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {isEdit ? 'Sửa Dịch vụ' : 'Thêm Dịch vụ mới'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tên Dịch vụ */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Tên Dịch vụ</label>
                            <input
                                type="text"
                                name="ServiceName"
                                value={formData.ServiceName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Chuyên khoa liên quan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                            <select
                                name="SpecialtyID"
                                value={formData.SpecialtyID}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                {specialties.map(s => (
                                    <option key={s.SpecialtyID} value={s.SpecialtyID}>{s.SpecialtyName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Link Ảnh (ImageURL) - KHỚP DB */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Link Ảnh (ImageURL)</label>
                            <input
                                type="url"
                                name="ImageURL"
                                value={formData.ImageURL}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder='VD: https://placehold.co/60x60'
                            />
                            {formData.ImageURL && (
                                <img
                                    src={formData.ImageURL}
                                    alt="Preview"
                                    className='w-12 h-12 rounded-full object-cover mt-2 border border-gray-200'
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/48x48/FEE2E2/000?text=Loi'; }}
                                />
                            )}
                        </div>

                        {/* Giá */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                            <input
                                type="number"
                                name="Price"
                                value={formData.Price}
                                onChange={handleChange}
                                required
                                min="0"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Thời gian dự kiến */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Thời gian (phút)</label>
                            <input
                                type="number"
                                name="EstimatedDuration"
                                value={formData.EstimatedDuration}
                                onChange={handleChange}
                                required
                                min="5"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Mô tả */}
                        <div className="md:col-span-2">
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

export default function ServiceManagementPage() {
    const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // 1. STATE VÀ LOGIC PHÂN TRANG MỚI
    const [currentPage, setCurrentPage] = useState(1);

    // Ánh xạ SpecialtyID sang tên chuyên khoa để hiển thị trong bảng
    const specialtyMap = useMemo(() => {
        return MOCK_SPECIALTIES.reduce((map, s) => {
            map.set(s.SpecialtyID, s.SpecialtyName);
            return map;
        }, new Map<number, string>());
    }, []);

    // Giả lập hàm tìm kiếm (Filtering)
    const filteredServices = useMemo(() => {
        setCurrentPage(1); // Reset trang khi tìm kiếm
        if (!searchQuery) return services;
        const query = searchQuery.toLowerCase();
        return services.filter(s =>
            s.ServiceName.toLowerCase().includes(query) ||
            s.Description.toLowerCase().includes(query) ||
            specialtyMap.get(s.SpecialtyID)?.toLowerCase().includes(query)
        );
    }, [services, searchQuery, specialtyMap]);

    // 2. TÍNH TOÁN DỮ LIỆU HIỆN TẠI VÀ PHÂN TRANG
    const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);

    const currentServices = useMemo(() => {
        const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
        return filteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);
    }, [filteredServices, currentPage]);


    // Xử lý khi API call thành công (tạo mới/cập nhật)
    const handleSuccess = (updatedService: Service) => {
        setIsModalOpen(false);

        setServices(prevServices => {
            const existingIndex = prevServices.findIndex(s => s.ServiceID === updatedService.ServiceID);

            if (existingIndex > -1) {
                // Cập nhật
                return prevServices.map((s, index) => index === existingIndex ? updatedService : s);
            } else {
                // Tạo mới (thêm vào đầu danh sách)
                return [updatedService, ...prevServices];
            }
        });
    };

    // Xử lý mở modal
    const handleOpenModal = (service: Service | null = null) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    // Xử lý xóa (vô hiệu hóa)
    const handleDelete = (serviceId: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này? Việc này sẽ ảnh hưởng đến các cuộc hẹn đã đặt.")) {
            // Logic gọi API: ApiClient.adminDeleteService(serviceId);
            setServices(prev => prev.filter(s => s.ServiceID !== serviceId));
            console.log(`Đã xóa ServiceID: ${serviceId}`);
        }
    };

    // Render
    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-2">
                💰 Quản lý Dịch vụ & Bảng giá
            </h1>

            {/* Thanh Điều khiển */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <div className="flex flex-wrap items-center justify-between space-y-3 md:space-y-0">

                    {/* Tìm kiếm */}
                    <div className="relative flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên dịch vụ, chuyên khoa..."
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
                        <span>Thêm Dịch vụ</span>
                    </button>
                </div>
            </div>

            {/* Bảng Danh sách Dịch vụ */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên Dịch vụ</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chuyên khoa</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá (VNĐ)</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thời gian (Phút)</th>
                                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* 3. SỬ DỤNG DỮ LIỆU ĐÃ PHÂN TRANG */}
                            {currentServices.map((service) => (
                                <tr key={service.ServiceID} className="hover:bg-gray-50">
                                    {/* Cột Ảnh */}
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <img
                                            src={service.ImageURL || 'https://placehold.co/40x40/E0E0E0/000?text=DV'}
                                            alt={service.ServiceName}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/40x40/E0E0E0/000?text=DV'; }}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">{service.ServiceName}</td>
                                    <td className="py-3 px-4 text-sm text-blue-600">
                                        {specialtyMap.get(service.SpecialtyID) || 'Không rõ'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-green-700 font-bold">
                                        {service.Price.toLocaleString('vi-VN')}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {service.EstimatedDuration} phút
                                    </td>
                                    <td className="py-3 px-4 text-sm flex space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(service)}
                                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                            title="Chỉnh sửa"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.ServiceID)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                            title="Xóa"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentServices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        Không tìm thấy dịch vụ nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. GIAO DIỆN PHÂN TRANG */}
            <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-700">
                    Hiển thị {currentServices.length} trên tổng số {filteredServices.length} dịch vụ
                </span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        &larr; Trang trước
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-blue-600">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                    >
                        Trang sau &rarr;
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ServiceFormModal
                    service={selectedService}
                    specialties={MOCK_SPECIALTIES}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}