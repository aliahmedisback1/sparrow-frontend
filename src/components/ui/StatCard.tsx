/**
 * StatCard — بطاقة عرض إحصائية
 * تُستخدم في الداشبورد لعرض الأرقام الرئيسية
 */

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color?: string;       // لون الأيقونة والخط العلوي
  change?: number;      // نسبة التغيير (اختياري)
  suffix?: string;      // لاحقة (مثل: تعليق، صفحة)
}

export default function StatCard({
  title,
  value,
  icon,
  color = "var(--color-primary)",
  change,
  suffix,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* خط ملون في الأعلى */}
      <div style={{
        position: "absolute",
        top: 0, right: 0, left: 0,
        height: 3,
        background: color,
        borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
      }} />

      {/* الأيقونة */}
      <div style={{
        width: 44, height: 44,
        borderRadius: "var(--radius-md)",
        background: `${color}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        marginBottom: "1rem",
      }}>
        {icon}
      </div>

      {/* الرقم */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "2rem",
        fontWeight: 800,
        color: "var(--color-text-primary)",
        lineHeight: 1,
        marginBottom: "0.25rem",
        display: "flex",
        alignItems: "baseline",
        gap: "0.4rem",
      }}>
        {typeof value === "number" ? value.toLocaleString("ar") : value}
        {suffix && (
          <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--color-text-muted)" }}>
            {suffix}
          </span>
        )}
      </div>

      {/* العنوان */}
      <div style={{
        fontSize: "0.82rem",
        color: "var(--color-text-secondary)",
        marginBottom: change !== undefined ? "0.75rem" : 0,
      }}>
        {title}
      </div>

      {/* نسبة التغيير */}
      {change !== undefined && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: isPositive ? "var(--color-success)" : "var(--color-error)",
          background: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          padding: "0.2rem 0.5rem",
          borderRadius: "var(--radius-full)",
        }}>
          {isPositive ? "↑" : "↓"} {Math.abs(change)}%
          <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>هذا الشهر</span>
        </div>
      )}
    </div>
  );
}
