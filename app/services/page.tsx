"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface ServiceFromApi {
  ServiceID: number;
  ServiceName: string;
  Description: string | null;
  EstimatedDuration: number | null;
  Price: string | number;
  imageURL: string | null;
  SpecialtyID: number;
  specialty?: {
    SpecialtyName: string;
  } | null;
}

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  displayPrice: string;
  desc: string;
  duration: string;
  popular?: boolean;
  doctor: string;
  preparation: string;
  rating: number;
  reviews: number;
  related: number[];
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });

  // dữ liệu dịch vụ từ backend
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const servicesPerPage = 6;

  // Danh mục hiển thị trong select
  const categories = [
    { id: "all", name: "Tất cả", count: 40 },
    { id: "Khám tổng quát", name: "Khám tổng quát", count: 5 },
    { id: "Chuyên khoa", name: "Chuyên khoa", count: 10 },
    { id: "Cận lâm sàng", name: "Cận lâm sàng", count: 10 },
    { id: "Điều trị", name: "Điều trị", count: 5 },
    { id: "Gói dịch vụ", name: "Gói dịch vụ", count: 5 },
    { id: "Phẫu thuật", name: "Phẫu thuật", count: 3 },
    { id: "Thẩm mỹ", name: "Thẩm mỹ", count: 1 },
    { id: "Tâm lý", name: "Tâm lý", count: 1 },
  ];

  // ===== 1. Load dịch vụ từ backend =====
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/services`);
        if (!res.ok) throw new Error("Không gọi được API /services");

        const data: ServiceFromApi[] = await res.json();

        const mapped: Service[] = data.map((s, index) => {
          const priceNumber = Number(s.Price);
          const categoryName = s.specialty?.SpecialtyName || "Khác";

          return {
            id: s.ServiceID,
            name: s.ServiceName,
            category: categoryName,
            price: priceNumber,
            displayPrice: isNaN(priceNumber)
              ? "Liên hệ"
              : `${priceNumber.toLocaleString("vi-VN")} đ`,
            desc: s.Description || "Chưa có mô tả cho dịch vụ này.",
            duration:
              s.EstimatedDuration && s.EstimatedDuration > 0
                ? `${s.EstimatedDuration} phút`
                : "—",
            doctor: `Đội ngũ bác sĩ chuyên khoa ${categoryName}`,
            preparation:
              "Vui lòng làm theo hướng dẫn của bác sĩ khi đến khám.",
            rating: 4.7,
            reviews: 100 + index * 3,
            popular: index < 5,
            related: [],
          };
        });

        setServices(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Có lỗi khi tải danh sách dịch vụ");
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  //Lọc dịch vụ
  const filteredServices = services.filter((service) => {
    const keyword = searchTerm.toLowerCase();

    const matchesSearch =
      service.name.toLowerCase().includes(keyword) ||
      service.desc.toLowerCase().includes(keyword) ||
      service.doctor.toLowerCase().includes(keyword);

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    let matchesPrice = true;
    if (priceRange !== "all") {
      if (priceRange === "low") matchesPrice = service.price < 200000;
      else if (priceRange === "medium")
        matchesPrice = service.price >= 200000 && service.price <= 500000;
      else if (priceRange === "high") matchesPrice = service.price > 500000;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  //Phân trang
  const totalPages =
    Math.ceil(filteredServices.length / servicesPerPage) || 1;
  const startIndex = (currentPage - 1) * servicesPerPage;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + servicesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, priceRange]);

  //Modal đặt lịch
  const openModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setFormData({ name: "", phone: "", date: "", time: "" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone || !formData.date || !formData.time) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!/^\+?[0-9]{10,12}$/.test(formData.phone)) {
      alert("Vui lòng nhập số điện thoại hợp lệ!");
      return;
    }

    alert(
      `Đặt lịch thành công!\n\nDịch vụ: ${selectedService?.name}\nHọ tên: ${formData.name
      }\nSĐT: ${formData.phone}\nNgày: ${formData.date}\nGiờ: ${formData.time
      }\n\nCảm ơn bạn đã đặt lịch!`
    );
    closeModal();
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setPriceRange("all");
    setCurrentPage(1);
  };

  const getRelatedServiceNames = (relatedIds: number[]) => {
    return relatedIds
      .map((id) => {
        const service = services.find((s) => s.id === id);
        return service?.name || "";
      })
      .filter((name) => name)
      .join(", ");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">

        <section className="relative py-20 overflow-hidden min-h-[500px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/image/dat_lich.jpg")' }}
          ></div>

          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Dịch vụ khám & chữa bệnh
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
              Chọn dịch vụ phù hợp, xem chi tiết và đặt lịch nhanh trong vài bước.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                    {services.length}+
                  </div>
                  <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">
                    Dịch vụ
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                    50+
                  </div>
                  <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">
                    Bác sĩ
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                    10K+
                  </div>
                  <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">
                    Bệnh nhân
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                    98%
                  </div>
                  <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">
                    Hài lòng
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Tìm dịch vụ, bác sĩ hoặc triệu chứng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả danh mục</option>
                {categories
                  .filter((cat) => cat.id !== "all")
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              {/* Price Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả giá</option>
                <option value="low">Dưới 200k</option>
                <option value="medium">200k - 500k</option>
                <option value="high">Trên 500k</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Đặt lại
              </button>
            </div>
          </div>

          {/* Kết quả / trạng thái */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center text-gray-500">
              Đang tải danh sách dịch vụ...
            </div>
          )}
          {error && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-center text-red-500">
              Lỗi: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Results Header */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Kết quả:{" "}
                    <span className="text-green-600">
                      {filteredServices.length}
                    </span>{" "}
                    dịch vụ
                    {selectedCategory !== "all" &&
                      ` trong ${categories.find((c) => c.id === selectedCategory)?.name
                      }`}
                  </h2>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">Sắp xếp:</span>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>Phổ biến nhất</option>
                      <option>Giá thấp đến cao</option>
                      <option>Giá cao đến thấp</option>
                      <option>Đánh giá cao nhất</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              {paginatedServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">
                              {service.category}
                            </span>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                              👨‍⚕️ {service.doctor}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {service.displayPrice}
                            </div>
                            {service.popular && (
                              <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded mt-1">
                                Phổ biến
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {service.desc}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="flex items-center gap-1 text-yellow-500">
                            ⭐ {service.rating.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({service.reviews} lượt đánh giá)
                          </span>
                        </div>

                        {/* Preparation */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-800 flex items-start gap-2">
                            <span>📋</span>
                            <span>{service.preparation}</span>
                          </p>
                        </div>

                        {/* Related Services */}
                        {service.related.length > 0 && (
                          <div className="text-sm text-gray-600 mb-4">
                            <p className="flex items-start gap-2">
                              <span>💡</span>
                              <span>
                                <strong>Gợi ý kết hợp:</strong>{" "}
                                {getRelatedServiceNames(service.related)}
                              </span>
                            </p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex gap-3">
                          {/* Đặt lịch ngay */}
                          <button
                            onClick={() => openModal(service)}
                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                          >
                            Đặt lịch ngay
                          </button>

                          {/* Chi tiết – giờ cũng mở modal */}
                          <button
                            onClick={() => openModal(service)}
                            className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-colors"
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                    Không tìm thấy dịch vụ
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 bg-white rounded-2xl shadow-lg p-6">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    ← Trang trước
                  </button>

                  <div className="text-gray-600 font-semibold">
                    Trang{" "}
                    <span className="text-green-600">{currentPage}</span> /{" "}
                    <span className="text-gray-800">{totalPages}</span>
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    Trang sau →
                  </button>
                </div>
              )}

              {/* Background images */}
              <div className="mt-8 w-screen -mx-4 overflow-hidden h-150">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: 'url("/image/dich_vu_kham.jpg")' }}
                ></div>
              </div>

              <div className="mt-8 w-screen -mx-4 overflow-hidden h-100">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: 'url("/image/my_home.jpg")' }}
                ></div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-8 rounded-t-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <span>📅</span>
                Đặt lịch: {selectedService.name}
              </h3>
              <p className="text-green-100 opacity-90">
                Giá: {selectedService.displayPrice} • Thời lượng:{" "}
                {selectedService.duration} • Bác sĩ: {selectedService.doctor}
              </p>
            </div>

            <div className="p-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <span>
                    <strong>Chuẩn bị:</strong>{" "}
                    {selectedService.preparation}
                  </span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span>👤</span>
                    Họ & tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên đầy đủ"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span>📱</span>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="\+?[0-9]{10,12}"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span>📅</span>
                    Ngày hẹn
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <span>⏰</span>
                    Khung giờ
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">Chọn khung giờ phù hợp</option>
                    <option value="08:00">🕗 08:00 - 09:00</option>
                    <option value="09:00">🕘 09:00 - 10:00</option>
                    <option value="10:00">🕙 10:00 - 11:00</option>
                    <option value="13:00">🕐 13:00 - 14:00</option>
                    <option value="14:00">🕑 14:00 - 15:00</option>
                    <option value="15:00">🕒 15:00 - 16:00</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-red-500 hover:text-red-600 transition-colors"
                  >
                    ❌ Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                  >
                    ✅ Xác nhận đặt lịch
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
