/**
 * PageCard — بطاقة عرض صفحة فيسبوك
 * تعرض معلومات الصفحة وحالة الـ Webhook وأزرار الإجراءات
 */

import { Page } from "@/lib/api";

interface PageCardProps {
  page:             Page;
  onDisconnect:     (id: string) => void;
  onRetryWebhook:   (id: string) => void;
  isActionLoading?: string | null; // id الصفحة التي يتم تحميلها
}

export default function PageCard({
  page,
  onDisconnect,
  onRetryWebhook,
  isActionLoading,
}: PageCardProps) {
  const isLoading = isActionLoading === page.id;

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "transform 0.2s",
        opacity: isLoading ? 0.6 : 1,
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* رأس البطاقة */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>

        {/* أيقونة الصفحة */}
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, var(--color-primary), var(--color-royal))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, overflow: "hidden",
        }}>
          {page.page_picture_url
            ? <img src={page.page_picture_url} alt="" style={{ width: "100%", height: "100%" }} />
            : "⚑"
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem", fontWeight: 700,
            marginBottom: "0.2rem",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {page.page_name}
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
            {page.page_category || "صفحة فيسبوك"}
          </p>
        </div>

        {/* حالة الصفحة */}
        <div style={{
          padding: "0.25rem 0.6rem",
          borderRadius: "9999px",
          fontSize: "0.72rem", fontWeight: 600,
          background: page.is_active ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.15)",
          color: page.is_active ? "var(--color-success)" : "var(--color-text-muted)",
          flexShrink: 0,
        }}>
          {page.is_active ? "● نشطة" : "○ موقوفة"}
        </div>
      </div>

      {/* إحصائيات الصفحة */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        padding: "0.75rem",
        background: "rgba(15,23,42,0.5)",
        borderRadius: "var(--radius-md)",
      }}>
        <StatItem label="المتابعون" value={page.page_followers_count.toLocaleString("ar")} />
        <StatItem
          label="Webhook"
          value={page.webhook_subscribed ? "مفعّل ✓" : "غير مفعّل ✗"}
          valueColor={page.webhook_subscribed ? "var(--color-success)" : "var(--color-warning)"}
        />
      </div>

      {/* تنبيه Webhook */}
      {!page.webhook_subscribed && (
        <div style={{
          padding: "0.6rem 0.75rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.3)",
          fontSize: "0.78rem",
          color: "var(--color-warning)",
        }}>
          ⚠ الـ Webhook غير مفعّل — الردود التلقائية لن تعمل
        </div>
      )}

      {/* أزرار الإجراءات */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>

        {!page.webhook_subscribed && (
          <button
            onClick={() => onRetryWebhook(page.id)}
            disabled={isLoading}
            style={{
              flex: 1, padding: "0.55rem",
              borderRadius: "var(--radius-md)", border: "none",
              background: "rgba(245,158,11,0.15)",
              color: "var(--color-warning)",
              fontSize: "0.8rem", fontWeight: 600,
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            تفعيل Webhook
          </button>
        )}

        <button
          onClick={() => {
            if (confirm(`هل تريد فصل صفحة "${page.page_name}"؟`)) {
              onDisconnect(page.id);
            }
          }}
          disabled={isLoading}
          style={{
            padding: "0.55rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.08)",
            color: "var(--color-error)",
            fontSize: "0.8rem", fontWeight: 600,
            cursor: "pointer", transition: "background 0.2s",
          }}
        >
          فصل
        </button>
      </div>
    </div>
  );
}

function StatItem({ label, value, valueColor }: {
  label: string; value: string; valueColor?: string;
}) {
  return (
    <div>
      <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: valueColor || "var(--color-text-primary)" }}>
        {value}
      </div>
    </div>
  );
}
