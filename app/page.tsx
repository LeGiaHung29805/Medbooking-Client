"use client";

import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layoutBook";

export default function HomePage() {
  const [banners] = useState<string[]>([
    "/image/banner1.jpg",
    "/image/banner-doctor1.jpg",
  ]);

  const [currentBanner, setCurrentBanner] = useState(0);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Dữ liệu bác sĩ
  const doctors = [
    { name: "PGS. TS. Đào Xuân Cơ", specialty: "", experience: "Giám đốc Bệnh viện", image: "/image/bs1.jpg" },
    { name: "PGS. TS. Vũ Văn Giáp", specialty: "Trung Tâm Hô Hấp", experience: "Phó Giám đốc Bệnh viện", image: "/image/bs2.jpg" },
    { name: "PGS. TS. Nguyễn Tuấn Tùng", specialty: "Trung Tâm Huyết Học và Truyền Máu", experience: "Phó Giám đốc Bệnh viện", image: "/image/bs3.jpg" },
    { name: "PGS. TS. Đỗ Ngọc Sơn", specialty: "Giám đốc Trung tâm Hồi sức tích cực", experience: "", image: "/image/bs4.jpg" },
    { name: "PGS.TS. Phan Thu Phương", specialty: "Giám đốc - Trung tâm Hô hấp", experience: "", image: "/image/bs5.jpg" },
    { name: "TS. Nguyễn Thành Nam", specialty: "Giám đốc Trung tâm Nhi Khoa", experience: "", image: "/image/bs6.jpg" },
    { name: "PGS.TS. Nguyễn Thế Hào", specialty: "Trưởng khoa Phẫu thuật Thần kinh", experience: "", image: "/image/bs7.jpg" },
    { name: "TS. BS. Nguyễn Quang Bẩy", specialty: "Trưởng khoa Nội tiết - ĐTĐ", experience: "", image: "/image/bs8.jpg" },
    { name: "PGS. TS. Nguyễn Văn Tuấn", specialty: "Viện trưởng Viện Sức khỏe Tâm thần", experience: "", image: "/image/bs9.jpg" },
    { name: "TS. BS. Nghiêm Trung Dũng", specialty: "Giám Đốc Trung Tâm Thận TN và lọc máu", experience: "", image: "/image/bs10.jpg" },
  ];

  // Dữ liệu dịch vụ
  const services = [
    {
      id: 1,
      title: "Khám chữa bệnh đa chuyên khoa",
      image: "/image/anh1.webp",
      description: "Nội, Ngoại, Sản, Nhi, Ung bướu, Tiêu hóa, Gan mật, Răng hàm mặt, Tai mũi họng, Mắt, Tiêm chủng, Cơ xương khớp, Dinh dưỡng, Da liễu, Nội tiết, Nội thận kinh, Tim mạch, Hô hấp, Tiết niệu, Hậu môn trực tràng."
    },
    {
      id: 2,
      title: "Tầm soát dự phòng bệnh",
      image: "/image/anh2.webp",
      description: "Các gói khám sức khỏe tổng quát, tiêm chủng cho trẻ em, người lớn, tầm soát ung thư, bệnh lý tim mạch, đái tháo đường, mắt... phù hợp mọi lứa tuổi."
    },
    {
      id: 3,
      title: "Điều trị nội trú",
      image: "/image/anh3.webp",
      description: "Hệ thống phòng lưu viện hiện đại, đầy đủ tiện nghi với view Hồ Tây, giúp bệnh nhân an tâm nghỉ ngơi và phục hồi. Đội ngũ bác sĩ, điều dưỡng theo sát 24/7"
    },
    {
      id: 4,
      title: "Thai sản trọn gói",
      image: "/image/anh4.webp",
      description: "Chăm sóc mẹ và bé toàn diện từ ngày đầu mang thai đến sau sinh với các gói thai sản từ 8w - chuyên da."
    }
  ];

  // Banner tự động đổi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Auto slide cho bác sĩ
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, []);

  const getCardWidth = () => {
    const track = trackRef.current;
    if (!track) return 250;
    const firstCard = track.querySelector(".doctor-card") as HTMLElement | null;
    if (!firstCard) return 250;
    const rect = firstCard.getBoundingClientRect();
    const styles = window.getComputedStyle(firstCard);
    const ml = parseFloat(styles.marginLeft || "0");
    const mr = parseFloat(styles.marginRight || "0");
    return rect.width + ml + mr;
  };

  const startAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    autoSlideRef.current = setInterval(() => {
      if (isDraggingRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const firstCard = track.querySelector(".doctor-card") as HTMLElement | null;
      if (!firstCard) return;
      const step = getCardWidth();
      track.style.transition = "transform 0.8s cubic-bezier(0.4,0,0.2,1)";
      track.style.transform = `translate3d(-${step}px,0,0)`;

      const onEnd = () => {
        track.removeEventListener("transitionend", onEnd);
        track.style.transition = "none";
        track.style.transform = "translate3d(0,0,0)";
        track.appendChild(firstCard);
        void track.offsetHeight;
      };
      track.addEventListener("transitionend", onEnd, { once: true });
    }, 3000);
  };

  const handleMouseEnter = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) startAutoSlide();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    const track = trackRef.current;
    const transform = window.getComputedStyle(track).transform;
    scrollLeftRef.current = transform !== "none" ? new DOMMatrix(transform).m41 : 0;
    track.style.cursor = "grabbing";
    track.style.transition = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    e.preventDefault();
    const step = getCardWidth();
    const limit = step * 1.2;
    const walk = e.pageX - startXRef.current;
    const nextX = scrollLeftRef.current + walk;
    const clamped = Math.max(Math.min(nextX, limit), -limit);
    trackRef.current.style.transform = `translate3d(${clamped}px,0,0)`;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current || !trackRef.current) return;
    isDraggingRef.current = false;
    trackRef.current.style.cursor = "grab";
    const track = trackRef.current;
    const matrix = new DOMMatrix(window.getComputedStyle(track).transform);
    const currentX = matrix.m41;
    const step = getCardWidth();
    const movedCards = Math.round(-currentX / step);
    const targetX = -movedCards * step;
    track.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
    track.style.transform = `translate3d(${targetX}px,0,0)`;

    const onSnapEnd = () => {
      track.removeEventListener("transitionend", onSnapEnd);
      track.style.transition = "none";
      track.style.transform = "translate3d(0,0,0)";
      if (movedCards > 0) {
        for (let i = 0; i < movedCards; i++) {
          const first = track.querySelector(".doctor-card");
          if (first) track.appendChild(first);
        }
      } else if (movedCards < 0) {
        for (let i = 0; i < Math.abs(movedCards); i++) {
          const last = track.querySelector(".doctor-card:last-child");
          if (last) track.insertBefore(last, track.firstChild);
        }
      }
      void track.offsetHeight;
      startAutoSlide();
    };
    track.addEventListener("transitionend", onSnapEnd, { once: true });
  };

  const handleMouseLeaveTrack = () => {
    if (isDraggingRef.current) handleMouseUp();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    const track = trackRef.current;
    const transform = window.getComputedStyle(track).transform;
    scrollLeftRef.current = transform !== "none" ? new DOMMatrix(transform).m41 : 0;
    track.style.transition = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    const x = e.touches[0].pageX;
    const walk = x - startXRef.current;
    trackRef.current.style.transform = `translate3d(${scrollLeftRef.current + walk}px,0,0)`;
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  return (
    <Layout>
    <div className="container">
      {/* Banner */}
      {banners.length > 0 && (
        <section className="banner-section">
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner}
              alt={`Banner ${index + 1}`}
              className={`banner-image ${index === currentBanner ? "active" : ""}`}
            />
          ))}
          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`dot ${index === currentBanner ? "active" : ""}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Slideshow bác sĩ */}
      <div className="slideShowBacSi">
        <h2 className="slideshow-title">🏥 Đội Ngũ Bác Sĩ Chuyên Nghiệp 🏥</h2>
        <h4>Hơn 1.000 bác sĩ, đội ngũ hàng đầu cùng với hơn 4.300 nhân viên y tế tận tâm,</h4>
        <h5>sẵn sàng phục vụ và chăm sóc sức khỏe cho mỗi bệnh nhân.</h5>
        <br /><br />
        <div className="doctors-wrapper" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div 
            ref={trackRef}
            className="doctors-track"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeaveTrack}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {[...doctors, ...doctors, ...doctors].map((doctor, index) => (
              <div key={index} className="doctor-card">
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
                </div>
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-specialty">{doctor.specialty}</div>
                <div className="doctor-experience">{doctor.experience}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phần Chuyên khoa & Dịch vụ */}
      <div className="services-section">
        <h2 className="services-title">Đa Dạng Chuyên Khoa Dịch Vụ</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-image-wrapper">
                <img src={service.image} alt={service.title} className="service-image" />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phần Hệ thống máy móc */}
      <div className="equipment-section">
        <h2 className="equipment-title">HỆ THỐNG MÁY MÓC,<br />TRANG THIẾT BỊ HIỆN ĐẠI</h2>
        
        <div className="equipment-container">
          <div className="equipment-left">
            <div className="equipment-description">
              <p>Trang thiết bị phòng mổ: Phòng mổ vô khuẩn 1 chiều, máy gây mê kèm thở Drager – Fabius Plus (Đức), máy bơm tiêm điện điều chỉnh liều mê, máy phẫu thuật đúc thủy tinh thể - Phaco (Thụy Sỹ)...</p>
            </div>
            <div className="equipment-description">
              <p>Chẩn đoán hình ảnh & tầm soát chuyên sâu: Máy MRI nguyên lý H2, hệ thống chụp CT da lát cắt, hệ thống siêu âm 4D, 5D sắc nét, siêu âm đàn hồi mô gan thế hệ mới, máy do loãng xương DEXUM T...</p>
            </div>
            <div className="equipment-description">
              <p>Nội soi, tím mạch và tiêu hóa cao cấp: Nội soi tiêu hóa công nghệ MCU, NBI 5P phát hiện sớm ung thư đường tiêu hóa, điện tim 3 cần, tầm soát vi khuẩn HP qua hơi thở...</p>
            </div>
            <div className="equipment-description">
              <p>Hệ thống máy móc xét nghiệm chuyên sâu: xét nghiệm tự động Power Express, phòng lab vi sinh & sinh học phân tử hiện đại, máy phân tích thành phần cơ thể Tanita (Nhật Bản)... Cùng nhiều máy móc công nghệ hiện đại khác.</p>
            </div>
          </div>
          
          <div className="equipment-right">
            <div className="equipment-single-image">
              <img src="/image/thietbihiendai.webp" alt="Hệ thống máy móc hiện đại" />
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Banner styles */
        .banner-section {
          position: relative;
          margin-bottom: 30px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          height: 400px;
        }
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        .banner-image.active {
          opacity: 1;
          position: relative;
        }
        .banner-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .dot.active {
          background: white;
          width: 30px;
          border-radius: 6px;
        }

        /* Doctor slideshow */
        .slideShowBacSi {
          max-width: 100%;
          margin: 40px 0;
          background: #ffffff;
          padding: 50px 20px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        h4, h5 { text-align: center; margin: 5px 0; }
        .slideshow-title { text-align: center; color: #222; font-size: 32px; font-weight: bold; margin-bottom: 20px; }
        .doctors-wrapper { position: relative; height: 430px; overflow: hidden; }
        .doctors-track {
          display: flex;
          position: absolute;
          left: 0;
          transition: transform 0.8s cubic-bezier(0.4,0,0.2,1);
          cursor: grab;
          user-select: none;
          will-change: transform;
          transform: translate3d(0,0,0);
          backface-visibility: hidden;
        }
        .doctors-track:active { cursor: grabbing; }
        .doctor-card {
          min-width: 220px;
          margin: 0 15px;
          background: white;
          border-radius: 16px;
          padding: 30px 20px;
          box-shadow: 0 8px 25px rgba(143,4,4,0.15);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          flex-shrink: 0;
        }
        .doctor-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.25); }
        .doctor-image {
          width: 242px;
          height: 250px;
          margin: 0 auto 20px;
          background: #f5f6ff;
          border: 4px solid #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .doctor-image img { display: block; }
        .doctor-name { font-size: 20px; font-weight: bold; color: #333; margin-bottom: 8px; }
        .doctor-specialty { font-size: 15px; color: #666; margin-bottom: 15px; }
        .doctor-experience { font-size: 13px; color: #999; font-style: italic; }

        /* Services Section */
        .services-section {
          max-width: 100%;
          margin: 60px 0;
          padding: 50px 20px;
          background: linear-gradient(135deg, #f5f7fa 0%, #f1f1f1ff 100%);
          border-radius: 20px;
        }
        .services-title {
          text-align: center;
          color: black;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 50px;
          letter-spacing: 1px;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .service-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 3px solid #ffffffff;
          display: flex;
          flex-direction: column;
        }
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        .service-image-wrapper {
          width: 100%;
          height: 250px;
          overflow: hidden;
          position: relative;
        }
        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .service-card:hover .service-image {
          transform: scale(1.1);
        }
        .service-title {
          font-size: 20px;
          font-weight: bold;
          color: #ff6600;
          padding: 20px 20px 10px;
          text-align: center;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .service-description {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          padding: 0 20px 20px;
          text-align: justify;
          flex-grow: 1;
        }

        /* Equipment Section */

        .equipment-section {
          max-width: 100%;
          margin: 60px 0;
          padding: 60px 40px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .equipment-title {
          text-align: center;
          color: #0d6e3d;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 50px;
          line-height: 1.4;
          letter-spacing: 1px;
        }
        .equipment-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;

        }
        .equipment-left {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        .equipment-description {
          background: white;
          padding: 20px 25px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          border-left: 4px solid #0d6e3d;
          transition: all 0.3s ease;
        }
        .equipment-description:hover {
          transform: translateX(10px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }
        .equipment-description p {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: #333;
          text-align: justify;
        }
        .equipment-right {
          position: relative;
        }
        .equipment-single-image {
          width: 100%;
          height: 800px;
          border: 4px solid #0d6e3d;
          border-radius: 16px;
          overflow: hidden;
          background: white;
          box-shadow: 0 8px 30px rgba(13,110,61,0.2);
          transition: all 0.3s ease;
        }
        .equipment-single-image:hover {
          box-shadow: 0 12px 40px rgba(13,110,61,0.3);
          transform: translateY(-5px);
        }
        .equipment-single-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }
        .equipment-single-image:hover img {
          transform: scale(1.05);
        }

        @media (max-width: 1024px) {
          .equipment-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .equipment-right {
            order: -1;
          }
          .equipment-single-image {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .banner-section { height: 250px; }
          .services-title { font-size: 28px; }
          .services-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .service-card { margin: 0 10px; }
          .equipment-section {
            padding: 40px 20px;
          }
          .equipment-title {
            font-size: 28px;
          }
          .equipment-single-image {
            height: 300px;
          }
        }
      `}</style>
    </div>
 </Layout>
    
  );
}