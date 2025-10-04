"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/components/layout";

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
        time: ""
    });

    const servicesPerPage = 6;

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

    const SERVICES: Service[] = [
        // KHÁM TỔNG QUÁT (1-5)
        {
            id: 1,
            name: "Khám Nội Tổng Quát",
            category: "Khám tổng quát",
            price: 300000,
            displayPrice: "300.000 đ",
            desc: "Khám sức khỏe toàn diện, tư vấn và chỉ định xét nghiệm cơ bản.",
            duration: "30 phút",
            popular: true,
            doctor: "BS. Nguyễn Văn An",
            preparation: "Không cần chuẩn bị đặc biệt.",
            rating: 4.7,
            reviews: 180,
            related: [2, 4, 10],
        },
        {
            id: 2,
            name: "Khám Sức Khỏe Định Kỳ Doanh Nghiệp",
            category: "Khám tổng quát",
            price: 500000,
            displayPrice: "500.000 đ",
            desc: "Gói khám sức khỏe định kỳ cho nhân viên doanh nghiệp.",
            duration: "60 phút",
            doctor: "BS. Trần Minh Quân",
            preparation: "Nhịn ăn sáng, mang theo CMND.",
            rating: 4.8,
            reviews: 95,
            related: [1, 4, 7],
        },
        {
            id: 3,
            name: "Khám Sức Khỏe Xuất Khẩu Lao Động",
            category: "Khám tổng quát",
            price: 800000,
            displayPrice: "800.000 đ",
            desc: "Khám sức khỏe theo yêu cầu xuất khẩu lao động.",
            duration: "90 phút",
            doctor: "BS. Lê Thị Hương",
            preparation: "Mang theo hồ sơ, ảnh 4x6, nhịn ăn sáng.",
            rating: 4.6,
            reviews: 120,
            related: [1, 4, 11],
        },
        {
            id: 4,
            name: "Khám Sức Khỏe Lái Xe",
            category: "Khám tổng quát",
            price: 250000,
            displayPrice: "250.000 đ",
            desc: "Khám sức khỏe cấp giấy phép lái xe các hạng.",
            duration: "30 phút",
            popular: true,
            doctor: "BS. Phạm Văn Tú",
            preparation: "Mang theo CMND, ảnh 3x4.",
            rating: 4.5,
            reviews: 320,
            related: [1, 10],
        },
        {
            id: 5,
            name: "Khám Tiền Hôn Nhân",
            category: "Khám tổng quát",
            price: 1200000,
            displayPrice: "1.200.000 đ",
            desc: "Khám sức khỏe tiền hôn nhân cho cả nam và nữ.",
            duration: "120 phút",
            doctor: "BS. Nguyễn Thị Lan",
            preparation: "Nhịn ăn sáng, vệ sinh cá nhân sạch sẽ.",
            rating: 4.7,
            reviews: 85,
            related: [15, 25],
        },


        // CHUYÊN KHOA (6-15)
        {
            id: 6,
            name: "Khám Tim Mạch chuyên sâu",
            category: "Chuyên khoa",
            price: 500000,
            displayPrice: "500.000 đ",
            desc: "Kiểm tra tim mạch, siêu âm tim và tư vấn chuyên sâu.",
            duration: "45 phút",
            doctor: "BS. Trần Thị Bình",
            preparation: "Mang theo hồ sơ y tế cũ nếu có.",
            rating: 4.8,
            reviews: 220,
            related: [1, 16, 18],
        },
        {
            id: 7,
            name: "Khám Nhi Khoa",
            category: "Chuyên khoa",
            price: 350000,
            displayPrice: "350.000 đ",
            desc: "Khám sức khỏe trẻ em, tư vấn dinh dưỡng và tiêm chủng.",
            duration: "30 phút",
            doctor: "BS. Hoàng Thị Phượng",
            preparation: "Mang theo sổ tiêm chủng của trẻ.",
            rating: 4.7,
            reviews: 200,
            related: [1, 3],
        },
        {
            id: 8,
            name: "Khám Da Liễu",
            category: "Chuyên khoa",
            price: 250000,
            displayPrice: "250.000 đ",
            desc: "Khám và điều trị các bệnh về da, tóc, móng và dị ứng.",
            duration: "20 phút",
            doctor: "BS. Lê Thị Kim",
            preparation: "Không bôi kem, mỹ phẩm lên vùng da cần khám.",
            rating: 4.6,
            reviews: 280,
            related: [1],
        },
        {
            id: 9,
            name: "Khám Mắt",
            category: "Chuyên khoa",
            price: 200000,
            displayPrice: "200.000 đ",
            desc: "Đo thị lực, khám và tư vấn các bệnh về mắt.",
            duration: "25 phút",
            popular: true,
            doctor: "BS. Nguyễn Thị Hồng",
            preparation: "Không đeo kính áp tròng trước khi khám 24h.",
            rating: 4.8,
            reviews: 410,
            related: [1],
        },
        {
            id: 10,
            name: "Khám Răng Hàm Mặt",
            category: "Chuyên khoa",
            price: 150000,
            displayPrice: "150.000 đ",
            desc: "Khám, tư vấn và điều trị các bệnh về răng miệng.",
            duration: "20 phút",
            doctor: "BS. Vũ Thị Mai",
            preparation: "Vệ sinh răng miệng sạch sẽ trước khi khám.",
            rating: 4.7,
            reviews: 340,
            related: [1],
        },
        {
            id: 11,
            name: "Khám Tai Mũi Họng",
            category: "Chuyên khoa",
            price: 180000,
            displayPrice: "180.000 đ",
            desc: "Khám và điều trị các bệnh về tai, mũi, họng.",
            duration: "20 phút",
            doctor: "BS. Nguyễn Văn Minh",
            preparation: "Không cần chuẩn bị đặc biệt.",
            rating: 4.6,
            reviews: 270,
            related: [1],
        },
        {
            id: 12,
            name: "Khám Nội Tiết",
            category: "Chuyên khoa",
            price: 300000,
            displayPrice: "300.000 đ",
            desc: "Khám và tư vấn các bệnh lý nội tiết, tiểu đường.",
            duration: "30 phút",
            doctor: "BS. Vũ Văn Quang",
            preparation: "Nhịn ăn nếu có chỉ định xét nghiệm đường huyết.",
            rating: 4.7,
            reviews: 180,
            related: [1, 4],
        },
        {
            id: 13,
            name: "Khám Tiêu Hóa",
            category: "Chuyên khoa",
            price: 400000,
            displayPrice: "400.000 đ",
            desc: "Khám và tư vấn các bệnh lý tiêu hóa như viêm loét dạ dày, trào ngược.",
            duration: "35 phút",
            doctor: "BS. Nguyễn Văn Minh",
            preparation: "Nhịn ăn 6 giờ trước khi khám.",
            rating: 4.6,
            reviews: 170,
            related: [1, 7],
        },
        {
            id: 14,
            name: "Khám Phụ Khoa",
            category: "Chuyên khoa",
            price: 200000,
            displayPrice: "200.000 đ",
            desc: "Khám phụ khoa định kỳ và tư vấn sức khỏe sinh sản.",
            duration: "25 phút",
            doctor: "BS. Lê Thị Oanh",
            preparation: "Không khám trong kỳ kinh nguyệt.",
            rating: 4.8,
            reviews: 230,
            related: [3],
        },
        {
            id: 15,
            name: "Khám Nam Khoa",
            category: "Chuyên khoa",
            price: 250000,
            displayPrice: "250.000 đ",
            desc: "Khám và tư vấn các bệnh lý nam khoa, sức khỏe sinh sản nam.",
            duration: "30 phút",
            doctor: "BS. Trần Văn Hùng",
            preparation: "Vệ sinh vùng kín sạch sẽ trước khi khám.",
            rating: 4.7,
            reviews: 150,
            related: [5, 14],
        },

        // CẬN LÂM SÀNG (16-25)
        {
            id: 16,
            name: "Xét nghiệm máu tổng quát",
            category: "Cận lâm sàng",
            price: 150000,
            displayPrice: "150.000 đ",
            desc: "Kiểm tra công thức máu, đường huyết, chức năng gan, thận.",
            duration: "20 phút",
            doctor: "BS. Phạm Thị Dung",
            preparation: "Nhịn ăn 8-12 giờ trước xét nghiệm.",
            rating: 4.5,
            reviews: 350,
            related: [1, 7],
        },
        {
            id: 17,
            name: "Siêu âm ổ bụng tổng quát",
            category: "Cận lâm sàng",
            price: 280000,
            displayPrice: "280.000 đ",
            desc: "Siêu âm kiểm tra gan, mật, tụy, lách, thận và bàng quang.",
            duration: "25 phút",
            popular: true,
            doctor: "BS. Đỗ Văn Giang",
            preparation: "Nhịn ăn 6 giờ, uống nhiều nước và nhịn tiểu.",
            rating: 4.8,
            reviews: 320,
            related: [1, 4],
        },
        {
            id: 18,
            name: "Điện tim đồ (ECG)",
            category: "Cận lâm sàng",
            price: 120000,
            displayPrice: "120.000 đ",
            desc: "Đo điện tim để phát hiện các bất thường về tim.",
            duration: "15 phút",
            doctor: "BS. Phạm Văn Phát",
            preparation: "Nghỉ ngơi 10 phút trước khi đo.",
            rating: 4.6,
            reviews: 380,
            related: [2, 9],
        },
        {
            id: 19,
            name: "Chụp X-quang tim phổi",
            category: "Cận lâm sàng",
            price: 150000,
            displayPrice: "150.000 đ",
            desc: "Chụp X-quang đánh giá tim, phổi và lồng ngực.",
            duration: "10 phút",
            doctor: "BS. Nguyễn Thị Lan",
            preparation: "Tháo trang sức kim loại vùng cổ, ngực.",
            rating: 4.5,
            reviews: 420,
            related: [2, 19],
        },
        {
            id: 20,
            name: "Xét nghiệm nước tiểu",
            category: "Cận lâm sàng",
            price: 80000,
            displayPrice: "80.000 đ",
            desc: "Phân tích nước tiểu để đánh giá chức năng thận và đường tiết niệu.",
            duration: "15 phút",
            doctor: "BS. Trần Văn I",
            preparation: "Lấy mẫu nước tiểu đầu giờ sáng.",
            rating: 4.5,
            reviews: 290,
            related: [4, 20],
        },
        {
            id: 21,
            name: "Nội soi dạ dày",
            category: "Cận lâm sàng",
            price: 800000,
            displayPrice: "800.000 đ",
            desc: "Nội soi chẩn đoán các bệnh lý dạ dày, tá tràng.",
            duration: "30 phút",
            doctor: "BS. Phạm Văn Long",
            preparation: "Nhịn ăn ít nhất 6 giờ trước khi nội soi.",
            rating: 4.7,
            reviews: 190,
            related: [1, 13],
        },
        {
            id: 22,
            name: "Đo loãng xương",
            category: "Cận lâm sàng",
            price: 350000,
            displayPrice: "350.000 đ",
            desc: "Đo mật độ xương để chẩn đoán loãng xương.",
            duration: "20 phút",
            doctor: "BS. Trần Thị Ngọc",
            preparation: "Mặc quần áo không có kim loại.",
            rating: 4.7,
            reviews: 160,
            related: [1, 18],
        },
        {
            id: 23,
            name: "Xét nghiệm chức năng gan",
            category: "Cận lâm sàng",
            price: 180000,
            displayPrice: "180.000 đ",
            desc: "Đánh giá chức năng gan thông qua xét nghiệm máu.",
            duration: "20 phút",
            doctor: "BS. Lê Văn Tuấn",
            preparation: "Nhịn ăn 8-12 giờ trước khi lấy máu.",
            rating: 4.7,
            reviews: 250,
            related: [4, 11],
        },
        {
            id: 24,
            name: "Siêu âm tuyến giáp",
            category: "Cận lâm sàng",
            price: 200000,
            displayPrice: "200.000 đ",
            desc: "Siêu âm đánh giá tuyến giáp, phát hiện bướu cổ, nhân giáp.",
            duration: "20 phút",
            doctor: "BS. Nguyễn Thị Hoa",
            preparation: "Không cần chuẩn bị đặc biệt.",
            rating: 4.6,
            reviews: 180,
            related: [12, 16],
        },
        {
            id: 25,
            name: "Xét nghiệm HIV",
            category: "Cận lâm sàng",
            price: 100000,
            displayPrice: "100.000 đ",
            desc: "Xét nghiệm sàng lọc HIV nhanh, kết quả trong 30 phút.",
            duration: "30 phút",
            doctor: "BS. Trần Văn Sơn",
            preparation: "Không cần nhịn ăn.",
            rating: 4.8,
            reviews: 210,
            related: [5, 14],
        },

        // ĐIỀU TRỊ (26-30)
        {
            id: 26,
            name: "Vật lý trị liệu - 1 buổi",
            category: "Điều trị",
            price: 250000,
            displayPrice: "250.000 đ",
            desc: "Điều trị thần kinh-cơ xương khớp bằng vật lý trị liệu.",
            duration: "50 phút",
            doctor: "BS. Vũ Văn Em",
            preparation: "Mặc quần áo thoải mái, dễ vận động.",
            rating: 4.9,
            reviews: 130,
            related: [2, 12],
        },
        {
            id: 27,
            name: "Châm cứu - 1 buổi",
            category: "Điều trị",
            price: 200000,
            displayPrice: "200.000 đ",
            desc: "Châm cứu giảm đau và hỗ trợ điều trị các bệnh mãn tính.",
            duration: "40 phút",
            doctor: "BS. Vũ Văn Quang",
            preparation: "Mặc quần áo thoải mái, tránh ăn no trước buổi châm cứu.",
            rating: 4.6,
            reviews: 140,
            related: [5],
        },
        {
            id: 28,
            name: "Xoa bóp bấm huyệt",
            category: "Điều trị",
            price: 180000,
            displayPrice: "180.000 đ",
            desc: "Xoa bóp bấm huyệt giảm đau, thư giãn cơ thể.",
            duration: "45 phút",
            doctor: "BS. Lê Thị Mai",
            preparation: "Mặc quần áo thoải mái.",
            rating: 4.7,
            reviews: 190,
            related: [26, 27],
        },
        {
            id: 29,
            name: "Truyền dịch - 1 lần",
            category: "Điều trị",
            price: 150000,
            displayPrice: "150.000 đ",
            desc: "Truyền dịch bù nước, điện giải, vitamin.",
            duration: "60 phút",
            doctor: "BS. Nguyễn Văn Tài",
            preparation: "Không cần chuẩn bị đặc biệt.",
            rating: 4.5,
            reviews: 280,
            related: [1, 16],
        },
        {
            id: 30,
            name: "Tiêm thuốc - 1 mũi",
            category: "Điều trị",
            price: 50000,
            displayPrice: "50.000 đ",
            desc: "Tiêm bắp, tiêm dưới da theo chỉ định bác sĩ.",
            duration: "15 phút",
            doctor: "Điều dưỡng Trần Thị Nga",
            preparation: "Không cần chuẩn bị đặc biệt.",
            rating: 4.8,
            reviews: 450,
            related: [1, 16],
        },

        // GÓI DỊCH VỤ (31-35)
        {
            id: 31,
            name: "Gói Thai Sản Trọn Gói",
            category: "Gói dịch vụ",
            price: 3500000,
            displayPrice: "3.500.000 đ",
            desc: "Khám, siêu âm và tư vấn chăm sóc mẹ bầu qua 3 lần khám.",
            duration: "—",
            doctor: "BS. Lê Văn Cường",
            preparation: "Uống nhiều nước trước siêu âm.",
            rating: 4.6,
            reviews: 100,
            related: [1, 6],
        },
        {
            id: 32,
            name: "Gói kiểm tra sức khỏe định kỳ",
            category: "Gói dịch vụ",
            price: 1500000,
            displayPrice: "1.500.000 đ",
            desc: "Kiểm tra sức khỏe toàn diện với xét nghiệm và siêu âm.",
            duration: "90 phút",
            doctor: "BS. Nguyễn Thị Lan",
            preparation: "Nhịn ăn 8 giờ trước xét nghiệm.",
            rating: 4.8,
            reviews: 120,
            related: [1, 4, 7],
        },
        {
            id: 33,
            name: "Gói Tầm Soát Ung Thư Cơ Bản",
            category: "Gói dịch vụ",
            price: 2500000,
            displayPrice: "2.500.000 đ",
            desc: "Tầm soát ung thư cơ bản cho nam và nữ.",
            duration: "120 phút",
            doctor: "BS. Trần Văn Hải",
            preparation: "Nhịn ăn sáng, mang theo kết quả cũ nếu có.",
            rating: 4.7,
            reviews: 95,
            related: [1, 16, 17],
        },
        {
            id: 34,
            name: "Gói Khám Sức Khỏe Du Học",
            category: "Gói dịch vụ",
            price: 1800000,
            displayPrice: "1.800.000 đ",
            desc: "Khám sức khỏe theo yêu cầu du học các nước.",
            duration: "150 phút",
            doctor: "BS. Nguyễn Thị Hương",
            preparation: "Mang theo hồ sơ, passport, ảnh 4x6.",
            rating: 4.6,
            reviews: 80,
            related: [1, 3, 16],
        },
        {
            id: 35,
            name: "Gói Chăm Sóc Sức Khỏe Người Cao Tuổi",
            category: "Gói dịch vụ",
            price: 2000000,
            displayPrice: "2.000.000 đ",
            desc: "Khám và tư vấn sức khỏe toàn diện cho người cao tuổi.",
            duration: "120 phút",
            doctor: "BS. Lê Văn Bình",
            preparation: "Nhịn ăn sáng, mang theo thuốc đang sử dụng.",
            rating: 4.8,
            reviews: 110,
            related: [1, 6, 12],
        },

        // PHẪU THUẬT (36-38)
        {
            id: 36,
            name: "Tư vấn phẫu thuật thẩm mỹ",
            category: "Phẫu thuật",
            price: 500000,
            displayPrice: "500.000 đ",
            desc: "Tư vấn các phương pháp phẫu thuật thẩm mỹ phù hợp.",
            duration: "45 phút",
            doctor: "BS. Nguyễn Thị Hạnh",
            preparation: "Mang theo hình ảnh mong muốn nếu có.",
            rating: 4.7,
            reviews: 75,
            related: [8, 37],
        },
        {
            id: 37,
            name: "Phẫu thuật cắt amidan",
            category: "Phẫu thuật",
            price: 8000000,
            displayPrice: "8.000.000 đ",
            desc: "Phẫu thuật cắt amidan bằng phương pháp hiện đại.",
            duration: "60 phút",
            doctor: "BS. Trần Văn Dũng",
            preparation: "Nhịn ăn 8 giờ trước phẫu thuật.",
            rating: 4.8,
            reviews: 65,
            related: [11, 36],
        },
        {
            id: 38,
            name: "Phẫu thuật thoát vị đĩa đệm",
            category: "Phẫu thuật",
            price: 25000000,
            displayPrice: "25.000.000 đ",
            desc: "Phẫu thuật điều trị thoát vị đĩa đệm cột sống.",
            duration: "180 phút",
            doctor: "BS. Nguyễn Văn Mạnh",
            preparation: "Nhịn ăn 12 giờ, làm đầy đủ xét nghiệm tiền phẫu.",
            rating: 4.9,
            reviews: 45,
            related: [26, 32],
        },

        // THẨM MỸ (39-40)
        {
            id: 39,
            name: "Tư vấn thẩm mỹ da",
            category: "Thẩm mỹ",
            price: 200000,
            displayPrice: "200.000 đ",
            desc: "Tư vấn các phương pháp chăm sóc và thẩm mỹ da.",
            duration: "30 phút",
            doctor: "BS. Lê Thị Hồng",
            preparation: "Rửa mặt sạch trước khi tư vấn.",
            rating: 4.6,
            reviews: 120,
            related: [8, 36],
        },
        {
            id: 40,
            name: "Tư vấn tâm lý",
            category: "Tâm lý",
            price: 300000,
            displayPrice: "300.000 đ",
            desc: "Tư vấn tâm lý, trị liệu tâm lý các vấn đề stress, lo âu.",
            duration: "50 phút",
            doctor: "ThS. Trần Thị Liên",
            preparation: "Chuẩn bị tâm lý thoải mái.",
            rating: 4.8,
            reviews: 95,
            related: [1, 12],
        }
    ];


    // Lọc dịch vụ
    const filteredServices = SERVICES.filter((service) => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.doctor.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;

        let matchesPrice = true;
        if (priceRange !== "all") {
            if (priceRange === "low") matchesPrice = service.price < 200000;
            else if (priceRange === "medium") matchesPrice = service.price >= 200000 && service.price <= 500000;
            else if (priceRange === "high") matchesPrice = service.price > 500000;
        }

        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
    const startIndex = (currentPage - 1) * servicesPerPage;
    const paginatedServices = filteredServices.slice(startIndex, startIndex + servicesPerPage);

    // Reset trang khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm, priceRange]);

    const openModal = (service: Service) => {
        setSelectedService(service);
        setIsModalOpen(true);
        setFormData({ name: "", phone: "", date: "", time: "" });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim() || !formData.phone || !formData.date || !formData.time) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (!/^\+?[0-9]{10,12}$/.test(formData.phone)) {
            alert("Vui lòng nhập số điện thoại hợp lệ!");
            return;
        }

        // Submit success
        alert(`Đặt lịch thành công!\n\nDịch vụ: ${selectedService?.name}\nHọ tên: ${formData.name}\nSĐT: ${formData.phone}\nNgày: ${formData.date}\nGiờ: ${formData.time}\n\nCảm ơn bạn đã đặt lịch!`);
        closeModal();
    };

    const resetFilters = () => {
        setSelectedCategory("all");
        setSearchTerm("");
        setPriceRange("all");
        setCurrentPage(1);
    };

    const getRelatedServiceNames = (relatedIds: number[]) => {
        return relatedIds.map(id => {
            const service = SERVICES.find(s => s.id === id);
            return service?.name || "";
        }).filter(name => name).join(", ");
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
                {/* Hero Section với Background */}
                <section className="relative py-20 overflow-hidden min-h-[500px] flex items-center">
                    {/* Background Image với CSS */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url("/image/dat_lich.jpg")' }}
                    ></div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Content */}
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
                                        40+
                                    </div>
                                    <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">Dịch vụ</div>
                                </div>
                            </div>

                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                                        50+
                                    </div>
                                    <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">Bác sĩ</div>
                                </div>
                            </div>

                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                                        10K+
                                    </div>
                                    <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">Bệnh nhân</div>
                                </div>
                            </div>

                            <div className="text-center group">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                                        98%
                                    </div>
                                    <div className="text-sm text-white/80 uppercase tracking-wide mt-3 font-semibold">Hài lòng</div>
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
                                {categories.filter(cat => cat.id !== "all").map((category) => (
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

                    {/* Results Header */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Kết quả: <span className="text-green-600">{filteredServices.length}</span> dịch vụ
                                {selectedCategory !== "all" && ` trong ${categories.find(c => c.id === selectedCategory)?.name}`}
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
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{service.name}</h3>
                                                <p className="text-gray-600 text-sm flex items-center gap-1">
                                                    👨‍⚕️ {service.doctor}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-green-600">{service.displayPrice}</div>
                                                {service.popular && (
                                                    <span className="inline-block bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded mt-1">
                                                        Phổ biến
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 mb-4 line-clamp-2">{service.desc}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="flex items-center gap-1 text-yellow-500">
                                                ⭐ {service.rating}
                                            </span>
                                            <span className="text-gray-500 text-sm">({service.reviews} lượt đánh giá)</span>
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
                                                        <strong>Gợi ý kết hợp:</strong> {getRelatedServiceNames(service.related)}
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => openModal(service)}
                                                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                                            >
                                                Đặt lịch ngay
                                            </button>
                                            <button className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-green-500 hover:text-green-600 transition-colors">
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
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500 hover:text-green-600 transition-colors"
                            >
                                ← Trang trước
                            </button>

                            <div className="text-gray-600 font-semibold">
                                Trang <span className="text-green-600">{currentPage}</span> / <span className="text-gray-800">{totalPages}</span>
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500 hover:text-green-600 transition-colors"
                            >
                                Trang sau →
                            </button>
                        </div>
                    )}

                    {/* Background Image Section - dich_vu_kham.jpg */}
                    <div className="mt-8 w-screen -mx-4 overflow-hidden h-150">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: 'url("/image/dich_vu_kham.jpg")' }}
                        ></div>
                    </div>

                    {/* Background Image Section - my_home.jpg - GIẢM KHOẢNG CÁCH */}
                    <div className="mt-8 w-screen -mx-4 overflow-hidden h-100">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: 'url("/image/my_home.jpg")' }}
                        ></div>
                    </div>
                </section>
            </div>

            {/* Booking Modal */}
            {isModalOpen && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-8 rounded-t-2xl relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                                <span>📅</span>
                                Đặt lịch: {selectedService.name}
                            </h3>
                            <p className="text-green-100 opacity-90">
                                Giá: {selectedService.displayPrice} • Thời lượng: {selectedService.duration} • Bác sĩ: {selectedService.doctor}
                            </p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            {/* Preparation Info */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                                <p className="text-green-800 flex items-start gap-3">
                                    <span className="text-lg">💡</span>
                                    <span>
                                        <strong>Chuẩn bị:</strong> {selectedService.preparation}
                                    </span>
                                </p>
                            </div>

                            {/* Booking Form */}
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
                                        min={new Date().toISOString().split('T')[0]}
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

                                {/* Form Actions */}
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