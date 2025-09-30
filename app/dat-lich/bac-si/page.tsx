"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import LayoutBook from "@/components/layoutBook";

interface Doctor {
    name: string;
    dept: string;
    room: string;
    services: { name: string; price: number }[];
    schedule: { date: string; times: string[] }[];
}

export default function DoctorBookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const doctorFromQuery = searchParams.get("name") || "";

    // STATE
    const [selectedPerson, setSelectedPerson] = useState("Tôi - Lê Gia Hưng");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // control sheet
    const [showDoctorSheet, setShowDoctorSheet] = useState(false);
    const [showDoctorDetail, setShowDoctorDetail] = useState<Doctor | null>(null);
    const [search, setSearch] = useState("");

    // fake data
    const doctors: Doctor[] = [
        {
            name: "PGSTS Trần Ngọc Ánh",
            dept: "Tiêu hoá",
            room: "Phòng 205 - Trung tâm Y khoa số 1 Tôn Thất Tùng",
            services: [{ name: "Khám Nội [PK1]", price: 350000 }],
            schedule: [
                { date: "02/10", times: ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00"] },
                { date: "03/10", times: ["07:00", "07:30", "08:00", "08:30"] },
            ],
        },
        {
            name: "BS. Nguyễn Văn A",
            dept: "Tim mạch",
            room: "Phòng 201",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "02/10", times: ["08:00", "09:00", "10:00"] },
                { date: "03/10", times: ["13:00", "14:00", "15:00"] },
            ],
        },
        {
            name: "PGSTS Trần Ngọc C",
            dept: "Tiêu hoá",
            room: "Phòng 205 - Trung tâm Y khoa số 1 Tôn Thất Tùng",
            services: [{ name: "Khám Nội [PK1]", price: 350000 }],
            schedule: [
                { date: "02/10", times: ["06:45", "07:00", "07:15", "07:30", "07:45", "08:00"] },
                { date: "03/10", times: ["07:00", "07:30", "08:00", "08:30"] },
            ],
        },
        {
            name: "BS. Nguyễn Văn D",
            dept: "Tim mạch",
            room: "Phòng 204",
            services: [{ name: "Khám tim cơ bản", price: 300000 }],
            schedule: [
                { date: "02/10", times: ["08:00", "09:00", "10:00"] },
                { date: "03/10", times: ["13:00", "14:00", "15:00"] },
            ],
        },
    ];

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    // submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoctor) return alert("Vui lòng chọn bác sĩ!");
        if (!selectedDate || !selectedTime) return alert("Vui lòng chọn thời gian khám!");

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
        router.push("/booking");
    };

    return (
        <LayoutBook>
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
                            <option value="Tôi - Lê Gia Hưng">Tôi - Lê Gia Hưng</option>
                            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                            <option value="Trần Thị B">Trần Thị B</option>
                        </select>
                    </div>

                    {/* Chọn bác sĩ */}
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
                                <div className="font-semibold text-green-700">{selectedDoctor.name}</div>
                                <div className="text-sm text-gray-600">Chuyên khoa: {selectedDoctor.dept}</div>
                                <div className="text-sm text-gray-600">Phòng khám: {selectedDoctor.room}</div>
                                <div className="mt-2 text-sm text-gray-700">
                                    Dịch vụ: {selectedDoctor.services[0].name} –{" "}
                                    <span className="text-red-600">{selectedDoctor.services[0].price.toLocaleString()}đ</span>
                                </div>
                                {selectedDate && selectedTime && (
                                    <div className="text-sm mt-1 text-blue-600">
                                        Thời gian: {selectedDate} – {selectedTime}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Lý do khám */}
                    <div>
                        <label className="block font-semibold mb-2">Lý do khám / Triệu chứng</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Nhập lý do khám hoặc triệu chứng..."
                            className="w-full border rounded px-3 py-2 focus:outline-green-600"
                        />
                    </div>

                    {/* Upload file */}
                    <div>
                        <label className="block font-semibold mb-2">Tải ảnh hoặc file (PDF, DOCX)</label>
                        <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {file && <p className="mt-2 text-sm text-gray-600">File đã chọn: {file.name}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Xác nhận đặt lịch
                    </button>
                </form>
            </div>

            {/* Sheet chọn bác sĩ */}
            {showDoctorSheet && (
                <div className="fixed inset-0 bg-black/40 flex items-end z-50">
                    <div className="bg-white w-full max-h-[80%] rounded-t-2xl p-4 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn bác sĩ</h2>
                            <button onClick={() => setShowDoctorSheet(false)}>✕</button>
                        </div>

                        <input
                            type="text"
                            placeholder="Tìm bác sĩ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />

                        {filteredDoctors.map((doc) => (
                            <div
                                key={doc.name}
                                onClick={() => setShowDoctorDetail(doc)}
                                className="p-3 border-b cursor-pointer hover:bg-gray-100"
                            >
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-sm text-gray-600">{doc.dept}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sheet chi tiết bác sĩ */}
            {showDoctorDetail && (
                <div className="fixed inset-0 bg-black/40 flex items-end z-50">
                    <div className="bg-white w-full max-h-[90%] rounded-t-2xl p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Chọn thời gian khám</h2>
                            <button onClick={() => setShowDoctorDetail(null)}>✕</button>
                        </div>

                        <h3 className="text-xl font-bold">{showDoctorDetail.name}</h3>
                        <p className="text-gray-700">{showDoctorDetail.dept}</p>
                        <p className="mb-3">{showDoctorDetail.room}</p>

                        {/* Chọn ngày */}
                        <div className="flex gap-2 overflow-x-auto mb-4">
                            {showDoctorDetail.schedule.map((sch) => (
                                <button
                                    key={sch.date}
                                    onClick={() => {
                                        setSelectedDate(sch.date);
                                        setSelectedTime("");
                                    }}
                                    className={`px-4 py-2 rounded-lg border min-w-[80px]
                    ${selectedDate === sch.date ? "bg-blue-600 text-white" : "bg-white"}`}
                                >
                                    {sch.date}
                                </button>
                            ))}
                        </div>

                        {/* Chọn giờ */}
                        {selectedDate && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {showDoctorDetail.schedule
                                    .find(s => s.date === selectedDate)
                                    ?.times.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`border rounded py-2 
                        ${selectedTime === t ? "bg-green-600 text-white" : ""}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                            </div>
                        )}

                        <button
                            disabled={!selectedDate || !selectedTime}
                            onClick={() => {
                                setSelectedDoctor(showDoctorDetail);
                                setShowDoctorDetail(null);
                                setShowDoctorSheet(false);
                            }}
                            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
                        >
                            Xác nhận chọn
                        </button>
                    </div>
                </div>
            )}
        </LayoutBook>
    );
}
