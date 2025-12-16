import Image from "next/image";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-700 mt-16">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              <Image
                src="/image/HUNRE_LOGO.svg"
                alt="Bệnh viện HUNRE"
                width={200}
                height={75}
                className="h-16 md:h-18 w-auto object-contain mb-3"
              />
            </Link>

            <div className="space-y-2.5 text-sm leading-relaxed">
              <h3 className="font-bold text-sm text-gray-900 mb-2">
                CÔNG TY TNHH TỔ HỢP Y TẾ
              </h3>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-wide mt-0.5">
                    ĐKKD:
                  </span>
                  <span className="text-gray-800 font-medium">0101816147</span>
                </div>

                <div className="flex items-start gap-2 group hover:text-green-600 transition-colors">
                  <MapPin
                    size={15}
                    className="text-green-600 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-gray-700 group-hover:text-green-600 transition-colors">
                    P. Phú Diễn, Hà Nội
                  </span>
                </div>

                <div className="flex items-start gap-2 group hover:text-green-600 transition-colors">
                  <Mail
                    size={15}
                    className="text-green-600 mt-0.5 flex-shrink-0"
                  />
                  <a
                    href="mailto:info.benhvienABCD@gmail.com"
                    className="text-gray-700 group-hover:text-green-600 transition-colors break-all"
                  >
                    info.benhvienABCD@gmail.com
                  </a>
                </div>

                {/* Hotline section - Compact */}
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                    Tổng đài tư vấn
                  </p>
                  <a
                    href="tel:19001806"
                    className="inline-flex items-center gap-1.5 text-xl font-bold text-green-700 hover:text-green-800 transition-all duration-200 hover:scale-105 group"
                  >
                    <Phone
                      size={18}
                      className="group-hover:rotate-12 transition-transform"
                    />
                    <span>19001806</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours - Cards nhỏ hơn */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-green-600" />
              <h3 className="font-bold text-sm text-gray-900">Giờ làm việc</h3>
            </div>

            <div className="space-y-2 text-sm">
              {/* Working hours cards - Compact */}
              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
                <span className="text-gray-600 text-xs font-medium group-hover:text-green-600 transition-colors">
                  Khám Nội:
                </span>
                <span className="font-semibold text-gray-900 text-xs">
                  6h30 - 19h
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
                <span className="text-gray-600 text-xs font-medium group-hover:text-green-600 transition-colors">
                  Khám Sản:
                </span>
                <span className="font-semibold text-gray-900 text-xs">
                  7h - 19h
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
                <span className="text-gray-600 text-xs font-medium group-hover:text-green-600 transition-colors">
                  Khám Nhi, TMH:
                </span>
                <span className="font-semibold text-gray-900 text-xs">
                  7h30 - 19h
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
                <span className="text-gray-600 text-xs font-medium group-hover:text-green-600 transition-colors">
                  Chủ nhật:
                </span>
                <span className="font-semibold text-gray-900 text-xs">
                  6h30 - 16h30
                </span>
              </div>

              {/* Emergency section - Compact */}
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group">
                <span className="text-red-700 font-bold text-xs flex items-center gap-2 group-hover:scale-105 transition-transform">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                  Cấp cứu:
                </span>
                <span className="font-bold text-red-600 text-base">24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Social - Compact */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">
              Liên kết nhanh
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:translate-x-1 transition-all duration-200 group"
                >
                  <span className="w-1 h-1 bg-green-600 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="font-medium text-xs">Giới thiệu</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:translate-x-1 transition-all duration-200 group"
                >
                  <span className="w-1 h-1 bg-green-600 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="font-medium text-xs">
                    Chính sách bảo mật
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:translate-x-1 transition-all duration-200 group"
                >
                  <span className="w-1 h-1 bg-green-600 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="font-medium text-xs">
                    Điều khoản sử dụng
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 hover:translate-x-1 transition-all duration-200 group"
                >
                  <span className="w-1 h-1 bg-green-600 rounded-full group-hover:scale-150 transition-transform"></span>
                  <span className="font-medium text-xs">Liên hệ</span>
                </Link>
              </li>
            </ul>

            {/* Social Media - Compact */}
            <div className="pt-4">
              <h4 className="text-xs font-bold text-gray-900 mb-3">
                Kết nối với chúng tôi
              </h4>
              <div className="flex gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-blue-600 hover:text-white text-gray-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-gray-100"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-red-600 hover:text-white text-gray-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-gray-100"
                  aria-label="YouTube"
                >
                  <FaYoutube size={18} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-black hover:text-white text-gray-600 transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-gray-100"
                  aria-label="TikTok"
                >
                  <FaTiktok size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter - Compact */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">
              Đăng ký nhận ưu đãi
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed">
              Đăng ký ngay để nhận thông tin về các chương trình khuyến mãi và
              tin tức y tế mới nhất từ HUNRE.
            </p>

            <form className="space-y-2.5">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full pl-3 pr-3 py-2 h-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-xs hover:border-gray-300"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 h-10 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Đăng ký ngay</span>
                <Send
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </form>

            <p className="text-xs text-gray-500 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
              >
                chính sách bảo mật
              </Link>{" "}
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Compact */}
      <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 md:px-6 py-3.5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <p className="text-gray-400 text-center md:text-left">
              © {currentYear} Bệnh viện HUNRE. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-gray-400">
              <Link
                href="/sitemap"
                className="hover:text-white transition-colors duration-200"
              >
                Sitemap
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
