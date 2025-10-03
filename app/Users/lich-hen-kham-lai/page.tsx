"use client";

import { useState, Fragment } from "react"; // 👈 thêm Fragment
import { CalendarPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutUsers from "@/components/layoutUsers";
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

export default function LichHenKhamLai() {
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

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formNote, setFormNote] = useState("");

  // Hủy lịch
  const cancelAppointment = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Đã hủy" } : a))
    );
  };

  // Đặt lịch tái khám
  const bookReExam = (base: Appointment) => {
    if (!formDate || !formTime) return;

    const newId = appointments.length + 1;
    const newAppointment: Appointment = {
      ...base,
      id: newId,
      date: `${formDate} ${formTime}`,
      status: "Đang chờ",
      note: formNote || `Tái khám từ lịch hẹn #${base.id}`,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setExpandedId(null);
    setFormDate("");
    setFormTime("");
    setFormNote("");
  };

  return (
    <LayoutUsers>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-green-700 mb-2">
          Lịch hẹn khám lại
        </h1>
        <p className="text-gray-600 mb-6">
          Dựa trên lịch sử đặt lịch trước đó, bạn có thể xem chi tiết, hủy hoặc
          đặt lịch tái khám dễ dàng.
        </p>

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
                <Fragment key={a.id}>
                  <tr className="border-b hover:bg-gray-50">
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
                      {/* Đặt tái khám */}
                      {a.status !== "Đã hủy" && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full hover:bg-green-50 hover:text-green-600"
                          onClick={() =>
                            setExpandedId(expandedId === a.id ? null : a.id)
                          }
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Hủy */}
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

                  {/* Form đặt lịch tái khám */}
                  {expandedId === a.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan={5} className="p-4">
                        <div className="p-4 border rounded-md bg-white space-y-3">
                          <p>
                            <span className="font-medium">Bác sĩ:</span>{" "}
                            {a.doctor}
                          </p>
                          <p>
                            <span className="font-medium">Chuyên khoa:</span>{" "}
                            {a.specialty}
                          </p>
                          <p>
                            <span className="font-medium">
                              Lịch khám trước:
                            </span>{" "}
                            {a.date}
                          </p>

                          <div className="flex gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Ngày tái khám
                              </label>
                              <input
                                type="date"
                                className="border rounded-md p-2 w-full"
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Giờ tái khám
                              </label>
                              <input
                                type="time"
                                className="border rounded-md p-2 w-full"
                                value={formTime}
                                onChange={(e) => setFormTime(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Ghi chú
                            </label>
                            <textarea
                              className="border rounded-md p-2 w-full"
                              rows={2}
                              value={formNote}
                              onChange={(e) => setFormNote(e.target.value)}
                              placeholder="Nhập ghi chú thêm nếu có..."
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setExpandedId(null)}
                            >
                              Hủy
                            </Button>
                            <Button
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => bookReExam(a)}
                            >
                              Xác nhận đặt
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutUsers>
  );
}
