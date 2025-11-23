'use client';

import React, { useState } from 'react';

// --- 1. TYPE DEFINITIONS ---
interface Feedback {
    id: number;
    patientName: string;
    targetName: string; // Tên Bác sĩ hoặc Tên Dịch vụ được đánh giá
    targetType: 'Doctor' | 'Service';
    rating: number; // 1 đến 5
    comment: string;
    date: string;
    status: 'visible' | 'hidden'; // Trạng thái kiểm duyệt
    adminReply?: string; // Admin đã trả lời chưa
}

// --- 2. FAKE DATA ---
const initialFeedbacks: Feedback[] = [
    {
        id: 1,
        patientName: "Nguyễn Văn A",
        targetName: "Dr. Lê Thị Bích",
        targetType: "Doctor",
        rating: 5,
        comment: "Bác sĩ rất tận tâm, khám kỹ. Phòng khám sạch sẽ, tôi rất hài lòng!",
        date: "2025-11-20",
        status: "visible"
    },
    {
        id: 2,
        patientName: "Trần Thị C",
        targetName: "Gói khám tổng quát",
        targetType: "Service",
        rating: 2,
        comment: "Chờ đợi quá lâu dù đã đặt lịch trước. Cần cải thiện quy trình tiếp đón.",
        date: "2025-11-21",
        status: "visible"
    },
    {
        id: 3,
        patientName: "User Ẩn Danh",
        targetName: "Dr. Phạm Minh Tuấn",
        targetType: "Doctor",
        rating: 1,
        comment: "Dịch vụ tệ hại, lừa đảo!!! Đừng bao giờ đến đây.", // Comment tiêu cực cần ẩn
        date: "2025-11-19",
        status: "hidden", // Đã bị ẩn
        adminReply: "Chúng tôi rất tiếc về trải nghiệm của bạn. Bộ phận CSKH sẽ liên hệ xử lý."
    },
    {
        id: 4,
        patientName: "Lê Văn D",
        targetName: "Dr. Lê Thị Bích",
        targetType: "Doctor",
        rating: 4,
        comment: "Bác sĩ tốt, nhưng thuốc hơi đắt.",
        date: "2025-11-22",
        status: "visible"
    }
];

// --- 3. HELPER COMPONENTS ---

// Component hiển thị sao vàng
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

// --- 4. MAIN PAGE COMPONENT ---
export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');

    // State cho Modal Trả lời
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [replyText, setReplyText] = useState('');

    // Lọc dữ liệu
    const filteredFeedbacks = feedbacks.filter(fb =>
        filterRating === 'all' ? true : fb.rating === filterRating
    );

    // Xử lý Ẩn/Hiện bình luận
    const toggleVisibility = (id: number) => {
        const updated = feedbacks.map(fb =>
            fb.id === id ? { ...fb, status: fb.status === 'visible' ? 'hidden' as const : 'visible' as const } : fb
        );
        setFeedbacks(updated);
    };

    // Mở modal trả lời
    const openReplyModal = (fb: Feedback) => {
        setSelectedFeedback(fb);
        setReplyText(fb.adminReply || '');
        setReplyModalOpen(true);
    };

    // Lưu trả lời
    const handleSaveReply = () => {
        if (selectedFeedback) {
            const updated = feedbacks.map(fb =>
                fb.id === selectedFeedback.id ? { ...fb, adminReply: replyText } : fb
            );
            setFeedbacks(updated);
            setReplyModalOpen(false);
            alert("Đã gửi phản hồi thành công!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <section className="max-w-7xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">

                {/* HEADER & FILTER */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Đánh Giá & Phản Hồi</h1>
                        <p className="text-sm text-gray-500 mt-1">Xem ý kiến khách hàng và kiểm duyệt nội dung</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Lọc theo sao:</span>
                        <div className="flex gap-1">
                            <button onClick={() => setFilterRating('all')} className={`px-3 py-1 text-sm rounded-full border ${filterRating === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Tất cả</button>
                            <button onClick={() => setFilterRating(5)} className={`px-3 py-1 text-sm rounded-full border ${filterRating === 5 ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 hover:bg-yellow-50'}`}>5★</button>
                            <button onClick={() => setFilterRating(1)} className={`px-3 py-1 text-sm rounded-full border ${filterRating === 1 ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 hover:bg-red-50'}`}>1★</button>
                        </div>
                    </div>
                </div>

                {/* FEEDBACK LIST */}
                <div className="p-6 bg-gray-50/50 space-y-4">
                    {filteredFeedbacks.map((fb) => (
                        <div
                            key={fb.id}
                            className={`bg-white p-5 rounded-lg border shadow-sm transition-all duration-200 
                  ${fb.status === 'hidden' ? 'opacity-60 border-gray-200 bg-gray-100' : 'border-gray-100 hover:shadow-md'}
                `}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">

                                {/* Phần nội dung chính */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <StarRating rating={fb.rating} />
                                        <span className="text-sm font-bold text-gray-800">{fb.rating}.0/5.0</span>
                                        <span className="text-xs text-gray-400">• {fb.date}</span>

                                        {/* Badge trạng thái */}
                                        {fb.status === 'hidden' && (
                                            <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] uppercase font-bold rounded">Đang Ẩn</span>
                                        )}
                                    </div>

                                    <p className="text-gray-800 text-base mb-3 leading-relaxed">
                                        "{fb.comment}"
                                    </p>

                                    {/* Thông tin ngữ cảnh */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            <span>{fb.patientName}</span>
                                        </div>
                                        <span className="text-gray-300">|</span>
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <span className="font-medium">Đánh giá cho:</span>
                                            <span>{fb.targetName}</span>
                                        </div>
                                    </div>

                                    {/* Admin Reply Display */}
                                    {fb.adminReply && (
                                        <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                                            <p className="text-xs font-bold text-blue-800 uppercase mb-1">Phản hồi từ Admin</p>
                                            <p className="text-sm text-gray-700">{fb.adminReply}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Phần nút bấm hành động */}
                                <div className="flex md:flex-col gap-2 min-w-[120px]">
                                    <button
                                        onClick={() => openReplyModal(fb)}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition text-center"
                                    >
                                        {fb.adminReply ? 'Sửa trả lời' : 'Trả lời'}
                                    </button>

                                    <button
                                        onClick={() => toggleVisibility(fb.id)}
                                        className={`flex-1 px-3 py-2 border rounded text-sm font-medium transition text-center
                        ${fb.status === 'visible'
                                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                : 'border-green-200 text-green-600 hover:bg-green-50 bg-white'}
                      `}
                                    >
                                        {fb.status === 'visible' ? 'Ẩn bình luận' : 'Hiện lại'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredFeedbacks.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Không có đánh giá nào phù hợp với bộ lọc.
                        </div>
                    )}
                </div>
            </section>

            {/* --- MODAL TRẢ LỜI --- */}
            {replyModalOpen && selectedFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Phản hồi đánh giá #{selectedFeedback.id}</h3>
                            <button onClick={() => setReplyModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-600 italic">
                                "{selectedFeedback.comment}"
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung trả lời của Admin:</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                placeholder="Nhập nội dung cảm ơn hoặc giải trình..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                            <button onClick={() => setReplyModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 rounded text-sm font-medium transition">Hủy</button>
                            <button onClick={handleSaveReply} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium shadow-sm transition">Gửi Phản Hồi</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}