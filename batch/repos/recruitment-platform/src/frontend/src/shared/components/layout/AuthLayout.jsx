import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export function AuthLayout({ children, heading = "Chào mừng trở lại", subheading = "Trợ lý tuyển dụng AI số 1 dành cho bạn" }) {
    return (
        <div className="flex min-h-[100dvh] w-full bg-white dark:bg-[#141A21] overflow-hidden">
            {/* ─── Left Panel: Branding ─── */}
            <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col relative bg-[#F4F6F8] dark:bg-[#1C252E] overflow-hidden justify-between">
                {/* 1. Ambient Background Orbs */}
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#22c55e]/10 dark:bg-[#22c55e]/15 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[100px] pointer-events-none text-[#22c55e]" />
                
                {/* 2. Top Header - Logo */}
                <div className="relative z-10 p-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center shadow-lg shadow-green-500/25 transition-transform group-hover:scale-105 group-hover:-rotate-3">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-[#1C252E] dark:text-white font-black text-2xl tracking-tight font-mono">
                            Smart<span className="text-[#22c55e]">Hire</span>
                        </span>
                    </Link>
                </div>

                {/* 3. Center - Marketing Content */}
                <div className="relative z-10 px-10 flex-col pt-8 pb-12 flex-1 flex justify-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl xl:text-5xl font-extrabold text-[#1C252E] dark:text-white leading-[1.15] tracking-tight"
                    >
                        {heading}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-[#637381] dark:text-[#919EAB] text-lg mt-5 font-medium leading-relaxed"
                    >
                        {subheading}
                    </motion.p>

                    {/* Features List */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mt-12 flex flex-col gap-5"
                    >
                        {[
                            { icon: Sparkles, text: "Gợi ý việc làm thông minh bằng AI" },
                            { icon: ShieldCheck, text: "Bảo mật thông tin ứng viên chuẩn quốc tế" },
                            { icon: Zap, text: "Quản lý luồng tuyển dụng mượt mà" }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm border border-white/50 dark:border-white/[0.05] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.05)]">
                                <div className="w-10 h-10 rounded-full bg-[#22c55e]/10 dark:bg-[#22c55e]/20 flex items-center justify-center shrink-0">
                                    <feature.icon className="w-5 h-5 text-[#22c55e]" />
                                </div>
                                <span className="font-semibold text-[15px] text-[#1C252E] dark:text-white">{feature.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* 4. Bottom Footer */}
                <div className="relative z-10 p-10">
                    <p className="text-xs text-[#919EAB] font-medium">
                        &copy; {new Date().getFullYear()} SmartHire Platform. All rights reserved.
                    </p>
                </div>
            </div>

            {/* ─── Right Panel: Form Content ─── */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-6 py-10 lg:py-0">
                {/* Mobile Header (Hidden on Desktop) */}
                <div className="lg:hidden absolute top-6 left-6 z-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center shadow-lg shadow-green-500/20">
                           <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-[#1C252E] dark:text-white font-bold text-xl tracking-tight">
                            SmartHire
                        </span>
                    </Link>
                </div>
                
                {/* Form Wrapper */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[500px]"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
