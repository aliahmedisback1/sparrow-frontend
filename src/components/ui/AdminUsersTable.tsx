"use client";

/**
 * AdminUsersTable — جدول إدارة المستخدمين
 * يعرض قائمة المستخدمين مع أزرار التحكم الكاملة
 */

import { useState } from "react";
import { UserAdminView } from "@/lib/api";

interface AdminUsersTableProps {
  users:               UserAdminView[];
  isLoading:           boolean;
  onUpdateStatus:      (id: string, status: string, notes?: string) => Promise<void>;
  onGrantSubscription: (id: string, plan: string, days?: number)    => Promise<void>;
  onCancelSubscription:(id: string)                                  => Promise<void>;
}

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  active:    { label: "نشط",    color: "var(--color-success)" },
  suspended: { label: "موقوف",  color: "var(--color-warning)" },
  banned:    { label: "محظور",  color: "var(--color-error)"   },
  frozen:    { label: "مجمّد",  color: "var(--color-accent-blue)" },
};

export default function AdminUsersTable({
  users, isLoading, onUpdateStatus, onGrantSubscription, onCancelSubscription,
}: AdminUsersTableProps) {
  const [actionUserId,  setActionUserId]  = useState<string | null>(null);
  const [expandedUser,  setExpandedUser]  = useState<string | null>(null);
  const [grantPlan,     setGrantPlan]     = useState("monthly");
  const [grantDays,     setGrantDays]     = useState("");
  const [statusNote,    setStatusNote]    = useState("");

  const handleAction = async (action: () => Promise<void>, userId: string) => {
    setActionUserId(userId);
    await action();
    setActionUserId(null);
    setExpandedUser(null);
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card skeleton" style={{ height: 64 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflow: "hidden" }}>
      {/* رأس الجدول */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
        padding: "0.75rem 1.25rem",
        borderBottom: "1px solid var(--color-border)",
        fontSize: "0.72rem",
        fontWeight: 600,
        color: "var(--color-text-muted)",
        letterSpacing: "0.05em",
      }}>
        <span>المستخدم</span>
        <span>الدور</span>
        <span>الحالة</span>
        <span>تاريخ التسجيل</span>
        <span>إجراءات</span>
      </div>

      {users.length === 0 && (
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
          لا يوجد مستخدمون
        </div>
      )}

      {users.map((user, idx) => {
        const statusInfo = STATUS_STYLES[user.status] || STATUS_STYLES.active;
        const isExpanded = expandedUser === user.id;
        const isActioning = actionUserId === user.id;

        return (
          <div key={user.id}>
            {/* صف المستخدم */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
              padding: "0.85rem 1.25rem",
              alignItems: "center",
              borderBottom: idx < users.length - 1 ? "1px solid var(--color-border)" : "none",
              background: isExpanded ? "rgba(13,148,136,0.05)" : "transparent",
              transition: "background 0.2s",
              opacity: isActioning ? 0.6 : 1,
            }}>

              {/* اسم المستخدم */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-royal))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "white",
                }}>
                  {user.facebook_name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{user.facebook_name}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                    {user.facebook_email || user.facebook_id}
                  </div>
                </div>
              </div>

              {/* الدور */}
              <span style={{ fontSize: "0.8rem", color: user.role === "admin" ? "var(--color-warning)" : "var(--color-text-secondary)" }}>
                {user.role === "admin" ? "⚙ أدمن" : "مستخدم"}
              </span>

              {/* الحالة */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.78rem", fontWeight: 600, color: statusInfo.color,
              }}>
                ● {statusInfo.label}
              </span>

              {/* التاريخ */}
              <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                {new Date(user.created_at).toLocaleDateString("ar-SA")}
              </span>

              {/* زر الإجراءات */}
              <button
                onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-light)",
                  background: isExpanded ? "var(--color-primary)" : "transparent",
                  color: isExpanded ? "white" : "var(--color-text-secondary)",
                  fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-body)",
                  transition: "all 0.2s",
                }}
              >
                {isExpanded ? "إغلاق" : "إدارة"}
              </button>
            </div>

            {/* قسم الإجراءات المنسدل */}
            {isExpanded && (
              <div style={{
                padding: "1rem 1.25rem 1.25rem",
                borderBottom: idx < users.length - 1 ? "1px solid var(--color-border)" : "none",
                background: "rgba(15,23,42,0.5)",
                display: "flex", flexDirection: "column", gap: "1rem",
              }}>

                {/* ملاحظات الأدمن */}
                {user.admin_notes && (
                  <div style={{ fontSize: "0.78rem", color: "var(--color-warning)", background: "rgba(245,158,11,0.1)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)" }}>
                    📝 {user.admin_notes}
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>

                  {/* تغيير الحالة */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>تغيير الحالة</div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {[
                        { status: "active",    label: "تفعيل",  color: "var(--color-success)" },
                        { status: "suspended", label: "إيقاف",  color: "var(--color-warning)" },
                        { status: "banned",    label: "حظر",    color: "var(--color-error)"   },
                      ].map(opt => (
                        <button
                          key={opt.status}
                          onClick={() => handleAction(() => onUpdateStatus(user.id, opt.status, statusNote || undefined), user.id)}
                          disabled={user.status === opt.status || isActioning}
                          style={{
                            padding: "0.35rem 0.7rem", borderRadius: "9999px",
                            border: `1px solid ${opt.color}40`,
                            background: user.status === opt.status ? `${opt.color}20` : "transparent",
                            color: opt.color, fontSize: "0.75rem", fontWeight: 600,
                            cursor: user.status === opt.status ? "default" : "pointer",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* منح اشتراك */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>منح اشتراك</div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <select
                        value={grantPlan}
                        onChange={e => setGrantPlan(e.target.value)}
                        style={{ padding: "0.35rem 0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)", background: "var(--color-bg-elevated)", color: "var(--color-text-primary)", fontSize: "0.78rem", fontFamily: "var(--font-body)", flex: 1 }}
                      >
                        <option value="monthly">شهري</option>
                        <option value="semi_annual">نصف سنوي</option>
                        <option value="annual">سنوي</option>
                        <option value="free_trial">تجربة</option>
                      </select>
                      <input
                        type="number"
                        placeholder="أيام"
                        value={grantDays}
                        onChange={e => setGrantDays(e.target.value)}
                        style={{ width: 65, padding: "0.35rem 0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)", background: "var(--color-bg-elevated)", color: "var(--color-text-primary)", fontSize: "0.78rem", fontFamily: "var(--font-body)" }}
                      />
                      <button
                        onClick={() => handleAction(() => onGrantSubscription(user.id, grantPlan, grantDays ? parseInt(grantDays) : undefined), user.id)}
                        disabled={isActioning}
                        style={{ padding: "0.35rem 0.6rem", borderRadius: "var(--radius-md)", border: "none", background: "var(--color-primary)", color: "white", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}
                      >
                        منح
                      </button>
                    </div>
                  </div>
                </div>

                {/* إلغاء الاشتراك */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => { if (confirm("إلغاء اشتراك هذا المستخدم؟")) handleAction(() => onCancelSubscription(user.id), user.id); }}
                    disabled={isActioning}
                    style={{ padding: "0.35rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "var(--color-error)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "var(--font-body)" }}
                  >
                    إلغاء الاشتراك
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
