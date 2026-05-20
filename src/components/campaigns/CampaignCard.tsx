/**
 * CampaignCard — بطاقة عرض حملة
 * تعرض معلومات الحملة وإحصائياتها وأزرار التحكم
 */

import { Campaign } from "@/lib/api";

interface CampaignCardProps {
  campaign:     Campaign;
  pageName?:    string;
  onToggle:     (id: string) => void;
  onDelete:     (id: string) => void;
  isLoading?:   boolean;
}

// ترجمة نوع الرد
const REPLY_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  default: { label: "افتراضي",  color: "var(--color-text-muted)"    },
  custom:  { label: "مخصص",     color: "var(--color-accent-blue)"   },
  random:  { label: "عشوائي",   color: "var(--color-accent-green)"  },
};

export default function CampaignCard({
  campaign, pageName, onToggle, onDelete, isLoading,
}: CampaignCardProps) {
  const replyInfo = REPLY_TYPE_LABELS[campaign.reply_type];

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.25rem",
        opacity: isLoading ? 0.6 : 1,
        transition: "transform 0.2s",
        borderRight: `3px solid ${campaign.is_active ? "var(--color-primary)" : "var(--color-border-light)"}`,
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* رأس البطاقة */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* مقتطف البوست */}
          <p style={{
            fontSize: "0.85rem", fontWeight: 600,
            color: "var(--color-text-primary)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            marginBottom: "0.25rem",
          }}>
            {campaign.post_preview || `بوست ${campaign.facebook_post_id}`}
          </p>

          {/* اسم الصفحة */}
          {pageName && (
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
              ⚑ {pageName}
            </span>
          )}
        </div>

        {/* مفتاح تفعيل/إيقاف */}
        <button
          onClick={() => onToggle(campaign.id)}
          disabled={isLoading}
          title={campaign.is_active ? "إيقاف الحملة" : "تفعيل الحملة"}
          style={{
            width: 44, height: 24, borderRadius: 12, border: "none",
            background: campaign.is_active ? "var(--color-primary)" : "var(--color-border-light)",
            cursor: "pointer", position: "relative", transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "white",
            position: "absolute", top: 3,
            right: campaign.is_active ? 3 : "auto",
            left: campaign.is_active ? "auto" : 3,
            transition: "all 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }} />
        </button>
      </div>

      {/* شارات المعلومات */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <Badge label={`رد ${replyInfo.label}`} color={replyInfo.color} />
        {campaign.send_dm && (
          <Badge label={`DM: ${campaign.dm_condition === "always" ? "دائماً" : "بكلمات"}`} color="var(--color-accent-blue)" />
        )}
        {!campaign.is_active && <Badge label="موقوفة" color="var(--color-text-muted)" />}
      </div>

      {/* إحصائيات الحملة */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
        gap: "0.5rem", marginBottom: "0.75rem",
        padding: "0.75rem",
        background: "rgba(15,23,42,0.5)",
        borderRadius: "var(--radius-md)",
      }}>
        <MiniStat label="تعليقات" value={campaign.total_comments_received} />
        <MiniStat label="ردود"    value={campaign.total_replies_sent}     />
        <MiniStat label="رسائل"   value={campaign.total_dms_sent}         />
      </div>

      {/* أزرار الإجراءات */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {campaign.post_url && (
          <a
            href={campaign.post_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, padding: "0.5rem", textAlign: "center",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-light)",
              color: "var(--color-text-secondary)",
              fontSize: "0.78rem", textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            عرض البوست ↗
          </a>
        )}
        <button
          onClick={() => {
            if (confirm(`هل تريد حذف هذه الحملة؟`)) onDelete(campaign.id);
          }}
          disabled={isLoading}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239,68,68,0.3)",
            background: "transparent",
            color: "var(--color-error)",
            fontSize: "0.78rem", cursor: "pointer",
          }}
        >
          حذف
        </button>
      </div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "0.2rem 0.5rem", borderRadius: "9999px",
      fontSize: "0.7rem", fontWeight: 600,
      background: `${color}18`, color,
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
        {value.toLocaleString("ar")}
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>{label}</div>
    </div>
  );
}
