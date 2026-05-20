"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { colors } from "@/styles/theme";

const UPGRADE_PLANS = [
  { key: "monthly",     label: "شهري",       price: "$19.99",  period: "/ شهر",    pages: 5,  campaigns: 20,  comments: "2,000",  color: colors.primary.teal,  popular: false },
  { key: "semi_annual", label: "نصف سنوي",   price: "$99.99",  period: "/ 6 أشهر", pages: 10, campaigns: 50,  comments: "5,000",  color: colors.accent.blue,  popular: true  },
  { key: "annual",      label: "سنوي",       price: "$179.99", period: "/ سنة",    pages: 20, campaigns: 100, comments: "15,000", color: colors.accent.royal, popular: false },
];

const PLAN_NAMES: Record<string, string> = {
  free_trial: "تجربة مجانية", monthly: "شهري",
  semi_annual: "نصف سنوي",   annual: "سنوي", custom: "خاص",
};

export default function SubscriptionPage() {
  const { subscription, isLoading, error } = useSubscriptionData();
  const [couponCode,       setCouponCode]       = useState("");
  const [couponResult,     setCouponResult]     = useState<{ valid: boolean; message: string; final_price?: number } | null>(null);
  const [isValidating,     setIsValidating]     = useState(false);
  const [selectedPlan,     setSelectedPlan]     = useState("monthly");

  const daysRemaining = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / 86400000))
    : 0;

  const usagePercent = subscription
    ? Math.min(100, (subscription.comments_used_this_month / subscription.max_comments_per_month) * 100)
    : 0;

  const usageColor = usagePercent >= 90 ? "var(--color-error)" : usagePercent >= 70 ? "var(--color-warning)" : "var(--color-primary)";

  // التحقق من الكوبون
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponResult(null);

    // محاكاة — سيُستبدل بـ API حقيقي
    await new Promise(r => setTimeout(r, 700));
    const mockCoupons: Record<string, { valid: boolean; message: string; final_price?: number }> = {
      "WELCOME20": { valid: true,  message: "خصم 20% — ستدفع $15.99 بدلاً من $19.99", final_price: 15.99 },
      "FREE30DAYS":{ valid: true,  message: "ستحصل على 30 يوم مجاني إضافي مع اشتراكك" },
      "EXPIRED":   { valid: false, message: "الكوبون منتهي الصلاحية" },
    };
    setCouponResult(mockCoupons[couponCode.toUpperCase()] || { valid: false, message: "الكوبون غير صالح" });
    setIsValidating(false);
  };

  return (
    <div>
      <DashboardHeader title="اشتراكي" subtitle="إدارة خطتك وتجديد الاشتراك" />

      <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>

        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="glass-card skeleton" style={{ height: 180 }} />
            <div className="glass-card skeleton" style={{ height: 120 }} />
          </div>
        )}

        {error && <p style={{ color: "var(--color-error)", textAlign: "center" }}>⚠ {error}</p>}

        {!isLoading && !error && subscription && (
          <>
            {/* بطاقة الخطة الحالية */}
            <div className="glass-card animate-fade-in-up" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderColor: "rgba(13,148,136,0.4)", background: "linear-gradient(135deg, rgba(13,148,136,0.1), rgba(30,58,138,0.1))" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.3rem" }}>خطتك الحالية</div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", margin: "0 0 0.5rem" }}>
                    {PLAN_NAMES[subscription.plan_type] || subscription.plan_type}
                  </h2>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <StatusBadge label={subscription.status === "active" ? "● نشط" : "○ منتهي"} color={subscription.status === "active" ? "var(--color-success)" : "var(--color-error)"} />
                    <StatusBadge label={`${daysRemaining} يوم متبقي`} color="var(--color-accent-blue)" />
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>ينتهي في</div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>{new Date(subscription.expires_at).toLocaleDateString("ar-SA")}</div>
                </div>
              </div>

              {/* شريط الاستهلاك */}
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>التعليقات هذا الشهر</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: usageColor }}>
                    {subscription.comments_used_this_month.toLocaleString("ar")} / {subscription.max_comments_per_month.toLocaleString("ar")}
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--color-bg-elevated)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${usagePercent}%`, background: usageColor, borderRadius: 4, transition: "width 0.8s ease" }} />
                </div>
                {usagePercent >= 80 && (
                  <p style={{ fontSize: "0.75rem", color: "var(--color-warning)", marginTop: "0.4rem" }}>⚠ اقتربت من الحد الأقصى — فكّر في الترقية</p>
                )}
              </div>
            </div>

            {/* حدود الخطة */}
            <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", marginBottom: "1rem" }}>حدود خطتك</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                <LimitItem label="الصفحات"     used={0} max={subscription.max_pages} />
                <LimitItem label="الحملات"     used={0} max={subscription.max_active_campaigns} />
                <LimitItem label="تعليقات/شهر" used={subscription.comments_used_this_month} max={subscription.max_comments_per_month} />
              </div>
            </div>

            {/* خطط الترقية */}
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", marginBottom: "1rem" }}>ترقية الخطة</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {UPGRADE_PLANS.map(plan => (
                <div
                  key={plan.key}
                  className="glass-card"
                  onClick={() => setSelectedPlan(plan.key)}
                  style={{
                    padding: "1.5rem", position: "relative", cursor: "pointer",
                    borderColor: selectedPlan === plan.key ? plan.color : undefined,
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {plan.popular && (
                    <div style={{ position: "absolute", top: -12, right: "50%", transform: "translateX(50%)", padding: "0.2rem 0.75rem", borderRadius: "9999px", background: plan.color, color: "white", fontSize: "0.7rem", fontWeight: 700 }}>الأوفر</div>
                  )}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>{plan.label}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: plan.color }}>{plan.price}</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{plan.period}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.25rem" }}>
                    <PlanFeature label={`${plan.pages} صفحات`} />
                    <PlanFeature label={`${plan.campaigns} حملة نشطة`} />
                    <PlanFeature label={`${plan.comments} تعليق/شهر`} />
                  </div>
                  <div style={{
                    width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", textAlign: "center",
                    background: selectedPlan === plan.key ? `${plan.color}20` : "transparent",
                    border: `1px solid ${selectedPlan === plan.key ? plan.color : "var(--color-border-light)"}`,
                    color: selectedPlan === plan.key ? plan.color : "var(--color-text-muted)",
                    fontSize: "0.8rem", fontWeight: 600,
                  }}>
                    {selectedPlan === plan.key ? "✓ محدد" : "اختر"}
                  </div>
                </div>
              ))}
            </div>

            {/* حقل الكوبون */}
            <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", marginBottom: "1rem" }}>
                🎟 كوبون خصم
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="أدخل كود الكوبون..."
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
                  style={{
                    flex: 1, padding: "0.65rem 0.85rem", borderRadius: "var(--radius-md)",
                    border: `1px solid ${couponResult ? (couponResult.valid ? "var(--color-success)" : "var(--color-error)") : "var(--color-border-light)"}`,
                    background: "var(--color-bg-elevated)", color: "var(--color-text-primary)",
                    fontSize: "0.88rem", fontFamily: "var(--font-mono)", outline: "none",
                    letterSpacing: "0.1em",
                  }}
                />
                <button
                  onClick={handleValidateCoupon}
                  disabled={isValidating || !couponCode.trim()}
                  style={{
                    padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", border: "none",
                    background: "var(--color-primary)", color: "white",
                    fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                    fontFamily: "var(--font-body)", opacity: !couponCode.trim() ? 0.5 : 1,
                  }}
                >
                  {isValidating ? "..." : "تحقق"}
                </button>
              </div>

              {/* نتيجة الكوبون */}
              {couponResult && (
                <div style={{
                  marginTop: "0.75rem", padding: "0.65rem 0.85rem",
                  borderRadius: "var(--radius-md)", fontSize: "0.82rem", fontWeight: 600,
                  background: couponResult.valid ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${couponResult.valid ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  color: couponResult.valid ? "var(--color-success)" : "var(--color-error)",
                }}>
                  {couponResult.valid ? "✓" : "✗"} {couponResult.message}
                </div>
              )}
            </div>

            {/* زر الاشتراك النهائي */}
            <button style={{
              width: "100%", padding: "0.9rem", borderRadius: "var(--radius-md)", border: "none",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              color: "white", fontSize: "1rem", fontWeight: 700,
              cursor: "pointer", fontFamily: "var(--font-body)",
              boxShadow: "var(--shadow-teal)",
            }}>
              {couponResult?.valid && couponResult.final_price === 0
                ? "تفعيل مجاناً"
                : `اشترك الآن — ${couponResult?.valid && couponResult.final_price !== undefined ? `$${couponResult.final_price}` : UPGRADE_PLANS.find(p => p.key === selectedPlan)?.price}`
              }
            </button>

            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              🔒 المدفوعات محمية بـ Stripe — نقبل Visa, Mastercard وبطاقات الإمارات
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

function LimitItem({ label, used, max }: { label: string; used: number; max: number }) {
  return (
    <div style={{ textAlign: "center", padding: "0.75rem", background: "rgba(15,23,42,0.5)", borderRadius: "var(--radius-md)" }}>
      <div style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", marginBottom: "0.3rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>
        {used.toLocaleString("ar")}
        <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 400 }}>/{max.toLocaleString("ar")}</span>
      </div>
    </div>
  );
}

function PlanFeature({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
      <span style={{ color: "var(--color-success)" }}>✓</span>
      {label}
    </div>
  );
}
