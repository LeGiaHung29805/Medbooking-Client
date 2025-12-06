// app/Doctor/Header.tsx
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm bệnh nhân, lịch hẹn..."
            className="pl-10 pr-4 py-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-3 hover:bg-gray-100 rounded-full transition">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full shadow-lg"></div>
      </div>
    </header>
  );
}