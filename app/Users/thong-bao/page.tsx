"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutUsers from "@/components/layoutUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  severity: "Nhẹ" | "Trung bình" | "Nghiêm trọng";
  read: boolean;
  relatedDoctor?: string;
  relatedMember?: string;
}

export default function ThongBao() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Kết quả khám của bạn đã có",
      message:
        "Bác sĩ Nguyễn Văn A đã cập nhật kết quả khám Viêm họng cấp vào ngày 28/09/2025.",
      date: "2025-09-29 08:15",
      severity: "Nhẹ",
      read: false,
      relatedDoctor: "Nguyễn Văn A",
      relatedMember: "Lê Gia Hưng",
    },
    {
      id: 2,
      title: "Cảnh báo sức khỏe nghiêm trọng",
      message:
        "Bác sĩ Lê Văn C phát hiện tình trạng Huyết áp cao của mẹ bạn ở mức nghiêm trọng. Hãy theo dõi thường xuyên và tái khám đúng hẹn.",
      date: "2025-09-10 09:00",
      severity: "Nghiêm trọng",
      read: false,
      relatedDoctor: "Lê Văn C",
      relatedMember: "Trần Thị C",
    },
    {
      id: 3,
      title: "Nhắc lịch tái khám da liễu",
      message:
        "Bạn có lịch tái khám da liễu với BS. Trần Thị B vào ngày 07/10/2025 lúc 09:30.",
      date: "2025-10-01 10:00",
      severity: "Trung bình",
      read: true,
    },
  ]);

  const [selected, setSelected] = useState<Notification | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  const getIcon = (severity: Notification["severity"]) => {
    switch (severity) {
      case "Nghiêm trọng":
        return <AlertTriangle className="text-red-600 w-5 h-5" />;
      case "Trung bình":
        return <Info className="text-yellow-600 w-5 h-5" />;
      default:
        return <CheckCircle className="text-green-600 w-5 h-5" />;
    }
  };

  const getBgColor = (severity: Notification["severity"]) => {
    switch (severity) {
      case "Nghiêm trọng":
        return "bg-red-50 border-red-200";
      case "Trung bình":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "important") return n.severity === "Nghiêm trọng";
    return true;
  });

  return (
    <LayoutUsers>
      <div className="p-6">
        <h1 className="text-xl font-semibold text-green-700 mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Thông báo
        </h1>
        <p className="text-gray-600 mb-6">
          Theo dõi các thông báo y tế, kết quả khám và nhắc nhở tái khám của bạn
          và người thân.
        </p>

        {/* Tabs lọc */}
        <div className="flex items-center gap-3 mb-5">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={`${filter === "all"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-green-600 text-green-700 hover:bg-green-50"
              }`}
          >
            Tất cả
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className={`${filter === "unread"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-green-600 text-green-700 hover:bg-green-50"
              }`}
          >
            Chưa đọc
          </Button>
          <Button
            variant={filter === "important" ? "default" : "outline"}
            onClick={() => setFilter("important")}
            className={`flex items-center gap-1 ${filter === "important"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "border-green-600 text-green-700 hover:bg-green-50"
              }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Quan trọng
          </Button>
        </div>

        {/* Danh sách thông báo */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border rounded-lg shadow-sm p-10 flex flex-col items-center justify-center min-h-[250px]">
            <Filter className="w-10 h-10 text-gray-400 mb-3" />
            <p className="font-medium mb-1">Không có thông báo phù hợp</p>
            <p className="text-gray-500">
              Hãy thử chọn tab khác hoặc chờ thông tin mới.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-4 border rounded-lg shadow-sm transition-all ${getBgColor(
                  n.severity
                )} ${n.read ? "opacity-80" : "opacity-100"}`}
              >
                {getIcon(n.severity)}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    {n.title}
                    {!n.read && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                        Mới
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(n);
                      markAsRead(n.id);
                    }}
                  //   className="text-green-700 border-green-600 hover:bg-green-50"   //màu cái mắt xem chi tiết
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal xem chi tiết */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-700 font-semibold">
                Chi tiết thông báo
              </DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Tiêu đề:</span> {selected.title}
                </p>
                <p>
                  <span className="font-medium">Nội dung:</span>{" "}
                  {selected.message}
                </p>
                {selected.relatedDoctor && (
                  <p>
                    <span className="font-medium">Bác sĩ liên quan:</span>{" "}
                    {selected.relatedDoctor}
                  </p>
                )}
                {selected.relatedMember && (
                  <p>
                    <span className="font-medium">Người được khám:</span>{" "}
                    {selected.relatedMember}
                  </p>
                )}
                <p>
                  <span className="font-medium">Thời gian:</span>{" "}
                  {selected.date}
                </p>
                <p>
                  <span className="font-medium">Mức độ:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${selected.severity === "Nghiêm trọng"
                        ? "bg-red-100 text-red-700"
                        : selected.severity === "Trung bình"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                  >
                    {selected.severity}
                  </span>
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </LayoutUsers>
  );
}
