import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * StatCard - Component hiển thị thông số tổng quát hiện đại
 * Có tích hợp hiệu ứng Glassmorphism và Hover Glow.
 */
export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconBg, 
  trend 
}) {
  return (
    <div
      className={cn(
        "relative group rounded-2xl p-6 transition-all duration-500",
        "bg-card/50 backdrop-blur-md", // Kế thừa từ index.css
        "border border-border",
        "hover:border-accent/30",
        "hover:shadow-[0_20px_60px_-15px_rgba(34,197,94,0.15)]",
        "hover:-translate-y-1"
      )}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg text-white",
            iconBg ?? "bg-gradient-to-br from-accent to-accent-dark shadow-accent/25"
          )}
        >
          {Icon && <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />}
        </div>

        {/* Trend badge */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
              trend.positive
                ? "bg-success/10 text-success-light border border-success/20"
                : "bg-error/10 text-error border border-error/20"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            {trend.value}
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors">
          {title}
        </p>
        <p className="text-3xl font-bold text-foreground mt-1.5 tabular-nums tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground mt-1.5 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
