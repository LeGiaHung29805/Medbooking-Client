import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-6 bg-gray-100">{children}</main>
            <Footer />
            <a
                href={`tel:${process.env.NEXT_PUBLIC_HOTLINE?.split(" ")}`}
                className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-3 flex items-center space-x-2 shadow-lg z-50 animate-bounce"
                title="Gọi ngay"
            >
                {/* Icon điện thoại */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.21 1.09l-2.2 2.2a11.042 11.042 0 005.515 5.515l2.2-2.2a1 1 0 011.09-.21l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                    />
                </svg>

                {/* Số điện thoại */}
                <span className="font-bold">{process.env.NEXT_PUBLIC_HOTLINE}</span>
            </a>
        </div>
    );
}
