import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Building2,
    Users,
    ChevronLeft,
    ChevronRight,
    Rocket,
    User,
} from "lucide-react";
import { cn } from "@shared/utils/cn";
import useAuthStore from "@app/store/authStore";

const NAV_EMPLOYER_GENERAL = [
    { label: "Tổng quan", href: "/hr/dashboard", icon: LayoutDashboard },
    { label: "Hồ sơ công ty", href: "/hr/company", icon: Building2 },
    { label: "Hồ sơ cá nhân", href: "/hr/profile", icon: User },
];

const NAV_EMPLOYER_TOOLS = [
    { label: "Tin tuyển dụng", href: "/hr/jobs", icon: Briefcase },
    { label: "Quản lý ứng viên", href: "/hr/candidates", icon: Users },
];

function NavItem({ item, collapsed, active }) {
    const Icon = item.icon;
    return (
        <NavLink
            to={item.href}
            className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] font-semibold transition-all duration-200",
                collapsed && "justify-center px-0",
                active
                    ? "text-[#22C55E] dark:text-[#4ADE80]"
                    : "text-[#637381] dark:text-[#919EAB] hover:bg-[rgba(145,158,171,0.06)] dark:hover:bg-white/[0.04] hover:text-[#1C252E] dark:hover:text-white"
            )}
        >
            {active && (
                <motion.span
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#22C55E]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}

            <div
                className={cn(
                    "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                    active
                        ? "bg-[#22C55E] text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                        : "bg-transparent text-current group-hover:bg-[rgba(145,158,171,0.08)] dark:group-hover:bg-white/[0.06]"
                )}
            >
                <Icon className="w-[18px] h-[18px]" />
            </div>

            <AnimatePresence initial={false}>
                {!collapsed && (
                    <motion.span
                        key="label"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                    >
                        {item.label}
                    </motion.span>
                )}
            </AnimatePresence>
        </NavLink>
    );
}

export function HRDashboardSidebar({ collapsed, onToggle }) {
    const { pathname } = useLocation();
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fullName = mounted && user?.profile?.fullName ? user.profile.fullName : "";

    return (
        <motion.aside
            animate={{ width: collapsed ? 88 : 230 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                "fixed top-0 left-0 z-30 h-full flex flex-col",
                "bg-white dark:bg-[#1C252E]",
                "border-r border-[rgba(145,158,171,0.08)] dark:border-white/[0.04]",
                "overflow-hidden shrink-0",
                "shadow-[4px_0_24px_rgba(145,158,171,0.06)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
            )}
        >
            <div className={cn(
                "flex items-center h-[72px] px-5 shrink-0",
                collapsed ? "justify-center" : "justify-between"
            )}>
                <AnimatePresence initial={false}>
                    {!collapsed && (
                        <motion.div
                            key="logo-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-3 py-1"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22C55E] to-[#059669] flex items-center justify-center shrink-0">
                                <Rocket className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[18px] font-extrabold text-[#1C252E] dark:text-white tracking-tight">
                                SmartHire
                            </span>
                        </motion.div>
                    )}
                    {collapsed && (
                        <motion.div
                            key="logo-icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22C55E] to-[#059669] flex items-center justify-center"
                        >
                            <Rocket className="w-5 h-5 text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {!collapsed && (
                    <button
                        onClick={onToggle}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white hover:bg-[rgba(145,158,171,0.08)] transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-6">
                <div className="space-y-1">
                    {!collapsed && (
                        <p className="px-3 mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#919EAB]/70 dark:text-[#637381]/70">
                            Tổng quan
                        </p>
                    )}
                    {NAV_EMPLOYER_GENERAL.map((item) => (
                        <NavItem
                            key={item.href}
                            item={item}
                            collapsed={collapsed}
                            active={pathname === item.href || pathname.startsWith(item.href) && item.href !== "/hr/dashboard"}
                        />
                    ))}
                </div>

                <div className="mx-3 border-t border-[rgba(145,158,171,0.08)] dark:border-white/[0.04]" />

                <div className="space-y-1">
                    {!collapsed && (
                        <p className="px-3 mb-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#919EAB]/70 dark:text-[#637381]/70">
                            Tuyển dụng
                        </p>
                    )}
                    {NAV_EMPLOYER_TOOLS.map((item) => (
                        <NavItem
                            key={item.href}
                            item={item}
                            collapsed={collapsed}
                            active={pathname.startsWith(item.href)}
                        />
                    ))}
                </div>
            </div>

            {collapsed && (
                <div className="flex justify-center pb-4">
                    <button
                        onClick={onToggle}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white hover:bg-[rgba(145,158,171,0.08)] transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className={cn(
                "border-t border-[rgba(145,158,171,0.08)] dark:border-white/[0.04] px-4 py-4",
                collapsed && "flex justify-center px-2"
            )}>
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center text-white font-bold text-sm border-2 border-[#0EA5E9]/20">
                            {fullName ? fullName.charAt(0).toUpperCase() : "H"}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#0EA5E9] border-2 border-white dark:border-[#1C252E] shadow-[0_0_6px_rgba(14,165,233,0.4)]" />
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-[#1C252E] dark:text-white truncate">
                                {fullName || "HR User"}
                            </p>
                            <p className="text-[12px] text-[#919EAB] font-medium truncate">
                                Nhà tuyển dụng
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}
