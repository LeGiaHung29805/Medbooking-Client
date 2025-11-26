"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Layout from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Heart,
    CheckCircle,
    Hospital,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// IMPORTS API VÀ UTILS
import * as Api from "@/lib/ApiClient";
import * as Model from "@/lib/model";
// SỬA: Import DataThumbnail để dùng chung
import DataThumbnail from "@/components/thumnail/DataThumbnail";
import { getFullImageUrl } from "@/lib/utils";


// Dữ liệu ảnh tĩnh cho phần Thư viện (Slider)
const images = [
    "/image/gallery/image1.jpg",
    "/image/gallery/image2.jpg",
    "/image/gallery/image3.jpg",
    "/image/gallery/image4.jpg",
    "/image/gallery/image5.jpg",
];


export default function HospitalPage() {
    const [specialties, setSpecialties] = useState<Model.Specialty[]>([]);
    const [loading, setLoading] = useState(true);

    // Load dữ liệu từ API khi vào trang
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Api.getSpecialties();
                setSpecialties(data);
            } catch (error) {
                console.error("Lỗi tải chuyên khoa:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const showImage = (index: number) => setCurrentIndex(index);
    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevImage = () =>
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    const filtered = specialties.filter((sp) =>
        (sp.SpecialtyName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-24">
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
                            Danh sách chuyên khoa
                        </h1>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            Đang tải dữ liệu chuyên khoa...
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filtered.map((sp) => (
                                <Card
                                    key={sp.SpecialtyID}
                                    className="flex flex-col items-center p-6 hover:shadow-lg transition cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                                        {/* SỬ DỤNG DATA THUMBNAIL CHUNG ĐÃ ĐƯỢC CHUẨN HÓA */}
                                        <DataThumbnail
                                            src={sp.imageURL}
                                            alt={sp.SpecialtyName}
                                            fallbackType="specialty"
                                            className="w-full h-full rounded-full"
                                        />
                                    </div>
                                    <p className="text-center text-sm font-medium">
                                        {sp.SpecialtyName}
                                    </p>
                                </Card>
                            ))}
                            {filtered.length === 0 && (
                                <div className="col-span-full text-center text-gray-500 py-8">
                                    Không tìm thấy chuyên khoa nào.
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <Separator />
                <section>
                    <Card className="border-0 shadow-md">
                        <CardContent className="flex flex-col md:flex-row gap-8 p-6 md:p-10">
                            <div className="flex-1">
                                <Image
                                    src="/image/anh1.jpg"
                                    alt="Giới thiệu về các khoa"
                                    width={700}
                                    height={500}
                                    className="rounded-lg shadow-lg object-cover"
                                />
                            </div>

                            {/* Nội dung */}
                            <div className="flex-1 flex flex-col justify-center">
                                <h2 className="text-4xl font-bold mb-6">
                                    Giới thiệu về các khoa
                                </h2>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Trải qua hơn 20 năm phát triển không ngừng, Bệnh viện HUNRE đã
                                    khẳng định vị thế là địa chỉ y tế tin cậy của hàng triệu khách
                                    hàng. Với hệ thống 25 chuyên khoa chất lượng cao, Hồng Ngọc
                                    đáp ứng mọi nhu cầu khám chữa bệnh cho mọi độ tuổi.
                                </p>

                                <Separator className="my-4" />

                                <ul className="space-y-3">
                                    {[
                                        "Hiệu quả điều trị cao",
                                        "Đội ngũ chuyên gia đầu ngành",
                                        "Quy trình khoa học – Toàn diện – Chuyên nghiệp",
                                        "Dịch vụ cao cấp – Chi phí hợp lý",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="text-green-600 w-5 h-5 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="library bg-[#15664D] text-white rounded-lg p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <Image
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt="Thư viện ảnh"
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg object-cover"
                            />
                        </div>

                        <div className="flex-1 max-w-md space-y-4">
                            <h2 className="text-3xl font-bold">Thư viện</h2>
                            <p>
                                Thăm khám và điều trị tại Bệnh viện Đa khoa HUNRE, khách hàng sẽ
                                được trải nghiệm các dịch vụ chăm sóc sức khỏe chất lượng cao
                                đạt tiêu chuẩn quốc tế.
                            </p>
                            <div className="flex gap-4">
                                <Button variant="secondary" onClick={prevImage}>
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Trước
                                </Button>
                                <Button variant="secondary" onClick={nextImage}>
                                    Sau <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
                        {images.map((src, index) => (
                            <Button
                                key={index}
                                onClick={() => showImage(index)}
                                className={`overflow-hidden rounded-lg border-2 transition ${currentIndex === index ? "border-white" : "border-transparent"
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={`Thumb ${index}`}
                                    width={200}
                                    height={120}
                                    className="object-cover hover:scale-105 transition-transform"
                                />
                            </Button>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Vì sao chọn chúng tôi
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-6 text-center">
                            <div className="mb-4 flex justify-center">
                                <Heart className="text-red-500 w-10 h-10" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Đội ngũ bác sĩ chuyên môn cao
                            </h3>
                            <p>
                                Đội ngũ bác sĩ, chuyên gia giàu kinh nghiệm, từng công tác tại
                                nhiều bệnh viện lớn, sẵn sàng xử lý các ca bệnh khó và phức tạp.
                            </p>
                        </Card>
                        <Card className="p-6 text-center">
                            <div className="mb-4 flex justify-center">
                                <CheckCircle className="text-green-500 w-10 h-10" />
                            </div>
                            <h3 className="font-semibold mb-2">
                                Trang thiết bị y tế hiện đại
                            </h3>
                            <p>
                                Trang thiết bị nhập khẩu từ các quốc gia tiên tiến, hỗ trợ chẩn
                                đoán chính xác và đưa ra phác đồ điều trị hiệu quả.
                            </p>
                        </Card>
                        <Card className="p-6 text-center">
                            <div className="mb-4 flex justify-center">
                                <Hospital className="text-orange-500 w-10 h-10" />
                            </div>
                            <h3 className="font-semibold mb-2">Dịch vụ y tế toàn diện</h3>
                            <p>
                                Hệ thống quy trình khám, tư vấn, điều trị toàn diện; đội ngũ
                                nhân viên chuyên nghiệp, tận tâm, thân thiện.
                            </p>
                        </Card>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <h2 className="text-2xl font-bold">Những con số nổi bật</h2>
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <h3 className="text-3xl font-bold">1200+</h3>
                                <p>LUỢT THĂM KHÁM MỖI NGÀY</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold">250+</h3>
                                <p>CHUYÊN GIA</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold">20+</h3>
                                <p>NĂM THÀNH LẬP</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Image
                            src="/image/anhbacsi.jpg"
                            alt="Bác sĩ phẫu thuật"
                            width={400}
                            height={300}
                            className="rounded-lg object-cover"
                        />
                    </div>
                </section>
            </div>
        </Layout>
    );
}