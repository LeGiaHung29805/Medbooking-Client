// // app/components/InPrescriptionPDF.tsx
// 'use client';
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import type { MedicalRecord } from "@/lib/model";

// export const generatePrescriptionPDF = (record: MedicalRecord) => {
//   const doc = new jsPDF();

//   // Tiêu đề
//   doc.setFont("times", "bold");
//   doc.setFontSize(20);
//   doc.text("ĐƠN THUỐC", 105, 30, { align: "center" });

//   // Thông tin bệnh nhân
//   doc.setFontSize(12);
//   doc.setFont("times", "normal");
//   doc.text(`Bệnh nhân: ${record.patientName}`, 20, 50);
//   doc.text(`Chẩn đoán: ${record.diagnosis}`, 20, 60);
//   doc.text(`Ngày khám: ${new Date().toLocaleDateString("vi-VN")}`, 20, 70);

//   // Bảng thuốc
//   const tableData = record.prescriptions.map(p => [
//     p.medicine,
//     p.dosage,
//     p.frequency
//   ]);

//   (doc as any).autoTable({
//     head: [["Tên thuốc", "Liều lượng", "Tần suất"]],
//     body: tableData,
//     startY: 90,
//     theme: "grid"
//   });

//   // Chữ ký bác sĩ
//   doc.setFontSize(12);
//   doc.text("Bác sĩ điều trị", 140, doc.lastAutoTable.finalY + 40);
//   doc.text("Nguyễn Văn A", 140, doc.lastAutoTable.finalY + 50);

//   doc.save(`Don_thuoc_${record.patientName.replace(/ /g, "_")}.pdf`);
// };