import { Sparkles, ArrowRight, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function WelcomeCard({ userName = "HR", companyName }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent/5 via-card to-accent-dark/5 p-8 sm:p-10 border border-border shadow-premium">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
        style={{ backgroundImage: "radial-gradient(var(--color-foreground) 1px, transparent 1px)", backgroundSize: "24px 24px" }} 
      />

      {/* Decorative orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-accent/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        {/* Text Content */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-background/50 backdrop-blur-md border border-accent/20 rounded-full px-3.5 py-1.5 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
              Dashboard Tuyển Dụng
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
            Xin chào, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-dark">{userName}</span> 👋
          </h2>

          <p className="text-base text-muted-foreground mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Đây là tổng quan tình hình tuyển dụng của doanh nghiệp bạn hôm nay. Nắm bắt ngay bức tranh toàn cảnh để ra quyết định nhanh chóng.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link
              to="/hr/jobs/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg focus-ring"
            >
              <Target className="w-4 h-4" />
              Tạo Tin Tuyển Dụng Mới
            </Link>
            <Link
              to="/hr/company"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground hover:border-accent/40 hover:bg-muted/50 text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              Xem Hồ Sơ Công Ty
            </Link>
          </div>
        </div>

        {/* Right Illustration/Metric */}
        <div className="hidden md:flex shrink-0 relative w-48 h-48 items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-dark/10 rounded-full animate-pulse" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-4 bg-card rounded-full border border-border shadow-lg flex flex-col items-center justify-center z-10 glass">
            <div className="text-xl font-bold text-[#22c55e] mb-1 text-center px-4 leading-tight">
              {companyName || 'Công ty của bạn'}
            </div>
            <div className="text-[10px] font-bold text-[#919EAB] uppercase tracking-widest text-center px-4 mt-2">
              Đối tác tin cậy
            </div>
          </div>
          {/* Floating elements */}
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card shadow-md flex items-center justify-center  z-20">
            <span className="text-xl">✨</span>
          </div>
          <div className="absolute bottom-4 left-0 w-10 h-10 rounded-full bg-card shadow-md flex items-center justify-center  z-20">
            <span className="text-xl">🚀</span>
          </div>
        </div>
      </div>
    </div>
  )
}
