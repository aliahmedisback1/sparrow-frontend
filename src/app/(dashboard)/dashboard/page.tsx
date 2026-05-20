"use client";

/**
 * صفحة الداشبورد الرئيسية
 * تعرض: ترحيب + إحصائيات + حالة الاشتراك + آخر النشاطات
 */

import DashboardHeader from "@/components/layout/DashboardHeader";
import StatCard from "@/components/ui/StatCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { colors } from "@/styles/theme";

// مكون هيكل التحميل (Skeleton)
function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: "1.5rem", height: 160 }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 10, marginBottom: "1rem" }} />
      <div className="skeleton" style={{ width: "60%", height: 32, marginBottom: "0.5rem" }} />
      <div className="skeleton" style={{ width: "80%", height: 16 }} />
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { user, stats, isLoading, error } = useDashboardData();

  // تحية حسب وقت اليوم
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "مساء الخير";
    return "مساء النور";
  };

  return (
    <div>
      <DashboardHeader
        title="لوحة التحكم"
        subtitle="نظرة عامة على نشاط حسابك"
      />

      <div style={{ padding: "2rem" }}>

        {/* قسم الترحيب */}
        <div
          className="glass-card animate-fade-in-up"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            background: `linear-gradient(135deg, rgba(13,148,136,0.15), rgba(30,58,138,0.15))`,
            borderColor: "rgba(13,148,136,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}>
              {getGreeting()}،{" "}
              <span className="gradient-text">
                {user?.facebook_name?.split(" ")[0] || "..."}
              </span>{" "}
              👋
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
              هذه نظرة سريعة على أداء حسابك اليوم
            </p>
          </div>

          {/* صورة المستخدم */}
          {user?.facebook_picture_url && (
            <img
              src={user.facebook_picture_url}
              alt={user.facebook_name}
              style={{
                width: 56, height: 56,
                borderRadius: "50%",
                border: "2px solid var(--color-primary)",
              }}
            />
          )}
        </div>

        {/* بطاقات الإحصائيات */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          letterSpacing: "0.08em",
          marginBottom: "1rem",
        }}>
          الإحصائيات العامة
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          {isLoading ? (
            // هياكل تحميل
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div style={{ color: "var(--color-error)", gridColumn: "1/-1" }}>
              ⚠️ {error}
            </div>
          ) : (
            <>
              <div className="animate-fade-in-up animate-delay-1">
                <StatCard
                  title="الصفحات المربوطة"
                  value={stats?.pages_count ?? 0}
                  icon="⚑"
                  color={colors.primary.teal}
                  suffix="صفحة"
                />
              </div>
              <div className="animate-fade-in-up animate-delay-2">
                <StatCard
                  title="الحملات النشطة"
                  value={stats?.active_campaigns ?? 0}
                  icon="◎"
                  color={colors.accent.green}
                  suffix="حملة"
                />
              </div>
              <div className="animate-fade-in-up animate-delay-3">
                <StatCard
                  title="التعليقات المستلمة"
                  value={stats?.total_comments_received ?? 0}
                  icon="💬"
                  color={colors.accent.blue}
                  suffix="تعليق"
                />
              </div>
              <div className="animate-fade-in-up animate-delay-1">
                <StatCard
                  title="الردود المرسلة"
                  value={stats?.total_replies_sent ?? 0}
                  icon="↩"
                  color={colors.accent.royalLight}
                  suffix="رد"
                />
              </div>
              <div className="animate-fade-in-up animate-delay-2">
                <StatCard
                  title="الرسائل الخاصة"
                  value={stats?.total_dms_sent ?? 0}
                  icon="✉"
                  color={colors.primary.tealLight}
                  suffix="رسالة"
                />
              </div>
            </>
          )}
        </div>

        {/* تنبيه إذا لم توجد بيانات بعد */}
        {!isLoading && !error && stats?.pages_count === 0 && (
          <div
            className="glass-card"
            style={{
              padding: "3rem",
              textAlign: "center",
              borderStyle: "dashed",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>⚑</div>
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
              ابدأ بربط صفحتك الأولى
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              اربط صفحة فيسبوك وفعّل الرد التلقائي في دقائق
            </p>
            <a
              href="/pages"
              style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "white",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "var(--shadow-teal)",
              }}
            >
              ربط صفحة الآن
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
