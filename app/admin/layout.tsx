"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [showLoginModal, setShowLoginModal] = useState(true);

    useEffect(() => {
        // Tìm token trong localStorage (key trong hệ thống là 'api_token')
        const token = localStorage.getItem('api_token'); 
        if (!token) {
            router.push('/login');
        } else {
            setShowLoginModal(false);
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            {!showLoginModal && children}
        </div>
    );
}
