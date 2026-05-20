"use client";

/**
 * صفحة تسجيل الدخول
 * تسجيل الدخول عبر حساب فيسبوك فقط
 */

import { useState } from "react";
import { colors } from "@/styles/theme";

// أيقونة Sparrow المؤقتة — تُستبدل بالشعار الحقيقي لاحقاً
function SparrowLogo() {
  return (
    <div style={{
      width: 56,
      height: 56,
      borderRadius: "16px",
      background: `linear-gradient(135deg, ${colors.primary.teal}, ${colors.accent.royal})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 28,
      boxShadow: colors.shadows?.teal || "0 0 20px rgba(13,148,136,0.4)",
      marginBottom: "1.5rem",
    }}>
      🐦
    </div>
  );
}

// أيقونة فيسبوك
function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  // توجيه المستخدم لتسجيل دخول فيسبوك
  const handleFacebookLogin = () => {
    setIsLoading(true);
    // يوجه للباكيند الذي يعيد توجيهه لفيسبوك
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/login`;
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* دوائر ضوئية في الخلفية */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-10%",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(30,58,138,0.15) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* بطاقة تسجيل الدخول */}
      <div
        className="glass-card animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "2.5rem",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* الشعار */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SparrowLogo />
        </div>

        {/* العنوان */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
          }}
        >
          <span className="gradient-text">Sparrow</span>
        </h1>

        <p style={{
          color: "var(--color-text-secondary)",
          fontSize: "0.95rem",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}>
          منصة الرد التلقائي الذكي
          <br />
          على تعليقات صفحاتك
        </p>

        {/* فاصل */}
        <div style={{
          width: 40,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${colors.primary.teal}, ${colors.accent.blue})`,
          margin: "0 auto 2rem",
        }} />

        {/* زر تسجيل الدخول */}
        <button
          onClick={handleFacebookLogin}
          disabled={isLoading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "0.9rem 1.5rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: isLoading
              ? "var(--color-bg-elevated)"
              : "linear-gradient(135deg, #1877F2, #0d5bc1)",
            color: "white",
            fontSize: "1rem",
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 15px rgba(24, 119, 242, 0.3)",
          }}
          onMouseEnter={e => {
            if (!isLoading) {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 25px rgba(24, 119, 242, 0.5)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 15px rgba(24, 119, 242, 0.3)";
          }}
        >
          {isLoading ? (
            <>
              <span style={{
                width: 18,
                height: 18,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "white",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }} />
              جارٍ التوجيه...
            </>
          ) : (
            <>
              <FacebookIcon />
              تسجيل الدخول بحساب فيسبوك
            </>
          )}
        </button>

        {/* ملاحظة الخصوصية */}
        <p style={{
          marginTop: "1.5rem",
          fontSize: "0.78rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}>
          بتسجيل دخولك توافق على{" "}
          <a href="/privacy" style={{ color: "var(--color-primary-light)", textDecoration: "none" }}>
            سياسة الخصوصية
          </a>
          {" "}و{" "}
          <a href="/terms" style={{ color: "var(--color-primary-light)", textDecoration: "none" }}>
            شروط الاستخدام
          </a>
        </p>

        {/* مميزات سريعة */}
        <div style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--color-border)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          textAlign: "center",
        }}>
          {[
            { icon: "⚡", label: "رد فوري" },
            { icon: "🎯", label: "رد مخصص" },
            { icon: "📊", label: "إحصائيات" },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أنيميشن دوران للتحميل */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
