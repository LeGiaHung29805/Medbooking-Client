"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import LayoutBook from "@/components/layoutBook";

export default function DoctorBookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Lấy tên bác sĩ từ query nếu có
    const doctorFromQuery = searchParams.get("name") || "";

    const [selectedPerson, setSelectedPerson] = useState("Tôi - Lê Gia Hưng");
    const [selectedDoctor, setSelectedDoctor] = useState(doctorFromQuery);
    const [selectedDept, setSelectedDept] = useState("");
    const [reason, setReason] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Fake data
    const doctorOptions = [
        "BS. Nguyễn Văn A",
        "BS. Trần Thị B",
        "BS. Lê Văn C",
        "BS. Phạm Văn D",
    ];

    const departmentOptions = [
        "Tim mạch",
        "Nhi khoa",
        "Da liễu",
        "Tai - Mũi - Họng",
        "Tiêu hoá",
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Tạm thời chỉ log ra dữ liệu, sau này sẽ gửi lên backend
        console.log({
            patient: selectedPerson,
            doctor: selectedDoctor,
            department: selectedDept,
            reason,
            file,
        });

        alert("Đặt lịch khám thành công (demo)");
        router.push("/booking"); // quay lại trang đặt lịch chính
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

                    {/* Bác sĩ */}
                    <div>
                        <label className="block font-semibold mb-2">Bác sĩ</label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-green-600"
                        >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctorOptions.map((doc) => (
                                <option key={doc} value={doc}>
                                    {doc}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Chuyên khoa */}
                    <div>
                        <label className="block font-semibold mb-2">Chuyên khoa</label>
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-green-600"
                        >
                            <option value="">-- Chọn chuyên khoa --</option>
                            {departmentOptions.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lý do khám */}
                    <div>
                        <label className="block font-semibold mb-2">
                            Lý do khám / Triệu chứng
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            placeholder="Nhập lý do khám hoặc triệu chứng..."
                            className="w-full border rounded px-3 py-2 focus:outline-green-600"
                        />
                    </div>

                    {/* Tải file */}
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

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Xác nhận đặt lịch
                    </button>
                </form>
            </div>
        </LayoutBook>
    );
}
