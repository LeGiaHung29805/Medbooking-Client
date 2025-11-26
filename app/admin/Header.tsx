"use client"
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [query, setQuery] = useState("");
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };
    const handleSubmit = () => {
        console.log("Search submitted:", query);
        // TODO: Redirect hoặc lọc sản phẩm
    };
    return (
        <header className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-8xl mx-auto flex justify-between items-center p-4">
                <Link href="/" className="hover:opacity-60">
                    <h1 className="text-xl font-bold">HUNRE Hospital</h1>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link href="/admin" className="hover:opacity-80">
                         Quay về trang chủ
                    </Link>
                </div>
            </div>
        </header>
    );
}
