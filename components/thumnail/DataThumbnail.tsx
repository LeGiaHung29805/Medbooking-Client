"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getFullImageUrl } from "@/lib/utils";
interface DataThumbnailProps {
  src?: string | null;
  alt?: string;
  fallbackType?: "user" | "doctor" | "service" | "specialty" | "default";
  className?: string;
}

// Link ảnh placeholder mặc định cho từng loại
const PLACEHOLDERS = {
  user: "https://placehold.co/100x100?text=User",
  doctor: "https://placehold.co/100x100?text=Dr",
  service: "https://placehold.co/100x100?text=DV",
  specialty: "https://placehold.co/100x100?text=CK",
  default: "https://placehold.co/100x100?text=IMG",
};

export default function DataThumbnail({
  src,
  alt = "Thumbnail",
  fallbackType = "default",
  className = "w-10 h-10 rounded-lg",
}: DataThumbnailProps) {
  //Xử lý link ảnh thật
  const initialSrc = src ? getFullImageUrl(src) : PLACEHOLDERS[fallbackType];
  const [imgSrc, setImgSrc] = useState(initialSrc);

  //Reset khi props thay đổi
  useEffect(() => {
    setImgSrc(src ? getFullImageUrl(src) : PLACEHOLDERS[fallbackType]);
  }, [src, fallbackType]);

  // Fallback UI Avatar nếu không có ảnh (Dành cho User/Doctor)
  // Nếu src rỗng mà là user/doctor -> Dùng ui-avatars tạo ảnh theo tên
  useEffect(() => {
    if (!src && (fallbackType === "user" || fallbackType === "doctor")) {
      setImgSrc(
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          alt
        )}&background=random`
      );
    }
  }, [src, alt, fallbackType]);

  return (
    <div
      className={`relative border overflow-hidden bg-gray-100 flex-shrink-0 ${className}`}
    >
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50px"
        className="object-cover"
        onError={() => setImgSrc(PLACEHOLDERS[fallbackType])}
        unoptimized={false}
      />
    </div>
  );
}
