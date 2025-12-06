interface SettingsTabProps {
  doctorInfo: {
    name: string
    specialty: string
    email: string
    phone: string
  }
  handleInputChange: (field: string, value: string) => void
  handleSaveChanges: () => void
}

const SettingsTab = ({ doctorInfo, handleInputChange, handleSaveChanges }: SettingsTabProps) => {
  return (
    <div className="bg-white rounded-2xl shadow border p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Cài đặt</h2>
      <div className="space-y-6">
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Thông tin cá nhân</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
              <input
                type="text"
                value={doctorInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chuyên khoa</label>
              <input
                type="text"
                value={doctorInfo.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={doctorInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={doctorInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleSaveChanges}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>

        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Đổi mật khẩu</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab