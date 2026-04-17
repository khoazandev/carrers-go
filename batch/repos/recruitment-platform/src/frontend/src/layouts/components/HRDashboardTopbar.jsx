import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, Moon, Sun, Search, Home, LogOut, User } from "lucide-react";
import { cn } from "@shared/utils/cn";
import { useTheme } from "@app/providers/ThemeProvider";
import useAuthStore from "@app/store/authStore";
import { useLogout } from "@features/auth";

const ROUTE_LABELS = {
    "/hr/dashboard": "Tổng quan",
    "/hr/jobs": "Tin tuyển dụng",
    "/hr/candidates": "Quản lý ứng viên",
    "/hr/company": "Hồ sơ công ty",
    "/hr/profile": "Hồ sơ cá nhân",
};

export function HRDashboardTopbar({ onToggleSidebar }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { mutate: logoutAPI } = useLogout();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const pageLabel = Object.entries(ROUTE_LABELS).find(([key]) =>
        key === "/hr/dashboard" ? pathname === "/hr/dashboard" : pathname.startsWith(key)
    )?.[1] ?? "Dashboard";

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logoutAPI();
    };

    const fullName = user?.profile?.fullName || "HR User";
    const initial = fullName.charAt(0).toUpperCase();

    return (
        <header
            className={cn(
                "sticky top-0 z-20 flex items-center h-[72px] px-6 gap-4",
                "bg-white/95 dark:bg-[#141A21]/90 backdrop-blur-2xl",
                "border-b border-[rgba(145,158,171,0.08)] dark:border-white/[0.04]"
            )}
        >
            <button
                onClick={onToggleSidebar}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white hover:bg-[rgba(145,158,171,0.08)] transition-all"
                aria-label="Toggle sidebar"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1">
                <h1 className="text-[15px] font-bold text-[#1C252E] dark:text-white">
                    {pageLabel}
                </h1>
                <p className="text-[12px] text-[#919EAB] font-medium">SmartHire Dashboard</p>
            </div>

            <div className="hidden md:flex items-center gap-2.5 bg-[#F4F6F8] dark:bg-white/[0.04] rounded-2xl px-4 py-2.5 w-56 border border-transparent hover:border-[rgba(145,158,171,0.2)] dark:hover:border-white/[0.1] cursor-pointer transition-all group">
                <Search className="w-4 h-4 text-[#919EAB] group-hover:text-[#0EA5E9] transition-colors" />
                <span className="text-[13px] text-[#919EAB] font-medium">Tìm kiếm...</span>
            </div>

            {/* Dark mode toggle */}
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white hover:bg-[rgba(145,158,171,0.08)] transition-all flex-shrink-0"
                aria-label="Toggle dark mode"
            >
                {mounted ? (
                    theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
                ) : (
                    <div className="w-5 h-5" />
                )}
            </button>

            {/* Notifications */}
            <button
                onClick={() => navigate('/hr/notifications')}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white hover:bg-[rgba(145,158,171,0.08)] transition-all flex-shrink-0"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#0EA5E9] border-2 border-white dark:border-[#141A21] shadow-[0_0_6px_rgba(14,165,233,0.4)]" />
            </button>

            {/* Avatar Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative block rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:ring-offset-2 dark:focus:ring-offset-[#141A21]"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white font-bold border-2 border-[#0EA5E9]/20 hover:border-[#0EA5E9]/50 transition-colors">
                        {initial}
                    </div>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1C252E] rounded-2xl shadow-[0_20px_60px_rgba(145,158,171,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[rgba(145,158,171,0.08)] dark:border-white/[0.04] overflow-hidden z-50">
                        <div className="px-5 py-5 border-b border-[rgba(145,158,171,0.08)] dark:border-white/[0.04] flex flex-col items-center bg-gradient-to-b from-[rgba(145,158,171,0.03)] to-transparent dark:from-white/[0.02]">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-[0_4px_16px_rgba(14,165,233,0.3)] border-2 border-white dark:border-[#1C252E]">
                                {initial}
                            </div>
                            <p className="text-[14px] font-bold text-[#1C252E] dark:text-white">{fullName}</p>
                            <p className="text-[12px] text-[#919EAB] truncate w-full text-center mt-0.5">{user?.email || "hr@smarthire.com"}</p>
                        </div>

                        <div className="py-2 px-2">
                            <button onClick={() => { navigate('/hr/profile'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-xl text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.06)] hover:text-[#1C252E] dark:hover:text-white transition-colors">
                                <User className="w-4 h-4" />
                                <span>Hồ sơ cá nhân</span>
                            </button>
                            <button onClick={() => { navigate('/'); setIsDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-xl text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.06)] hover:text-[#1C252E] dark:hover:text-white transition-colors">
                                <Home className="w-4 h-4" />
                                <span>Trang chủ cổng ứng viên</span>
                            </button>
                        </div>

                        <div className="p-3 border-t border-[rgba(145,158,171,0.08)] dark:border-white/[0.04]">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-[#FF5630] bg-[#FF5630]/8 hover:bg-[#FF5630]/15 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
