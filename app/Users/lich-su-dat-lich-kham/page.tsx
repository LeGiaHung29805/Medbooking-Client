"use client";

import { useState } from "react";
import { CalendarX2, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutUsers from "@/components/layoutUsers";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  status: "Đã xác nhận" | "Đang chờ" | "Đã hủy";
  note?: string;
}

export default function LichSuDatLich() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctor: "BS. Nguyễn Văn A",
      specialty: "Nội khoa",
      date: "2025-10-05 14:00",
      status: "Đã xác nhận",
      note: "Mang theo kết quả xét nghiệm cũ.",
    },
    {
      id: 2,
      doctor: "BS. Trần Thị B",
      specialty: "Da liễu",
      date: "2025-10-07 09:30",
      status: "Đang chờ",
    },
  ]);

  const [selected, setSelected] = useState<Appointment | null>(null);

  // Hàm hủy lịch
  const cancelAppointment = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Đã hủy" } : a))
    );
  };

  return (
    <LayoutUsers>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-green-700 mb-2">
          Lịch sử đặt lịch khám bệnh
        </h1>
        <p className="text-gray-600 mb-6">
          Xem chi tiết các lịch hẹn khám bệnh đã đặt, thông tin chuyên khoa, bác
          sĩ và trạng thái đặt lịch.
        </p>

        {appointments.length === 0 ? (
          <div className="bg-white border rounded-lg shadow-sm p-10 flex flex-col items-center justify-center min-h-[250px]">
            <CalendarX2 className="w-12 h-12 text-gray-400 mb-3" />
            <p className="font-medium mb-1">Chưa có lịch sử đặt lịch</p>
            <p className="text-gray-500">Bạn chưa có lịch hẹn khám bệnh nào.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-lg shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4">Bác sĩ</th>
                  <th className="py-3 px-4">Chuyên khoa</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{a.doctor}</td>
                    <td className="py-3 px-4">{a.specialty}</td>
                    <td className="py-3 px-4">{a.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-sm ${
                          a.status === "Đã xác nhận"
                            ? "bg-green-100 text-green-700"
                            : a.status === "Đang chờ"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-3 justify-center">
                      {/* Nút xem chi tiết */}
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setSelected(a)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Nút hủy có popup xác nhận */}
                      {a.status !== "Đã hủy" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="rounded-full hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Xác nhận hủy lịch
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn hủy lịch hẹn này không?
                                Thao tác này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Quay lại</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => cancelAppointment(a.id)}
                              >
                                Xác nhận hủy
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal xem chi tiết */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Bác sĩ:</span> {selected.doctor}
                </p>
                <p>
                  <span className="font-medium">Chuyên khoa:</span>{" "}
                  {selected.specialty}
                </p>
                <p>
                  <span className="font-medium">Thời gian:</span>{" "}
                  {selected.date}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  {selected.status}
                </p>
                {selected.note && (
                  <p>
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {selected.note}
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
