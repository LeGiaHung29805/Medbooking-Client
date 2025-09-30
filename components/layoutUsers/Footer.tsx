
import Image from "next/image";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 px-6 py-10 mt-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <Image
                        src="/image/HUNRE_Logo.png"
                        alt="Bệnh viện HUNRE"
                        width={160}
                        height={64}
                        className="mb-4 object-contain"
                    />
                    <p className="text-sm font-semibold">CÔNG TY TNHH TỔ HỢP Y TẾ</p>
                    <p className="text-sm">ĐKKD số: 0101816147</p>
                    <p className="text-sm">ĐC: P. Phú Diễn, Hà Nội</p>
                    <p className="text-sm">Email: info.benhvienABCD@gmail.com</p>
                    <p className="text-sm">Tổng đài tư vấn: <span className="font-bold">19001806</span></p>
                </div>

                <div>
                    <h3 className="font-bold mb-2">Giờ làm việc</h3>
                    <p className="text-sm">Khám Nội: 6h30 - 19h</p>
                    <p className="text-sm">Khám Sản: 7h - 19h</p>
                    <p className="text-sm">Khám Nhi, TMH: 7h30 - 19h</p>
                    <p className="text-sm">Chủ nhật: 6h30 - 16h30</p>
                    <p className="text-sm">Cấp cứu: 24/7</p>
                </div>

                <div>
                    <h3 className="font-bold mb-2">Liên kết</h3>
                    <ul className="space-y-1 text-sm">
                        <li><a href="...." className="hover:text-blue-600">Chính sách bảo mật</a></li>
                        <li><a href="...." className="hover:text-blue-600">Giới thiệu</a></li>
                        <li><a href="...." className="hover:text-blue-600">Liên hệ</a></li>
                    </ul>
                    <div className="flex space-x-3 mt-3 text-xl">
                        <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
                        <a href="#" className="hover:text-red-600"><FaYoutube /></a>
                        <a href="#" className="hover:text-black"><FaTiktok /></a>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-2">Đăng ký nhận ưu đãi</h3>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Nhập email"
                            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                        >
                            Gửi
                        </button>
                    </form>
                </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
                <a
                    href="tel:19001806"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                    Gọi hotline 19001806
                </a>
                <a
                    href="....."
                    className="bg-orange-500 text-white px-5 py-2 rounded-lg shadow hover:bg-orange-600"
                >
                    Đặt lịch khám
                </a>
            </div>
        </footer>
    );
}
