interface ErrorStateProps {
  message?: string
}

export default function ErrorState({ message = "Không tìm thấy thông tin bác sĩ" }: ErrorStateProps) {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  )
}