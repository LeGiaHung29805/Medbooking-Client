"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

// Kiểu dữ liệu chuyên khoa + dịch vụ
interface Specialty {
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

interface ServiceSelection {
    name: string;
    price: number;
    specialtyName: string;
    avatar: string;
    schedule: { date: string; times: string[] }[];
    fee?: number;
    insurance?: string;
}

export default function ServiceBookingPage() {
    const router = useRouter();

    const [selectedPerson, setSelectedPerson] = useState("Tôi - Lê Gia Hưng");
    const [selectedService, setSelectedService] = useState<ServiceSelection | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const [showServiceSheet, setShowServiceSheet] = useState(false);
    const [showServiceDetail, setShowServiceDetail] = useState<ServiceSelection | null>(null);

    // Tìm kiếm & phân trang
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // Dữ liệu giả
    const specialties: Specialty[] = [
        {
            id: 1,
            name: "Tim mạch",
            dept: "Khám và điều trị các bệnh lý tim mạch.",
            room: "Phòng 205 - Trung tâm Y khoa số 1 Tôn Thất Tùng",
            avatar: "/image/tim_mach.jpg",
            fee: 350000,
            insurance: "Có hỗ trợ BHYT",
            services: [{ name: "Khám Tim mạch", price: 350000 }],
            schedule: [
                { date: "2025-09-30", times: ["06:45", "07:00", "07:15"] },
                { date: "2025-10-01", times: ["07:30", "07:45", "08:00"] },
            ],
        },
        {
            id: 2,
            name: "Tiêu hoá",
            dept: "Khám và điều trị các bệnh lý tiêu hoá.",
            room: "Phòng 201",
            avatar: "/image/tieu_hoa.jpg",
            fee: 300000,
            insurance: "Thanh toán trực tiếp bằng BHYT",
            services: [{ name: "Khám tiêu hoá cơ bản", price: 300000 }],
            schedule: [
                { date: "2025-10-02", times: ["08:00", "09:00", "10:00"] },
                { date: "2025-10-03", times: ["13:00", "14:00", "15:00"] },
            ],
        },
        // Thêm dữ liệu tương tự...
    ];

    // Lọc
    const filteredSpecialties = specialties.filter(
        (s) => s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.services.some((srv) => srv.name.toLowerCase().includes(search.toLowerCase()))
    );

    // Phân trang
    const totalPages = Math.ceil(filteredSpecialties.length / pageSize);
    const currentSpecialties = filteredSpecialties.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    // Format ngày
    const weekdayNames = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
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
        if (!selectedService) return alert("Vui lòng chọn dịch vụ!");
        if (!selectedDate || !selectedTime)
            return alert("Vui lòng chọn thời gian khám!");

        console.log({
            patient: selectedPerson,
            service: selectedService.name,
            specialty: selectedService.specialtyName,
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
                    Đặt lịch khám theo dịch vụ
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
                            <option value="Tôi - Lê Gia Hưng">Tôi - Lê Gia Hưng</option>
                            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                            <option value="Trần Thị B">Trần Thị B</option>
                        </select>
                    </div>

                    {/* Dịch vụ */}
                    <div>
                        <label className="block font-semibold mb-2">Dịch vụ</label>
                        {!selectedService ? (
                            <div
                                onClick={() => setShowServiceSheet(true)}
                                className="w-full border rounded px-3 py-2 cursor-pointer hover:border-green-600 text-gray-500"
                            >
                                Chọn dịch vụ
                            </div>
                        ) : (
                            <div
                                onClick={() => setShowServiceSheet(true)}
                                className="w-full border rounded px-3 py-3 cursor-pointer hover:border-green-600"
                            >
                                <div className="font-semibold text-green-700">
                                    {selectedService.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Chuyên khoa: {selectedService.specialtyName}
                                </div>
                                {selectedDate && selectedTime && (
                                    <div className="text-sm mt-1 text-blue-600">
                                        Thời gian: {formatDateLabel(selectedDate)} – {selectedTime}
                                    </div>
                                )}
                                <div className="text-sm text-red-600 mt-1">
                                    Giá: {selectedService.price.toLocaleString()}đ
                                </div>
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

            {/* Sheet chọn dịch vụ */}
            {showServiceSheet && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] max-h-[85%] rounded-t-2xl p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn dịch vụ</h2>
                            <button onClick={() => setShowServiceSheet(false)}>✕</button>
                        </div>

                        {/* Lọc */}
                        <div className="flex justify-center mb-4">
                            <input
                                type="text"
                                placeholder="Tìm dịch vụ..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border rounded px-2 py-1 w-[500px] text-sm"
                            />
                        </div>

                        {/* Danh sách dịch vụ */}
                        {currentSpecialties.map((spec) =>
                            spec.services.map((srv, idx) => (
                                <div
                                    key={`${spec.id}-${idx}`}
                                    onClick={() => setShowServiceDetail({
                                        ...srv,
                                        specialtyName: spec.name,
                                        avatar: spec.avatar,
                                        schedule: spec.schedule,
                                        fee: spec.fee,
                                        insurance: spec.insurance,
                                    })}
                                    className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-100"
                                >
                                    <Image
                                        src={spec.avatar}
                                        alt={srv.name}
                                        width={60}
                                        height={60}
                                        className="rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="font-medium">{srv.name}</div>
                                        <div className="text-sm text-gray-600">Chuyên khoa: {spec.name}</div>
                                        <div className="text-sm text-red-600">{srv.price.toLocaleString()} VNĐ</div>
                                    </div>
                                </div>
                            ))
                        )}

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

            {/* Sheet chi tiết dịch vụ */}
            {showServiceDetail && (
                <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
                    <div className="bg-white w-[50%] max-h-[90%] rounded-t-2xl p-6 overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-green-700">
                                Lịch dịch vụ
                            </h2>
                            <button onClick={() => setShowServiceDetail(null)}>✕</button>
                        </div>

                        {/* Info */}
                        <div className="flex gap-4 border-b pb-4 mb-4">
                            <Image
                                src={showServiceDetail.avatar}
                                alt={showServiceDetail.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700">
                                    {showServiceDetail.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Chuyên khoa: {showServiceDetail.specialtyName}
                                </p>
                                <p className="text-sm text-red-600">
                                    Giá: {showServiceDetail.price.toLocaleString()} VNĐ
                                </p>
                            </div>
                        </div>

                        {/* Chọn ngày */}
                        <h4 className="font-semibold mb-2">Chọn ngày khám</h4>
                        <div className="flex gap-2 overflow-x-auto mb-4">
                            {showServiceDetail.schedule
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
                                {showServiceDetail.schedule
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
                                {showServiceDetail.fee
                                    ? `${showServiceDetail.fee.toLocaleString()} VNĐ`
                                    : "Chưa có"}
                            </p>
                            <p>
                                <span className="font-semibold">Bảo hiểm:</span>{" "}
                                {showServiceDetail.insurance || "Chưa cập nhật"}
                            </p>
                        </div>

                        <button
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => {
                                setSelectedService(showServiceDetail);
                                setShowServiceDetail(null);
                                setShowServiceSheet(false);
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
