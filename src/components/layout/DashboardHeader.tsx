"use client";

/**
 * DashboardHeader — الشريط العلوي
 * يعرض عنوان الصفحة الحالية وبعض الإجراءات السريعة
 */

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header style={{
      height: 64,
      background: "rgba(10, 15, 30, 0.8)",
      borderBottom: "1px solid var(--color-border)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      padding: "0 2rem",
      position: "sticky",
      top: 0,
      zIndex: 50,
      gap: "1rem",
    }}>

      {/* العنوان */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          margin: 0,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            margin: 0,
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* مؤشر حالة الاتصال */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: "0.75rem",
        color: "var(--color-success)",
      }}>
        <div style={{
          width: 7, height: 7,
          borderRadius: "50%",
          background: "var(--color-success)",
          animation: "pulse 2s infinite",
        }} />
        نشط
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </header>
  );
}
