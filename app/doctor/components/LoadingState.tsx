interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Đang tải dữ liệu..." }: LoadingStateProps) {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
        <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát...</p>
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  )
}