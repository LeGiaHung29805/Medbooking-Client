"use client";

import LoginModal from "@/components/admin/LoginModal";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const [showLoginModal, setShowLoginModal] = useState(false);
    useEffect(() => {
        const storedDate = localStorage.getItem('isLoggedIn');
        if (storedDate) {
            const localDate = dayjs(storedDate);
            const now = dayjs();
            const diffInDays = Math.abs(now.diff(localDate, 'day', true)); if (diffInDays < 3) {
                setShowLoginModal(false);
                return;
            }
        }
        setShowLoginModal(true);
    }, []);

    const handleShowModal = () => {
        setShowLoginModal(true);
    };// Hàm xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        handleShowModal();
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            {!showLoginModal ? (
                children
            ) : (
                <LoginModal onLoginSuccess={() => setShowLoginModal(false)} />
            )}
        </div>
    );
}
