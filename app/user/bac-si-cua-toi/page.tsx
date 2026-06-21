"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Stethoscope, CalendarPlus, Search, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutUsers from "@/components/layoutUsers";
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";
import DataThumbnail from "@/components/thumnail/DataThumbnail";

export default function MyDoctorsPage() {
    const [doctors, setDoctors] = useState<Model.Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await Api.getMyDoctors();
                setDoctors(data);
            } catch (error) {
                console.error("Lỗi tải danh sách bác sĩ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredDoctors = useMemo(() => {
        return doctors.filter((doc) => {
            const name = doc.user?.FullName?.toLowerCase() || "";
            const spec = doc.specialty?.SpecialtyName?.toLowerCase() || "";
            const query = search.toLowerCase();
            return name.includes(query) || spec.includes(query);
        });
    }, [doctors, search]);

    return (
        <LayoutUsers>
            <div className="p-6 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                            <UserCheck className="w-7 h-7" /> Bác sĩ của tôi
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Danh sách các bác sĩ đã từng thăm khám và điều trị cho bạn.
                        </p>
                    </div>

                    {/* Ô tìm kiếm */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc chuyên khoa..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-green-600 bg-white shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                </div>

                {/* --- DANH SÁCH BÁC SĨ --- */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                    </div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="bg-white border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
                        <div className="bg-green-50 p-4 rounded-full mb-4">
                            <Stethoscope className="w-12 h-12 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Chưa có bác sĩ nào</h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                            Bạn chưa hoàn thành lịch khám nào. Hãy đặt lịch khám ngay để được chăm sóc sức khỏe bởi đội ngũ chuyên gia.
                        </p>
                        <Link href="/dat-lich">
                            <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
                                Đặt lịch khám ngay
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc.DoctorID}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden flex flex-col"
                            >
                                <div className="p-6 flex items-start gap-4 border-b border-gray-50 flex-1">
                                    {/* Avatar */}
                                    <div className="w-20 h-20 flex-shrink-0">
                                        <DataThumbnail
                                            src={doc.imageURL || doc.user?.avatar_url}
                                            alt={doc.user?.FullName}
                                            fallbackType="doctor"
                                            className="w-full h-full rounded-full border-2 border-green-50"
                                        />
                                    </div>

                                    {/* Thông tin */}
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                            {doc.user?.FullName}
                                        </h3>
                                        <div className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded mt-1 font-medium">
                                            {doc.specialty?.SpecialtyName}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                            <span className="font-semibold text-gray-700">{doc.Degree}</span>
                                            <span>•</span>
                                            <span>{doc.YearsOfExperience} năm KN</span>
                                        </div>
                                    </div>
                                </div>

                                {/*Nút hành động */}
                                <div className="p-4 bg-gray-50 flex gap-3">
                                    <Link href={`/dat-lich/bac-si?doctor_id=${doc.DoctorID}`} className="w-full">
                                        <Button className="w-full bg-white border border-green-600 text-green-700 hover:bg-green-50 font-semibold shadow-sm">
                                            <CalendarPlus className="w-4 h-4 mr-2" />
                                            Đặt lại lịch
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </LayoutUsers>
    );
}