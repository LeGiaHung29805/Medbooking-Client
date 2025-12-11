"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/components/layout";
import { RefreshCw } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Dữ liệu trả về từ Laravel
interface DoctorFromApi {
  DoctorID: number;
  FullName: string;
  Degree: string;
  Description: string | null;
  Specialty: string;
}

// Dữ liệu dùng cho UI
interface Doctor {
  id: number;
  name: string;
  position: string;
  experience: string;
  department: string;
  hospital: string;
  location: string;
  image: string;
  schedule: { [key: string]: string[] }; // "Thứ Hai 2025-12-10": ["09:00",...]
  price: number;
}

interface AvailabilityDay {
  date: string;
  dayOfWeek: string;
  slots: {
    SlotID: number;
    StartTime: string;
  }[];
}

export default function DoctorsBookingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // dữ liệu từ backend
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ngày & giờ đã chọn
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: string }>(
    {}
  );
  const [selectedTimes, setSelectedTimes] = useState<{ [key: number]: string }>(
    {}
  );
  const [openDateDropdown, setOpenDateDropdown] = useState<{
    [key: number]: boolean;
  }>({});

  const [openAddress, setOpenAddress] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [openInsurance, setOpenInsurance] = useState<{
    [key: number]: boolean;
  }>({});

  const [loadingDoctorId, setLoadingDoctorId] = useState<number | null>(null);

  // NEW: doctor đang xem chi tiết
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);

  const categories = [
    "Tất cả danh mục",
    "Sản Phụ khoa",
    "Nhi khoa",
    "Ngoại khoa",
    "Nội khoa",
    "Tai Mũi Họng",
    "Da liễu",
    "Tim mạch",
  ];

  const priceRanges = [
    { label: "Dưới 300k", value: "0-300000" },
    { label: "300k - 500k", value: "300000-500000" },
    { label: "Trên 500k", value: "500000+" },
  ];

  // ===== 1. Load danh sách bác sĩ từ backend =====
  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/doctors`);
        if (!res.ok) throw new Error("Không gọi được API /doctors");

        const data: DoctorFromApi[] = await res.json();

        const mapped: Doctor[] = data.map((d, index) => ({
          id: d.DoctorID,
          name: d.FullName,
          position: d.Degree,
          experience: d.Description ?? "",
          department: d.Specialty ?? "",
          hospital: "Bệnh viện MedBooking",
          location: "Hà Nội",
          image: `/image/doctors/doctor${((index % 16) || 0) + 1}.jpg`,
          schedule: {},
          price: 300000,
        }));

        setDoctors(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Có lỗi khi tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  // ===== 2. Load lịch khám của 1 bác sĩ =====
  async function loadAvailability(doctorId: number) {
    try {
      setLoadingDoctorId(doctorId);

      const res = await fetch(
        `${API_BASE_URL}/doctors/${doctorId}/availability`
      );
      if (!res.ok) throw new Error("Không gọi được API availability");

      const days: AvailabilityDay[] = await res.json();

      const schedule: { [key: string]: string[] } = {};
      days.forEach((day) => {
        const label = `${day.dayOfWeek} ${day.date}`;
        schedule[label] = day.slots.map((s) => s.StartTime);
      });

      setDoctors((prev) =>
        prev.map((doc) => (doc.id === doctorId ? { ...doc, schedule } : doc))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDoctorId(null);
    }
  }

  // ===== 3. Filter & Pagination =====
  const toggleCategory = (cat: string) => {
    if (cat === "Tất cả danh mục") {
      setSelectedCategories([]);
      return;
    }
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
    setCurrentPage(1);
  };

  const filtered = doctors.filter((d) => {
    const matchName = d.name
      .toLowerCase()
      .includes(searchTrigger.toLowerCase());
    const matchDept =
      selectedCategories.length === 0 ||
      selectedCategories.includes(d.department);
    const matchPrice =
      priceRange === "" ||
      (priceRange.includes("-") &&
        d.price >= parseInt(priceRange.split("-")[0]) &&
        d.price <= parseInt(priceRange.split("-")[1])) ||
      (priceRange === "500000+" && d.price > 500000);

    return matchName && matchDept && matchPrice;
  });

  const doctorsPerPage = 5;
  const totalPages = Math.ceil(filtered.length / doctorsPerPage) || 1;
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const paginatedDoctors = filtered.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  // ===== 4. JSX =====
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Thanh tìm kiếm */}
        <div className="bg-green-600 p-4 rounded-md shadow">
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md bg-white focus:outline-none"
            />
            <button
              className="px-4 py-2 bg-white rounded-md font-medium hover:bg-gray-100"
              onClick={() => {
                setSearchTrigger(searchTerm);
                setCurrentPage(1);
              }}
            >
              Tìm kiếm
            </button>

            <button
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
              onClick={() => {
                setSearchTerm("");
                setSearchTrigger("");
                setSelectedCategories([]);
                setPriceRange("");
                setCurrentPage(1);
              }}
              title="Reset bộ lọc"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Danh mục + Mức giá */}
          <div className="flex gap-2">
            {/* Danh mục */}
            <div className="relative flex-1">
              <button
                className="w-full px-3 py-2 border rounded-md bg-white text-left"
                onClick={() => setShowCategory(!showCategory)}
              >
                {selectedCategories.length > 0
                  ? selectedCategories.join(", ")
                  : "Danh mục"}
              </button>

              {showCategory && (
                <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-3 z-10">
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-2 rounded-lg border ${
                          selectedCategories.includes(cat)
                            ? "bg-green-500 border-green-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      className="px-3 py-2 text-gray-500"
                      onClick={() => setSelectedCategories([])}
                    >
                      Đặt lại
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      onClick={() => setShowCategory(false)}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mức giá */}
            <div className="relative flex-1">
              <button
                className="w-full px-3 py-2 border rounded-md bg-white text-left"
                onClick={() => setShowPrice(!showPrice)}
              >
                {priceRange
                  ? priceRanges.find((p) => p.value === priceRange)?.label
                  : "Mức giá"}
              </button>

              {showPrice && (
                <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-3 z-10">
                  <div className="flex flex-col gap-2">
                    {priceRanges.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => {
                          setPriceRange(p.value);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-2 rounded-lg border ${
                          priceRange === p.value
                            ? "bg-green-500 border-green-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      className="px-3 py-2 text-gray-500"
                      onClick={() => setPriceRange("")}
                    >
                      Đặt lại
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                      onClick={() => setShowPrice(false)}
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thông báo */}
        {loading && (
          <p className="mt-4 text-center text-gray-500">Đang tải bác sĩ...</p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-500">Lỗi: {error}</p>
        )}

        {/* Danh sách bác sĩ */}
        {!loading &&
          !error &&
          paginatedDoctors.map((doc) => {
            const selectedDay = selectedDates[doc.id];
            const times = selectedDay ? doc.schedule[selectedDay] || [] : [];

            return (
              <div
                key={doc.id}
                className="mt-2 bg-white rounded-md shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Trái */}
                <div className="flex items-start gap-4 border-r pr-4">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-blue-600">
                      {doc.position} {doc.name}
                    </h2>
                    <p className="text-sm text-gray-600">{doc.experience}</p>
                    <p className="text-sm text-gray-500 mt-2">📍 {doc.location}</p>
                    {/* NÚT XEM THÊM – GIỜ ĐÃ CÓ onClick */}
                    <button
                      type="button"
                      onClick={() => setViewDoctor(doc)}
                      className="text-sm text-blue-500 cursor-pointer mt-1"
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>

                {/* Phải */}
                <div className="col-span-2 pl-4">
                  <div className="space-y-4">
                    {/* Lịch khám */}
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Lịch khám</h3>

                      {/* Chọn ngày */}
                      <div className="relative mb-3 w-1/2">
                        <button
                          className="w-full px-3 py-2 border rounded-md bg-white text-left"
                          onClick={() => {
                            setOpenDateDropdown((prev) => ({
                              ...prev,
                              [doc.id]: !prev[doc.id],
                            }));

                            if (
                              !doc.schedule ||
                              Object.keys(doc.schedule).length === 0
                            ) {
                              loadAvailability(doc.id);
                            }
                          }}
                        >
                          {selectedDates[doc.id] || "Chọn ngày khám"}
                        </button>

                        {openDateDropdown[doc.id] && (
                          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-3 z-10">
                            {loadingDoctorId === doc.id && (
                              <p className="text-sm text-gray-500 px-3">
                                Đang tải lịch khám...
                              </p>
                            )}

                            {Object.keys(doc.schedule).map((day) => (
                              <button
                                key={day}
                                onClick={() => {
                                  setSelectedDates((prev) => ({
                                    ...prev,
                                    [doc.id]: day,
                                  }));
                                  setOpenDateDropdown((prev) => ({
                                    ...prev,
                                    [doc.id]: false,
                                  }));
                                }}
                                className="block w-full px-3 py-2 text-left rounded hover:bg-green-100"
                              >
                                {day}
                              </button>
                            ))}

                            {!loadingDoctorId &&
                              Object.keys(doc.schedule).length === 0 && (
                                <p className="text-sm text-gray-500 px-3">
                                  Không có lịch khả dụng.
                                </p>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Giờ khám */}
                      {selectedDay ? (
                        times.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {times.map((time, i) => (
                              <button
                                key={i}
                                onClick={() =>
                                  setSelectedTimes((prev) => ({
                                    ...prev,
                                    [doc.id]: time,
                                  }))
                                }
                                className={`border px-2 py-1 rounded ${
                                  selectedTimes[doc.id] === time
                                    ? "bg-green-500 text-white"
                                    : "hover:bg-green-100"
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            Không có khung giờ trống cho ngày này.
                          </p>
                        )
                      ) : (
                        <p className="text-gray-500">
                          Hãy chọn ngày để xem giờ khám
                        </p>
                      )}
                    </div>

                    {/* Địa chỉ khám */}
                    <div className="border-b pb-4">
                      <p>
                        <strong>Địa chỉ khám:</strong> {doc.hospital}
                      </p>
                      <button
                        onClick={() =>
                          setOpenAddress((prev) => ({
                            ...prev,
                            [doc.id]: !prev[doc.id],
                          }))
                        }
                        className="text-blue-500 text-sm mt-1"
                      >
                        {openAddress[doc.id] ? "Ẩn chi tiết" : "Xem chi tiết"}
                      </button>

                      {openAddress[doc.id] && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>
                            Số 8 đường Châu Văn Liêm, Phú Đô, Nam Từ Liêm, Hà
                            Nội
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Giá khám */}
                    <div className="border-b pb-4">
                      <p>
                        <strong>Giá khám:</strong>{" "}
                        {doc.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>

                    {/* Bảo hiểm */}
                    <div className="border-b pb-4">
                      <button
                        className="text-blue-600 font-medium"
                        onClick={() =>
                          setOpenInsurance((prev) => ({
                            ...prev,
                            [doc.id]: !prev[doc.id],
                          }))
                        }
                      >
                        Loại bảo hiểm áp dụng{" "}
                        {openInsurance[doc.id] ? "▲" : "▼"}
                      </button>

                      {openInsurance[doc.id] && (
                        <div className="mt-3 space-y-3 text-sm">
                          <div className="border p-2 rounded">
                            <strong>Bảo hiểm y tế nhà nước</strong>
                            <p>
                              Người bệnh cần mang theo CCCD và VssID để nhân
                              viên hỗ trợ về danh mục áp dụng BHYT
                            </p>
                          </div>
                          <div className="border p-2 rounded">
                            <strong>Bảo hiểm bảo lãnh</strong>
                            <p>
                              Đối với các bảo hiểm không bảo lãnh trực tiếp:
                              Bệnh viện hỗ trợ xuất hóa đơn tài chính (hóa đơn
                              đỏ).
                            </p>
                            <span className="text-blue-500 cursor-pointer">
                              Xem danh sách
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Pagination */}
        {!loading && !error && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Nút đặt lịch cố định */}
        <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-center py-1 font-semibold">
          <button className="bg-white px-6 py-1 rounded-md shadow">
            Đặt lịch khám
          </button>
        </div>
      </div>

      {/* MODAL XEM THÊM BÁC SĨ */}
      {viewDoctor && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
            <div className="flex items-center gap-4 p-6 border-b">
              <Image
                src={viewDoctor.image}
                alt={viewDoctor.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-blue-600">
                  {viewDoctor.position} {viewDoctor.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Chuyên khoa: {viewDoctor.department || "Đang cập nhật"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Bệnh viện: {viewDoctor.hospital}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Giới thiệu</h3>
                <p className="text-sm text-gray-700">
                  {viewDoctor.experience || "Chưa có mô tả chi tiết."}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Địa chỉ khám</h3>
                <p className="text-sm text-gray-700">
                  {viewDoctor.hospital} - {viewDoctor.location}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Giá khám</h3>
                <p className="text-sm text-gray-700">
                  {viewDoctor.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setViewDoctor(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
