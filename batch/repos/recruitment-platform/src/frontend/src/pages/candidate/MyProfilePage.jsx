import { useCallback, useState } from 'react'
import {
  useGetProfile,
  useUpdateProfile,
  useUploadAvatar,
  useChangePassword,
  BasicInfoForm,
  CandidateInfoForm,
  ChangePasswordForm,
  HrInfoForm,
  ProfileCompletionProgress,
} from '@features/profile'
import { LoadingSpinner } from '@shared/components'
import useAuthStore from '@app/store/authStore'
import { ROLES } from '@shared/constants'
import { Camera, CheckCircle2, Mail, Phone, MapPin, User, Shield, Briefcase, ChevronRight } from 'lucide-react'
import { cn } from '@shared/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function MyProfilePage() {
  const user = useAuthStore((state) => state.user)
  const { data: profile, isLoading } = useGetProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const [activeTab, setActiveTab] = useState('info')

  const isCandidate = user?.role === ROLES.CANDIDATE
  
  const handleAvatarUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ tải lên file hình ảnh')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh vượt quá giới hạn 5MB')
        return
      }
      uploadAvatar(file)
    }
  }, [uploadAvatar])

  const handleProfileSubmit = useCallback((data) => updateProfile(data), [updateProfile])

  if (isLoading) return <LoadingSpinner fullScreen />
  if (!profile) return <div className="p-8 text-center text-[#637381] dark:text-[#919EAB]">Không thể tải thông tin.</div>

  const TABS = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'job', label: isCandidate ? 'Hồ sơ tìm việc' : 'Thông tin nhân sự', icon: Briefcase },
    { id: 'security', label: 'Bảo mật tài khoản', icon: Shield },
  ]

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12">
      
      {/* ── Profile Header (Cover + Avatar + Info) giống Smarthire ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white dark:bg-[#1C252E] rounded-3xl overflow-hidden border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(145,158,171,0.12)] dark:shadow-none transition-all mb-8"
      >
        {/* Cover Banner */}
        <div className="h-40 md:h-56 relative bg-gradient-to-br from-[#1C252E] to-[#0A0F14]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#22c55e]/40 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[#10b981]/30 to-transparent rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Profile Info Overlapping */}
        <div className="px-6 md:px-10 pb-8 md:pb-10 -mt-20 md:-mt-24 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1 min-w-0 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            
            {/* Avatar with Upload */}
            <div className="relative group shrink-0">
              <label 
                className={cn(
                  "block h-32 w-32 md:h-40 md:w-40 rounded-3xl border-[6px] border-white dark:border-[#1C252E] overflow-hidden shadow-2xl bg-white dark:bg-[#1C252E] relative cursor-pointer",
                  isUploading && "opacity-50 pointer-events-none"
                )}
              >
                {profile?.profile?.avatar ? (
                  <img
                    src={profile.profile.avatar}
                    alt={profile?.profile?.fullName || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-extrabold text-[#22c55e] bg-gradient-to-br from-[#22c55e]/10 to-transparent">
                    {(profile?.profile?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-8 h-8 text-white" />
                  <span className="text-sm font-semibold text-white">
                    {isUploading ? "Đang tải..." : (profile?.profile?.avatar ? "Đổi ảnh đại diện" : "Thêm ảnh")}
                  </span>
                </div>
                
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </label>

              {/* Online / Role indicator */}
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-gradient-to-br from-[#22c55e] to-[#10b981] border-4 border-white dark:border-[#1C252E] rounded-full shadow-lg" title={isCandidate ? "Ứng viên" : "Nhà tuyển dụng"} />
            </div>

            {/* Name & Title */}
            <div className="text-center md:text-left flex-1 min-w-0 pb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 justify-center md:justify-start">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#1C252E] dark:text-white truncate">
                  {profile?.profile?.fullName || "Chưa cập nhật tên"}
                </h1>
                <CheckCircle2 className="w-7 h-7 text-[#22c55e] fill-[#22c55e]/20 hidden md:block shrink-0" />
              </div>
              <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#22c55e] to-[#10b981] mt-1.5 inline-block">
                 {isCandidate ? "Ứng viên" : "Nhà tuyển dụng / HR"}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-3 gap-x-6 mt-4 text-[15px] font-medium text-[#637381] dark:text-[#919EAB]">
                <span className="flex items-center gap-2.5 bg-[#F4F6F8] dark:bg-[rgba(145,158,171,0.08)] px-3 py-1.5 rounded-lg border border-[rgba(145,158,171,0.12)]">
                  <Mail className="w-4 h-4 text-[#1C252E] dark:text-white" />
                  {user?.email}
                </span>
                {profile?.profile?.phone && (
                  <span className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#1C252E] dark:text-white" />
                    {profile.profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Main Content Area ── */}
      <div className="flex flex-col xl:flex-row gap-8 items-start relative">
        
        {/* Navigation Sidebar */}
        <div className="w-full xl:w-[280px] shrink-0 xl:sticky xl:top-[120px] flex flex-col gap-6">
          {/* Progress */}
          <ProfileCompletionProgress profile={profile?.profile} role={user?.role} />

          {/* Vertical Tabs */}
          <div className="bg-white dark:bg-[#1C252E] rounded-3xl p-4 border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(145,158,171,0.06)] dark:shadow-none flex flex-col gap-1 hidden md:flex">
             {TABS.map((tab) => {
               const Icon = tab.icon
               const isActive = activeTab === tab.id
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                     "flex items-center justify-between w-full p-4 rounded-2xl text-left transition-all",
                     isActive 
                       ? "bg-[#22c55e]/10 text-[#22c55e] font-bold" 
                       : "text-[#637381] dark:text-[#919EAB] font-semibold hover:bg-[#F4F6F8] dark:hover:bg-[rgba(145,158,171,0.08)] hover:text-[#1C252E] dark:hover:text-white"
                   )}
                 >
                   <div className="flex items-center gap-3">
                     <Icon className="w-5 h-5" />
                     {tab.label}
                   </div>
                   {isActive && <ChevronRight className="w-5 h-5" />}
                 </button>
               )
             })}
          </div>

          {/* Mobile Horizontal Tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
             {TABS.map((tab) => {
               const Icon = tab.icon
               const isActive = activeTab === tab.id
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={cn(
                     "flex shrink-0 items-center gap-2 px-5 py-3 rounded-full text-sm transition-all",
                     isActive 
                       ? "bg-[#22c55e] text-white font-bold shadow-lg shadow-green-500/25" 
                       : "bg-white dark:bg-[#1C252E] text-[#637381] dark:text-[#919EAB] font-semibold border border-[rgba(145,158,171,0.12)]"
                   )}
                 >
                   <Icon className="w-4 h-4" />
                   {tab.label}
                 </button>
               )
             })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="w-full flex-1 flex flex-col gap-6 min-w-0">
          <AnimatePresence mode="wait">
            
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#1C252E] rounded-3xl p-6 md:p-10 border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(145,158,171,0.08)] dark:shadow-none overflow-hidden"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white">Thông tin cơ bản</h2>
                  <p className="text-[#637381] dark:text-[#919EAB] mt-1 text-sm">Cập nhật thông tin giao tiếp và danh tính của bạn.</p>
                </div>
                <BasicInfoForm
                  initialData={profile?.profile}
                  onSubmit={handleProfileSubmit}
                  isPending={isUpdating}
                />
              </motion.div>
            )}

            {activeTab === 'job' && (
              <motion.div
                key="job"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#1C252E] rounded-3xl p-6 md:p-10 border border-[rgba(145,158,171,0.12)] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(145,158,171,0.08)] dark:shadow-none overflow-hidden"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white">
                    {isCandidate ? 'Thông tin ứng viên' : 'Thông tin công việc'}
                  </h2>
                  <p className="text-[#637381] dark:text-[#919EAB] mt-1 text-sm">
                    {isCandidate ? 'Chi tiết chuyên môn và sở thích việc làm.' : 'Thông tin vai trò tuyển dụng của bạn trong hệ thống.'}
                  </p>
                </div>
                {isCandidate ? (
                  <CandidateInfoForm
                    initialData={profile?.profile}
                    onSubmit={handleProfileSubmit}
                    isPending={isUpdating}
                  />
                ) : (
                  <HrInfoForm
                    initialData={profile?.profile}
                    onSubmit={handleProfileSubmit}
                    isPending={isUpdating}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#1C252E] rounded-3xl p-6 md:p-10 shadow-[0_4px_24px_rgba(255,86,48,0.12)] dark:shadow-[0_4px_24px_rgba(255,86,48,0.06)] border border-red-500/20 overflow-hidden"
              >
                 <div className="mb-8">
                   <h2 className="text-2xl font-bold text-[#FF5630] flex items-center gap-3">
                     <Shield className="w-7 h-7" /> Bảo mật tài khoản
                   </h2>
                   <p className="text-sm text-[#637381] dark:text-[#919EAB] mt-2 font-medium">Hãy sử dụng mật khẩu mạnh kết hợp số và ký tự đặc biệt để bảo vệ tài khoản.</p>
                 </div>
                 <ChangePasswordForm
                  onSubmit={changePassword}
                  isPending={isChangingPassword}
                 />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
