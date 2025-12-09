import { useState } from "react"
import type React from "react"
import type { PatientDetail, MedicalExamFormData, Prescription, VitalSigns } from  "@/lib/model"

interface MedicalExamFormProps {
  patient: PatientDetail
  onClose: () => void
  onComplete: (formData: MedicalExamFormData) => void
}

const MedicalExamForm = ({ patient, onClose, onComplete }: MedicalExamFormProps) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{ medicine: '', dosage: '', frequency: '' }])
  const [formData, setFormData] = useState<MedicalExamFormData>({
    diagnosis: '',
    clinicalNotes: '',
    currentSymptoms: patient.symptoms,
    prescriptions: [],
    tests: [''],
    attachments: [],
    vitalSigns: {
      bloodPressure: '',
      heartRate: 0,
      temperature: 0,
      respiratoryRate: 0,
      spO2: 98,
      weight: 0,
      height: 0
    }
  })

  const updateVitalSign = (field: keyof VitalSigns, value: string | number) => {
  setFormData(prev => ({
    ...prev,
    vitalSigns: {
      ...prev.vitalSigns,
      [field]: value
    }
  }))
}

  const updatePrescription = (index: number, field: keyof Prescription, value: string) => {
    const updated = prescriptions.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    )
    setPrescriptions(updated)
  }

  const addPrescription = () => {
    setPrescriptions([...prescriptions, { medicine: '', dosage: '', frequency: '' }])
  }

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index))
  }

  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }))
  }

  const updateTest = (index: number, value: string) => {
    const newTests = [...formData.tests]
    newTests[index] = value
    setFormData(prev => ({ ...prev, tests: newTests }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)]
      }))
    }
  }

  const removeFile = (index: number) => {
    const newFiles = formData.attachments.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, attachments: newFiles }))
  }

  const validateForm = () => {
    if (!formData.diagnosis.trim()) {
      alert('Vui lòng nhập chẩn đoán')
      return false
    }
    return true
  }

  const handleComplete = () => {
    if (!validateForm()) return

    const validPrescriptions = prescriptions.filter(p =>
      p.medicine.trim() !== '' && p.dosage.trim() !== '' && p.frequency.trim() !== ''
    )

    const formDataWithPrescriptions = {
      ...formData,
      prescriptions: validPrescriptions
    }

    onComplete(formDataWithPrescriptions)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Tạo bệnh án - {patient.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">✕</button>
        </div>

        <div className="space-y-6">
          {/* Dấu hiệu sinh tồn */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Dấu hiệu sinh tồn</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-600">Huyết áp (mmHg)</label>
                <input
                  type="text"
                  placeholder="120/80"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => updateVitalSign('bloodPressure', e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Mạch (lần/phút)</label>
                <input
                  type="number"
                  placeholder="72"
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => updateVitalSign('heartRate', parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nhiệt độ (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => updateVitalSign('temperature', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nhịp thở (lần/phút)</label>
                <input
                  type="number"
                  placeholder="16"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={(e) => updateVitalSign('respiratoryRate', parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">SpO2 (%)</label>
                <input
                  type="number"
                  placeholder="98"
                  value={formData.vitalSigns.spO2}
                  onChange={(e) => updateVitalSign('spO2', parseInt(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Cân nặng (kg)</label>
                <input
                  type="number"
                  placeholder="65"
                  value={formData.vitalSigns.weight}
                  onChange={(e) => updateVitalSign('weight', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Chiều cao (cm)</label>
                <input
                  type="number"
                  placeholder="170"
                  value={formData.vitalSigns.height}
                  onChange={(e) => updateVitalSign('height', parseFloat(e.target.value) || 0)}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Triệu chứng hiện tại */}
          <div>
            <label className="block text-sm font-medium mb-2">Triệu chứng hiện tại *</label>
            <textarea
              value={formData.currentSymptoms}
              onChange={(e) => setFormData(prev => ({ ...prev, currentSymptoms: e.target.value }))}
              className="w-full border rounded-lg p-3 h-20"
              placeholder="Mô tả triệu chứng hiện tại của bệnh nhân..."
            />
          </div>

          {/* Chẩn đoán */}
          <div>
            <label className="block text-sm font-medium mb-2">Chẩn đoán *</label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
              className="w-full border rounded-lg p-3 h-20"
              placeholder="Nhập chẩn đoán..."
            />
          </div>

          {/* Ghi chú lâm sàng */}
          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú lâm sàng</label>
            <textarea
              value={formData.clinicalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
              className="w-full border rounded-lg p-3 h-32"
              placeholder="Nhập ghi chú lâm sàng..."
            />
          </div>

          {/* Đơn thuốc */}
          <div>
            <label className="block text-sm font-medium mb-2">Đơn thuốc</label>
            {prescriptions.map((prescription, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Tên thuốc"
                  value={prescription.medicine}
                  onChange={(e) => updatePrescription(index, 'medicine', e.target.value)}
                  className="col-span-5 border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Liều lượng"
                  value={prescription.dosage}
                  onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                  className="col-span-3 border rounded p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Cách dùng"
                  value={prescription.frequency}
                  onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                  className="col-span-3 border rounded p-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removePrescription(index)}
                  className="col-span-1 text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPrescription}
              className="text-blue-600 text-sm"
            >
              + Thêm thuốc
            </button>
          </div>

          {/* Chỉ định */}
          <div>
            <label className="block text-sm font-medium mb-2">Chỉ định</label>
            {formData.tests.map((test, index) => (
              <input
                key={index}
                type="text"
                value={test}
                onChange={(e) => updateTest(index, e.target.value)}
                className="w-full border rounded-lg p-3 mb-2"
                placeholder="Ví dụ: Chụp X-quang ngực..."
              />
            ))}
            <button
              onClick={addTest}
              className="text-blue-600 text-sm"
            >
              + Thêm chỉ định
            </button>
          </div>

          {/* Tải lên kết quả */}
          <div>
            <label className="block text-sm font-medium mb-2">Tải lên kết quả</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileUpload}
              className="w-full border rounded-lg p-3"
            />
            <div className="mt-2 space-y-1">
              {formData.attachments.map((file, index) => (
                <div key={index} className="text-sm text-gray-600 flex justify-between">
                  <span>{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleComplete}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Hoàn tất khám
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}

export default MedicalExamForm