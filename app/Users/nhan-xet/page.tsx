"use client";

import React, { useState, useEffect } from "react";
import LayoutUsers from "@/components/layoutUsers";
import { Star, Send, MessageSquare, UserCheck, MonitorSmartphone } from "lucide-react";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";
import DataThumbnail from "@/components/thumnail/DataThumbnail";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AxiosError } from 'axios';
const StarRatingInput = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                >
                    <Star className="w-8 h-8 fill-current" />
                </button>
            ))}
        </div>
    );
};

export default function FeedbackPage() {
    const [activeTab, setActiveTab] = useState<'doctor' | 'system'>('doctor');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data cho Tab Bác sĩ
    const [appointments, setAppointments] = useState<Model.Appointment[]>([]);

    // Form đánh giá chung
    const [selectedAppt, setSelectedAppt] = useState<Model.Appointment | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {
            // Lấy danh sách lịch hẹn của tôi
            const allAppts = await Api.getMyAppointments();

            // Lọc ra các lịch:
            // Đã hoàn thành (Completed)
            const completedAppts = allAppts.filter(app => app.Status === 'Completed');

            setAppointments(completedAppts);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'doctor') {
            loadData();
        }
    }, [activeTab]);

    //Xử lý gửi đánh giá
    const handleSubmit = async () => {
        if (!comment.trim()) return alert("Vui lòng nhập nội dung góp ý.");
        setSubmitting(true);

        try {
            if (activeTab === 'doctor') {
                if (!selectedAppt) return alert("Vui lòng chọn lịch khám để đánh giá.");

                // Gọi API gửi đánh giá Bác sĩ (kèm AppointmentID)
                await Api.submitFeedback({
                    AppointmentID: selectedAppt.AppointmentID,
                    TargetType: 'Doctor',
                    Rating: rating,
                    Comment: comment
                });

            } else {
                // Gọi API gửi đánh giá Hệ thống (Không cần AppointmentID)
                await Api.submitFeedback({
                    TargetType: 'System',
                    Rating: rating,
                    Comment: comment
                });
            }

            alert("✅ Cảm ơn bạn đã gửi đánh giá!");

            // Reset form
            setComment("");
            setRating(5);
            setSelectedAppt(null);

            // Reload nếu ở tab bác sĩ
            if (activeTab === 'doctor') loadData();

        } catch (error: unknown) {
            console.error(error);

            let msg = "Lỗi hệ thống"; // Giá trị mặc định

            if (error instanceof AxiosError) {
                msg = error.response?.data?.message || msg;
            }

            else if (error instanceof Error) {
                msg = error.message;
            }
            if (msg.toLowerCase().includes("đã đánh giá")) {
                alert("Bạn đã đánh giá lượt khám này rồi.");
            } else {
                alert("Gửi thất bại: " + msg);
            }

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <LayoutUsers>
            <div className="p-6 min-h-screen bg-gray-50">
                <h1 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                    <MessageSquare className="w-7 h-7" /> Góp ý & Đánh giá
                </h1>

                {/* TABS NAVIGATION */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => { setActiveTab('doctor'); setSelectedAppt(null); }}
                        className={`pb-3 px-4 font-medium flex items-center gap-2 transition-all border-b-2 ${activeTab === 'doctor'
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <UserCheck className="w-5 h-5" /> Góp ý Bác sĩ
                    </button>
                    <button
                        onClick={() => { setActiveTab('system'); setSelectedAppt(null); }}
                        className={`pb-3 px-4 font-medium flex items-center gap-2 transition-all border-b-2 ${activeTab === 'system'
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MonitorSmartphone className="w-5 h-5" /> Góp ý Hệ thống
                    </button>
                </div>

                <div className="max-w-3xl mx-auto">

                    {/* === TAB 1: ĐÁNH GIÁ BÁC SĨ === */}
                    {activeTab === 'doctor' && (
                        <div className="space-y-6 animate-in fade-in">
                            <p className="text-gray-600">Chọn một lượt khám gần đây để gửi đánh giá về Bác sĩ:</p>

                            {/* Danh sách lịch sử khám để chọn */}
                            {loading ? (
                                <div className="text-center py-8">Đang tải danh sách...</div>
                            ) : appointments.length === 0 ? (
                                <div className="bg-white p-8 text-center rounded-lg border border-dashed">
                                    <p className="text-gray-500">Bạn chưa có lượt khám nào hoàn thành để đánh giá.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {appointments.map(app => (
                                        <div
                                            key={app.AppointmentID}
                                            onClick={() => setSelectedAppt(app)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4
                                        ${selectedAppt?.AppointmentID === app.AppointmentID
                                                    ? 'border-green-500 bg-green-50 ring-1 ring-green-500'
                                                    : 'border-gray-200 bg-white hover:border-green-300'}
                                    `}
                                        >
                                            <div className="w-14 h-14 flex-shrink-0">
                                                <DataThumbnail
                                                    src={app.doctor?.imageURL || app.doctor?.user?.avatar_url}
                                                    alt="Doctor"
                                                    fallbackType="doctor"
                                                    className="w-full h-full rounded-full"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{app.doctor?.user?.FullName}</h3>
                                                <p className="text-xs text-gray-500">{new Date(app.StartTime).toLocaleDateString('vi-VN')}</p>
                                                <p className="text-xs text-blue-600 font-medium">{app.service?.ServiceName}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Form nhập đánh giá (Chỉ hiện khi đã chọn bác sĩ) */}
                            {selectedAppt && (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6 animate-in slide-in-from-bottom-2">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">
                                        Đánh giá cho BS. {selectedAppt.doctor?.user?.FullName}
                                    </h3>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ hài lòng</label>
                                        <StarRatingInput rating={rating} setRating={setRating} />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung góp ý</label>
                                        <Textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Bác sĩ khám thế nào? Có tận tâm không?..."
                                            className="min-h-[120px] focus-visible:ring-green-500"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {submitting ? "Đang gửi..." : "Gửi đánh giá"} <Send className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/*ĐÁNH GIÁ HỆ THỐNG*/}
                    {activeTab === 'system' && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 animate-in fade-in">
                            <div className="text-center mb-6">
                                <MonitorSmartphone className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                                <h2 className="text-xl font-bold text-gray-800">Trải nghiệm sử dụng Website</h2>
                                <p className="text-gray-500 mt-2">
                                    Ý kiến của bạn giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn mỗi ngày.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col items-center">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bạn đánh giá trải nghiệm thế nào?</label>
                                    <StarRatingInput rating={rating} setRating={setRating} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Góp ý chi tiết (Về tính năng, giao diện, tốc độ...)</label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Ví dụ: Giao diện dễ dùng, nhưng load hơi chậm..."
                                        className="min-h-[150px] focus-visible:ring-green-500"
                                    />
                                </div>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {submitting ? "Đang gửi..." : "Gửi góp ý hệ thống"} <Send className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </LayoutUsers>
    );
}