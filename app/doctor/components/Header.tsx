import { useEffect, useState } from "react";

export default function Header() {
  const [doctorName, setDoctorName] = useState("Bác sĩ");

  useEffect(() => {
    const loadName = () => {
      const info = localStorage.getItem("doctorInfo");
      if (info) {
        try {
          const parsed = JSON.parse(info);
          setDoctorName(parsed.FullName || "Bác sĩ");
        } catch {}
      }
    };

    loadName();
    window.addEventListener("doctorInfoUpdated", loadName);
    window.addEventListener("storage", loadName);

    return () => {
      window.removeEventListener("doctorInfoUpdated", loadName);
      window.removeEventListener("storage", loadName);
    };
  }, []);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
    </header>
  );
}