import { MedicalRecord } from "./types"

interface MedicalRecordsTabProps {
  medicalRecords: MedicalRecord[]
  handleViewMedicalRecord: (id: number) => void
  generatePrescriptionPDF: (record: MedicalRecord) => void
}

const MedicalRecordsTab = ({ 
  medicalRecords, 
  handleViewMedicalRecord, 
  generatePrescriptionPDF 
}: MedicalRecordsTabProps) => {
  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Quản lý bệnh án ({medicalRecords.length})</h2>
      <div className="space-y-4">
        {medicalRecords.map((record) => (
          <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{record.patientName}</h3>
                <p className="text-sm text-slate-600">{record.age} tuổi • {new Date(record.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'completed'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
                }`}>
                {record.status === 'completed' ? 'Đã hoàn thành' : 'Đang xử lý'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Chẩn đoán:</p>
                <p className="text-sm text-slate-600">{record.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Điều trị:</p>
                <p className="text-sm text-slate-600">{record.treatment}</p>
              </div>
            </div>
            {record.prescriptions.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-slate-700 mb-1">Đơn thuốc:</p>
                <div className="text-sm text-slate-600">
                  {record.prescriptions.map((pres, index) => (
                    <div key={index} className="flex gap-2">
                      <span>• {pres.medicine}</span>
                      <span>{pres.dosage}</span>
                      <span>({pres.frequency})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleViewMedicalRecord(record.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Xem chi tiết
              </button>
              <button
                onClick={() => generatePrescriptionPDF(record)}
                className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-100 transition-colors"
              >
                In đơn thuốc
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MedicalRecordsTab