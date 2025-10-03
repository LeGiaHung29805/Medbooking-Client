"use client";

import { useState } from "react";
import Image from "next/image";
import Layout from "@/components/layout";
import { RefreshCw } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  position: string;
  experience: string;
  department: string;
  hospital: string;
  location: string;
  image: string;
  schedule: { [key: string]: string[] };
  price: number;
}

export default function DoctorsBookingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(""); // ✅ state để trigger tìm kiếm
  const [showCategory, setShowCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Ngày và giờ đã chọn cho từng bác sĩ
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: string }>(
    {}
  );
  const [selectedTimes, setSelectedTimes] = useState<{ [key: number]: string }>(
    {}
  );
  const [openDateDropdown, setOpenDateDropdown] = useState<{
    [key: number]: boolean;
  }>({});

  // Địa chỉ mở rộng riêng cho từng bác sĩ
  const [openAddress, setOpenAddress] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Accordion bảo hiểm riêng cho từng bác sĩ
  const [openInsurance, setOpenInsurance] = useState<{
    [key: number]: boolean;
  }>({});

  // Fake dữ liệu bác sĩ
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Nguyễn Hoàng A",
      position: "Thạc sĩ, Bác sĩ chuyên khoa II",
      experience: "20 năm kinh nghiệm Sản Phụ khoa",
      department: "Sản Phụ khoa",
      hospital: "Bệnh viện Đa khoa Hồng Ngọc",
      location: "Hà Nội",
      image: "/image/doctors/doctor1.jpg",
      schedule: {
        "Thứ 2": ["06:00 - 06:30", "07:00 - 07:30"],
        "Thứ 3": ["08:00 - 08:30", "09:00 - 09:30"],
      },
      price: 300000,
    },
    {
      id: 2,
      name: "Trần Thu B",
      position: "Bác sĩ CKI",
      experience: "15 năm kinh nghiệm Nội khoa",
      department: "Nội khoa",
      hospital: "Bệnh viện Bạch Mai",
      location: "Hà Nội",
      image: "/image/doctors/doctor2.jpg",
      schedule: {
        "Thứ 4": ["10:00 - 10:30", "11:00 - 11:30"],
        "Thứ 5": ["14:00 - 14:30"],
      },
      price: 500000,
    },
    {
      id: 3,
      name: "Lê  C",
      position: "PGS. TS, Bác sĩ",
      experience: "25 năm kinh nghiệm Ngoại khoa",
      department: "Ngoại khoa",
      hospital: "Bệnh viện Việt Đức",
      location: "Hà Nội",
      image: "/image/doctors/doctor1.jpg",
      schedule: {
        "Thứ 2": ["13:30 - 14:00"],
        "Thứ 6": ["15:00 - 15:30", "16:00 - 16:30"],
      },
      price: 400000,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Thạc sĩ, Bác sĩ chuyên khoa I",
      experience: "15 năm kinh nghiệm Tai Mũi Họng",
      department: "Tai Mũi Họng",
      hospital: "Bệnh viện Tai Mũi Họng Trung ương",
      location: "Hà Nội",
      image: "/image/doctors/doctor4.jpg",
      schedule: {
        "Thứ 2": ["13:30 - 14:00", "14:30 - 15:00"],
        "Thứ 6": ["08:00 - 08:30", "09:00 - 09:30"],
      },
      price: 250000,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      position: "Bác sĩ chuyên khoa I",
      experience: "10 năm kinh nghiệm Răng Hàm Mặt",
      department: "Răng Hàm Mặt",
      hospital: "Phòng khám Răng Hàm Mặt Sài Gòn",
      location: "Hồ Chí Minh",
      image: "/image/doctors/doctor5.jpg",
      schedule: {
        "Thứ 3": ["08:00 - 08:30", "09:00 - 09:45"],
        "Thứ 5": ["16:00 - 16:30"],
        "Thứ 7": ["10:00 - 11:00"],
      },
      price: 400000,
    },
    {
      id: 6,
      name: "Ngô Thị F",
      position: "Bác sĩ nội trú",
      experience: "6 năm kinh nghiệm Nhi khoa",
      department: "Nhi",
      hospital: "Bệnh viện Nhi Đồng 1",
      location: "Hồ Chí Minh",
      image: "/image/doctors/doctor6.jpg",
      schedule: {
        "Thứ 2": ["08:00 - 08:30", "08:45 - 09:15"],
        "Thứ 4": ["09:30 - 10:00", "10:15 - 10:45"],
        "Thứ 6": ["15:00 - 15:45"],
      },
      price: 200000,
    },

    {
      id: 7,
      name: "Vũ Văn G",
      position: "Thạc sĩ, Bác sĩ chuyên khoa II",
      experience: "18 năm kinh nghiệm Da liễu",
      department: "Da liễu",
      hospital: "Bệnh viện Da Liễu Trung ương",
      location: "Hà Nội",
      image: "/image/doctors/doctor7.jpg",
      schedule: {
        "Thứ 3": ["13:00 - 13:30", "14:00 - 14:30"],
        "Thứ 5": ["17:00 - 17:30"],
        "Thứ 7": ["09:00 - 09:30", "09:45 - 10:15"],
      },
      price: 300000,
    },
    {
      id: 8,
      name: "Bùi Thị H",
      position: "Bác sĩ chuyên khoa II",
      experience: "22 năm kinh nghiệm Cơ Xương Khớp",
      department: "Cơ Xương Khớp",
      hospital: "Bệnh viện Bạch Mai",
      location: "Hà Nội",
      image: "/image/doctors/doctor8.jpg",
      schedule: {
        "Thứ 2": ["07:00 - 07:30", "07:45 - 08:15"],
        "Thứ 4": ["15:00 - 15:30", "16:00 - 16:30"],
        "Chủ nhật": ["08:30 - 09:15"],
      },
      price: 320000,
    },
    {
      id: 9,
      name: "Đặng Văn I",
      position: "Bác sĩ chuyên khoa I",
      experience: "11 năm kinh nghiệm Tiết niệu",
      department: "Tiết niệu",
      hospital: "Bệnh viện Việt Đức",
      location: "Hà Nội",
      image: "/image/doctors/doctor9.jpg",
      schedule: {
        "Thứ 3": ["07:30 - 08:00", "11:00 - 11:30"],
        "Thứ 6": ["13:00 - 13:45"],
        "Thứ 7": ["14:00 - 14:30"],
      },
      price: 350000,
    },
    {
      id: 10,
      name: "Phan Thị K",
      position: "Bác sĩ chuyên khoa II",
      experience: "16 năm kinh nghiệm Mắt",
      department: "Mắt",
      hospital: "Bệnh viện Mắt Trung ương",
      location: "Hà Nội",
      image: "/image/doctors/doctor10.jpg",
      schedule: {
        "Thứ 2": ["10:00 - 10:30", "10:45 - 11:15"],
        "Thứ 5": ["08:00 - 08:30", "09:00 - 09:30"],
        "Chủ nhật": ["10:00 - 11:00"],
      },
      price: 370000,
    },
    {
      id: 11,
      name: "Trương Văn L",
      position: "Thạc sĩ",
      experience: "14 năm kinh nghiệm Truyền nhiễm",
      department: "Truyền nhiễm",
      hospital: "Bệnh viện Bệnh Nhiệt Đới",
      location: "Hồ Chí Minh",
      image: "/image/doctors/doctor11.jpg",
      schedule: {
        "Thứ 3": ["09:00 - 09:30", "09:45 - 10:15"],
        "Thứ 4": ["14:00 - 14:30"],
        "Thứ 6": ["08:00 - 08:30"],
      },
      price: 280000,
    },
    {
      id: 12,
      name: "Nguyễn Thị M",
      position: "Bác sĩ chuyên khoa I",
      experience: "9 năm kinh nghiệm Thần kinh",
      department: "Thần kinh",
      hospital: "Bệnh viện Chợ Rẫy",
      location: "Hồ Chí Minh",
      image: "/image/doctors/doctor12.jpg",
      schedule: {
        "Thứ 2": ["15:00 - 15:30", "16:00 - 16:30"],
        "Thứ 5": ["10:00 - 10:30"],
        "Thứ 7": ["08:30 - 09:00"],
      },
      price: 300000,
    },
    {
      id: 13,
      name: "Lý Văn N",
      position: "TS.BS, Bác sĩ chuyên khoa II",
      experience: "28 năm kinh nghiệm Ung bướu",
      department: "Ung bướu",
      hospital: "Bệnh viện K",
      location: "Hà Nội",
      image: "/image/doctors/doctor13.jpg",
      schedule: {
        "Thứ 3": ["07:00 - 07:30", "07:45 - 08:15"],
        "Thứ 6": ["09:00 - 09:45", "10:00 - 10:30"],
        "Chủ nhật": ["14:00 - 14:45"],
      },
      price: 550000,
    },
    {
      id: 14,
      name: "Phùng Thị O",
      position: "Bác sĩ chuyên khoa I",
      experience: "13 năm kinh nghiệm Ngoại Tổng quát",
      department: "Ngoại Tổng quát",
      hospital: "Bệnh viện Đa khoa tỉnh Bắc Ninh",
      location: "Bắc Ninh",
      image: "/image/doctors/doctor14.jpg",
      schedule: {
        "Thứ 2": ["08:00 - 08:45"],
        "Thứ 4": ["13:00 - 13:30", "13:45 - 14:15"],
        "Thứ 6": ["17:00 - 17:30"],
      },
      price: 260000,
    },
    {
      id: 15,
      name: "Đỗ Văn P",
      position: "Bác sĩ Gây mê hồi sức",
      experience: "12 năm kinh nghiệm Gây mê",
      department: "Gây mê hồi sức",
      hospital: "Bệnh viện Trung ương Huế",
      location: "Huế",
      image: "/image/doctors/doctor15.jpg",
      schedule: {
        "Thứ 3": ["06:00 - 07:00"],
        "Thứ 5": ["12:00 - 12:30"],
        "Thứ 7": ["07:30 - 08:00"],
      },
      price: 330000,
    },
    {
      id: 16,
      name: "Hà Thị Q",
      position: "Bác sĩ Chẩn đoán hình ảnh",
      experience: "8 năm kinh nghiệm Chẩn đoán hình ảnh",
      department: "Chẩn đoán hình ảnh",
      hospital: "Bệnh viện Đa khoa Đà Nẵng",
      location: "Đà Nẵng",
      image: "/image/doctors/doctor16.jpg",
      schedule: {
        "Thứ 2": ["08:00 - 09:00"],
        "Thứ 4": ["10:00 - 11:00"],
        "Thứ 6": ["14:00 - 15:00"],
      },
      price: 240000,
    },
  ];

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

  // Toggle danh mục
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
    setCurrentPage(1); // ✅ reset phân trang khi đổi filter
  };

  // Lọc
  const filtered = doctors.filter((d) => {
    const matchName = d.name
      .toLowerCase()
      .includes(searchTrigger.toLowerCase()); // ✅ dùng searchTrigger
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

  // Pagination
  const doctorsPerPage = 5;
  const totalPages = Math.ceil(filtered.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const paginatedDoctors = filtered.slice(
    startIndex,
    startIndex + doctorsPerPage
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Thanh tìm kiếm */}
        <div className="bg-green-600 p-4 rounded-md shadow">
          {/* Ô tìm kiếm */}
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
                setSearchTrigger(searchTerm); // ✅ bấm mới lọc
                setCurrentPage(1);
              }}
            >
              Tìm kiếm
            </button>

            {/* ✅ Nút reset filter */}
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

        {/* Danh sách bác sĩ */}
        {paginatedDoctors.map((doc) => (
          <div
            key={doc.id}
            className="mt-2 bg-white rounded-md shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Bên trái */}
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
                <a className="text-sm text-blue-500 cursor-pointer">Xem thêm</a>
              </div>
            </div>

            {/* Bên phải */}
            <div className="col-span-2 pl-4">
              <div className="space-y-4">
                {/* Lịch khám */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Lịch khám</h3>

                  {/* Chọn ngày */}
                  <div className="relative mb-3 w-1/2">
                    <button
                      className="w-full px-3 py-2 border rounded-md bg-white text-left"
                      onClick={() =>
                        setOpenDateDropdown((prev) => ({
                          ...prev,
                          [doc.id]: !prev[doc.id],
                        }))
                      }
                    >
                      {selectedDates[doc.id] || "Chọn ngày khám"}
                    </button>

                    {openDateDropdown[doc.id] && (
                      <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg p-3 z-10">
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
                      </div>
                    )}
                  </div>

                  {/* Giờ khám */}
                  {selectedDates[doc.id] ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {doc.schedule[selectedDates[doc.id]].map((time, i) => (
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
                        Số 8 đường Châu Văn Liêm, Phú Đô, Nam Từ Liêm, Hà Nội
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
                    Loại bảo hiểm áp dụng {openInsurance[doc.id] ? "▲" : "▼"}
                  </button>

                  {openInsurance[doc.id] && (
                    <div className="mt-3 space-y-3 text-sm">
                      <div className="border p-2 rounded">
                        <strong>Bảo hiểm y tế nhà nước</strong>
                        <p>
                          Người bệnh cần mang theo CCCD và VssID để nhân viên hỗ
                          trợ về danh mục áp dụng BHYT
                        </p>
                      </div>
                      <div className="border p-2 rounded">
                        <strong>Bảo hiểm bảo lãnh</strong>
                        <p>
                          Đối với các bảo hiểm không bảo lãnh trực tiếp: Bệnh
                          viện hỗ trợ xuất hóa đơn tài chính (hóa đơn đỏ).
                        </p>
                        <a className="text-blue-500 cursor-pointer">
                          Xem danh sách
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
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

        {/* Nút đặt lịch cố định */}
        <div className="fixed bottom-0 left-0 right-0 bg-green-600 text-center py-1 font-semibold">
          <button className="bg-white px-6 py-1 rounded-md shadow">
            Đặt lịch khám
          </button>
        </div>
      </div>
    </Layout>
  );
}
