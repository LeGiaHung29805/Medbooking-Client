"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Layout from "@/components/layout";

export default function HomePage() {
  const [banners] = useState<string[]>([
    "/image/banner1.jpg",
    "/image/Vi-suc-khoe-toan-dan.jpg",
  ]);

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <Layout>
      {banners.length > 0 && (
        <section className="relative mb-6 rounded-lg overflow-hidden shadow-lg">
          {banners.map((banner, index) => (
            <Image
              key={index}
              src={banner}
              alt={`Banner ${index + 1}`}
              width={1200}
              height={400}
              priority
              className={`w-full h-80 object-cover transition-opacity duration-1000 ${index === currentBanner
                ? "opacity-100"
                : "opacity-0 absolute top-0 left-0"
                }`}
            />
          ))}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentBanner ? "bg-white" : "bg-gray-400"
                  }`}
              />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
