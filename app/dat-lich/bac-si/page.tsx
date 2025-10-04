"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation";
import { useState } from "react";
import LayoutBook from "@/components/layoutBook";
import Image from "next/image";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// Kiểu dữ liệu bác sĩ
interface Doctor {
    id: number;
    name: string;
    dept: string;
    room: string;
    avatar: string;
    services: { name: string; price: number }[];
    schedule: { date: string; times: string[] }[];
    fee?: number;
    insurance?: string;
}

export default function DoctorBookingPage() {
    const router = useRouter();

    // STATE FORM
    const [selectedPerson, setSelectedPerson] = useState("Tôi - Lê Gia Hưng");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // STATE SHEET
    const [showDoctorSheet, setShowDoctorSheet] = useState(false);
    const [showDoctorDetail, setShowDoctorDetail] = useState<Doctor | null>(null);

    // Tìm kiếm & phân trang
    const [search, setSearch] = useState("");
    const [deptFilter, setDeptFilter] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Dữ liệu giả
    const doctors: Doctor[] = [
        {
            id: 1,
            name: "PGSTS Trần Ngọc Ánh",
            dept: "Tiêu hoá",
            room: "Phòng 205 - Trung tâm Y khoa số 1 Tôn Thất Tùng",
            avatar: "/image/doctors/doctor5.jpg",
            fee: 350000,
            insurance: "Có hỗ trợ BHYT",
            services: [{ name: "Khám Nội [PK1]", price: 350000 }],
            schedule: [
                { date: "2025-09-30", times: ["06:45", "07:00", "07:15"] },
                { date: "2025-10-01", times: ["07:30", "07:45", "08:00"] },
                { date: "2025-10-02", times: ["08:15", "08:30", "09:00"] },
            ],
        },
        {
            id: 2,
            name: "BS. Vũ Mạnh Tiến",
            dept: "Tim mạch",
            room: "Phòng 201",
            avatar: "/image/doctors/doctor4.jpg",
            fee: 300000,
            insurance: "Thanh toán trực tiếp bằng BHYT",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "2025-10-02", times: ["08:00", "09:00", "10:00"] },
                { date: "2025-10-03", times: ["13:00", "14:00", "15:00"] },
            ],
        },
        {
            id: 3,
            name: "BS. Nguyễn Văn D",
            dept: "Tim mạch",
            room: "Phòng 201",
            avatar: "/image/doctors/doctor8.jpg",
            fee: 320000,
            insurance: "Hỗ trợ thanh toán bảo hiểm",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "2025-09-30", times: ["13:00", "14:00"] },
                { date: "2025-10-01", times: ["08:00", "09:00", "10:00"] },
            ],
        },
        {
            id: 4,
            name: "BS. Nguyễn Văn D",
            dept: "Tim mạch",
            room: "Phòng 201",
            avatar: "/image/doctors/doctor10.jpg",
            fee: 320000,
            insurance: "Hỗ trợ thanh toán bảo hiểm",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "2025-09-30", times: ["13:00", "14:00"] },
                { date: "2025-10-01", times: ["08:00", "09:00", "10:00"] },
            ],
        },
        {
            id: 5,
            name: "BS. Nguyễn Văn D",
            dept: "Tim mạch",
            room: "Phòng 201",
            avatar: "/image/doctors/doctor12.jpg",
            fee: 320000,
            insurance: "Hỗ trợ thanh toán bảo hiểm",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "2025-09-30", times: ["13:00", "14:00"] },
                { date: "2025-10-01", times: ["08:00", "09:00", "10:00"] },
            ],
        },
        {
            id: 6,
            name: "BS. Nguyễn Văn D",
            dept: "Tim mạch",
            room: "Phòng 201",
            avatar: "/image/doctors/doctor2.jpg",
            fee: 320000,
            insurance: "Hỗ trợ thanh toán bảo hiểm",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "2025-09-30", times: ["13:00", "14:00"] },
                { date: "2025-10-01", times: ["08:00", "09:00", "10:00"] },
            ],
        },
    ];

    // Lọc
    const filteredDoctors = doctors.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) &&
            (!deptFilter || d.dept.toLowerCase().includes(deptFilter.toLowerCase()))
    ); 

    // Phân trang
    const totalPages = Math.ceil(filteredDoctors.length / pageSize);
    const currentDoctors = filteredDoctors.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // Format ngày
    const weekdayNames = [
        "Chủ nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
    ];
    const formatDateLabel = (dateStr: string) => {
        const d = new Date(dateStr);
        const weekday = weekdayNames[d.getDay()];
        const day = d.getDate().toString().padStart(2, "0");
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        return `${weekday} ${day}/${month}`;
    };

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctor) return alert("Vui lòng chọn bác sĩ!");
        if (!selectedDate || !selectedTime)
            return alert("Vui lòng chọn thời gian khám!");

        console.log({
            patient: selectedPerson,
            doctor: selectedDoctor.name,
            dept: selectedDoctor.dept,
            room: selectedDoctor.room,
            service: selectedDoctor.services[0],
            date: selectedDate,
            time: selectedTime,
            reason,
            file,
        });

        alert("Đặt lịch khám thành công (demo)");
        router.push("/dat-lich");
    };

    return (
        <LayoutBook>
            {/* Form đặt lịch */}
            <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
                <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
                    Đặt lịch khám theo bác sĩ
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Người tới khám */}
                    <div>
                        <label className="block font-semibold mb-2">Người tới khám</label>
                        <select
                            value={selectedPerson}
                            onChange={(e) => setSelectedPerson(e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-green-600"
                        >
                            <option value="Tôi - Lê Gia Hưng">Tôi</option>
                            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                            <option value="Trần Thị B">Trần Thị B</option>
                        </select>
                    </div>

                    {/* Bác sĩ */}
                    <div>
                        <label className="block font-semibold mb-2">Bác sĩ</label>
                        {!selectedDoctor ? (
                            <div
                                onClick={() => setShowDoctorSheet(true)}
                                className="w-full border rounded px-3 py-2 cursor-pointer hover:border-green-600 text-gray-500"
                            >
                                Chọn bác sĩ
                            </div>
                        ) : (
                            <div
                                onClick={() => setShowDoctorSheet(true)}
                                className="w-full border rounded px-3 py-3 cursor-pointer hover:border-green-600"
                            >
                                <div className="font-semibold text-green-700">
                                    {selectedDoctor.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Chuyên khoa: {selectedDoctor.dept}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Phòng khám: {selectedDoctor.room}
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    Dịch vụ: {selectedDoctor.services[0].name} –{" "}
                                    <span className="text-red-600">
                                        {selectedDoctor.services[0].price.toLocaleString()}đ
                                    </span>
                                </div>
                                {selectedDate && selectedTime && (
                                    <div className="text-sm mt-1 text-blue-600">
                                        Thời gian: {formatDateLabel(selectedDate)} – {selectedTime}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Lý do khám */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Lý do khám / Triệu chứng
                        </label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do khám hoặc triệu chứng..."
                            className="w-full focus-visible:ring-green-600"
                        />
                    </div>

                    {/* File */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Tải ảnh hoặc file (PDF, DOCX)
                        </label>
                        <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                File đã chọn: {file.name}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        Xác nhận đặt lịch
                    </Button>
                </form>
            </div>

            {/* Sheet chọn bác sĩ */}
            {showDoctorSheet && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] max-h-[85%] rounded-t-2xl p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn bác sĩ</h2>
                            <button onClick={() => setShowDoctorSheet(false)}>✕</button>
                        </div>

                        {/* Lọc */}
                        <div className="flex justify-center mb-4">
                            <div className="flex gap-2 w-[500px]">
                                <input
                                    type="text"
                                    placeholder="Tìm chuyên khoa..."
                                    value={deptFilter}
                                    onChange={(e) => setDeptFilter(e.target.value)}
                                    className="border rounded px-2 py-1 w-full text-sm"
                                />

                                <input
                                    type="text"
                                    placeholder="Tìm bác sĩ..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border rounded px-2 py-1 w-full text-sm"
                                />
                            </div>
                        </div>

                        {/* Danh sách bác sĩ */}
                        {currentDoctors.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => setShowDoctorDetail(doc)}
                                className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100"
                            >
                                <Image
                                    src={doc.avatar}
                                    alt={doc.name}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-medium">{doc.name}</div>
                                    <div className="text-sm text-gray-600">{doc.dept}</div>
                                    <div className="text-sm">{doc.room}</div>
                                </div>
                            </div>
                        ))}

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage(Math.max(page - 1, 1))}
                                            aria-disabled={page === 1}
                                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <PaginationItem key={p}>
                                            <PaginationLink
                                                isActive={page === p}
                                                onClick={() => setPage(p)}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setPage(Math.min(page + 1, totalPages))}
                                            aria-disabled={page === totalPages}
                                            className={
                                                page === totalPages ? "pointer-events-none opacity-50" : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            )}

            {/* Sheet chi tiết bác sĩ */}
            {showDoctorDetail && (
                <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
                    <div className="bg-white w-[50%] max-h-[90%] rounded-t-2xl p-6 overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-green-700">
                                Lịch bác sĩ
                            </h2>
                            <button onClick={() => setShowDoctorDetail(null)}>✕</button>
                        </div>

                        {/* Info */}
                        <div className="flex gap-4 border-b pb-4 mb-4">
                            <Image
                                src={showDoctorDetail.avatar}
                                alt={showDoctorDetail.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">
                                    {showDoctorDetail.name}
                                </h3>
                                <p className="text-sm text-gray-600">{showDoctorDetail.dept}</p>
                                <p className="text-sm text-gray-600">{showDoctorDetail.room}</p>
                            </div>
                        </div>

                        {/* Chọn ngày */}
                        <h4 className="font-semibold mb-2">Chọn ngày khám</h4>
                        <div className="flex gap-2 overflow-x-auto mb-4">
                            {[...showDoctorDetail.schedule]
                                .sort(
                                    (a, b) =>
                                        new Date(a.date).getTime() - new Date(b.date).getTime()
                                )
                                .map((sch) => (
                                    <button
                                        key={sch.date}
                                        onClick={() => {
                                            setSelectedDate(sch.date);
                                            setSelectedTime("");
                                        }}
                                        className={`px-3 py-2 rounded-lg border min-w-[120px] text-sm text-center ${selectedDate === sch.date
                                            ? "bg-blue-600 text-white"
                                            : "bg-white"
                                            }`}
                                    >
                                        {formatDateLabel(sch.date)}
                                    </button>
                                ))}
                        </div>

                        {/* Chọn giờ */}
                        {selectedDate && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {showDoctorDetail.schedule
                                    .find((s) => s.date === selectedDate)
                                    ?.times.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`border rounded py-2 ${selectedTime === t
                                                ? "bg-green-600 text-white"
                                                : "hover:border-green-500"
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                            </div>
                        )}

                        <div className="border-t pt-4 mt-4 text-sm text-gray-700 space-y-3">
                            <p>
                                <span className="font-semibold">Giá khám:</span>{" "}
                                {showDoctorDetail.fee
                                    ? `${showDoctorDetail.fee.toLocaleString()} VNĐ`
                                    : "Chưa có"}
                            </p>
                            <p>
                                <span className="font-semibold">Bảo hiểm:</span>{" "}
                                {showDoctorDetail.insurance || "Chưa cập nhật"}
                            </p>
                        </div>

                        <button
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => {
                                setSelectedDoctor(showDoctorDetail);
                                setShowDoctorDetail(null);
                                setShowDoctorSheet(false);
                            }}
                            className="w-full bg-green-600 text-white py-2 rounded mt-4 disabled:opacity-50"
                        >
                            Xác nhận chọn
                        </button>
                    </div>
                </div>
            )}
        </LayoutBook>
    );
}
