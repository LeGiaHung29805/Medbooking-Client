"use client";

import { useState } from "react";
import { UserRound, Search, ClipboardX, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutUsers from "@/components/layoutUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Result {
  id: number;
  member: "me" | "mom" | "dad";
  doctor: string;
  specialty: string;
  date: string;
  diagnosis: string;
  severity: "Nhẹ" | "Trung bình" | "Nghiêm trọng";
  note?: string;
}

export default function KetQuaKhamBenh() {
  const [selectedMember, setSelectedMember] = useState("me");
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  // Demo data có phân theo thành viên
  const [results] = useState<Result[]>([
    {
      id: 1,
      member: "me",
      doctor: "BS. Nguyễn Văn A",
      specialty: "Nội khoa",
      date: "2025-09-28",
      diagnosis: "Viêm họng cấp",
      severity: "Nhẹ",
      note: "Uống thuốc 7 ngày, tái khám nếu không đỡ.",
    },
    {
      id: 2,
      member: "me",
      doctor: "BS. Trần Thị B",
      specialty: "Da liễu",
      date: "2025-09-15",
      diagnosis: "Viêm da dị ứng",
      severity: "Trung bình",
    },
    {
      id: 3,
      member: "mom",
      doctor: "BS. Lê Văn C",
      specialty: "Tim mạch",
      date: "2025-09-10",
      diagnosis: "Huyết áp cao",
      severity: "Nghiêm trọng",
      note: "Theo dõi huyết áp hàng ngày.",
    },
  ]);

  // Lọc theo thành viên
  const filteredResults = results.filter((r) => r.member === selectedMember);

  const getSeverityColor = (s: Result["severity"]) => {
    switch (s) {
      case "Nhẹ":
        return "bg-green-100 text-green-700";
      case "Trung bình":
        return "bg-yellow-100 text-yellow-700";
      case "Nghiêm trọng":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <LayoutUsers>
      <div className="p-6">
        {/* Tiêu đề */}
        <h1 className="text-xl font-semibold text-green-700 mb-2">
          Kết quả khám bệnh
        </h1>
        <p className="text-gray-600 mb-6">
          Xem chi tiết lịch sử điều trị, kết quả khám bệnh và thông tin chẩn
          đoán cho từng thành viên.
        </p>

        {/* Chọn thành viên */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-6 bg-white border p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-green-700 font-medium">
            <UserRound className="w-5 h-5" />
            Chọn thành viên
          </div>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Chọn thành viên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">Tôi - Lê Gia Hưng</SelectItem>
              <SelectItem value="mom">Mẹ - Trần Thị C</SelectItem>
              <SelectItem value="dad">Bố - Lê Văn D</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-green-700 border-green-600"
          >
            <Search className="w-4 h-4" />
            Xem lịch sử
          </Button>
        </div>

        {/* Kết quả khám */}
        {filteredResults.length === 0 ? (
          <div className="bg-white border rounded-lg shadow-sm p-10 flex flex-col items-center justify-center min-h-[250px]">
            <ClipboardX className="w-12 h-12 text-gray-400 mb-3" />
            <p className="font-medium mb-1">Chưa có lịch sử điều trị</p>
            <p className="text-gray-500">
              Thành viên này chưa có kết quả khám bệnh nào.
            </p>
          </div>
        ) : (
          <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700">
                  <th className="py-3 px-4">Bác sĩ</th>
                  <th className="py-3 px-4">Chuyên khoa</th>
                  <th className="py-3 px-4">Ngày khám</th>
                  <th className="py-3 px-4">Chẩn đoán</th>
                  <th className="py-3 px-4">Mức độ</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{r.doctor}</td>
                    <td className="py-3 px-4">{r.specialty}</td>
                    <td className="py-3 px-4">{r.date}</td>
                    <td className="py-3 px-4">{r.diagnosis}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(
                          r.severity
                        )}`}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setSelectedResult(r)}
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal xem chi tiết */}
        <Dialog
          open={!!selectedResult}
          onOpenChange={() => setSelectedResult(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-green-700">
                Chi tiết kết quả khám
              </DialogTitle>
            </DialogHeader>
            {selectedResult && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Bác sĩ:</span>
                  <span>{selectedResult.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Chuyên khoa:</span>
                  <span>{selectedResult.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày khám:</span>
                  <span>{selectedResult.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Chẩn đoán:</span>
                  <span>{selectedResult.diagnosis}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Mức độ:</span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(
                      selectedResult.severity
                    )}`}
                  >
                    {selectedResult.severity}
                  </span>
                </div>
                {selectedResult.note && (
                  <p className="bg-gray-50 p-3 rounded-md text-gray-700">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {selectedResult.note}
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayoutUsers>
  );
}
