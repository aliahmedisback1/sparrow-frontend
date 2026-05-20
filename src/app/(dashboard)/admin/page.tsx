"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import StatCard from "@/components/ui/StatCard";
import AdminUsersTable from "@/components/ui/AdminUsersTable";
import AdminCouponsPanel from "@/components/ui/AdminCouponsPanel";
import { useAdminStats, useAdminUsers } from "@/hooks/useAdminData";
import { colors } from "@/styles/theme";

const PLAN_LABELS: Record<string, string> = {
  free_trial:  "تجربة مجانية",
  monthly:     "شهري",
  semi_annual: "نصف سنوي",
  annual:      "سنوي",
};

const PLAN_COLORS: Record<string, string> = {
  free_trial:  colors.accent.green,
  monthly:     colors.primary.teal,
  semi_annual: colors.accent.blue,
  annual:      colors.accent.royal,
};

export default function AdminDashboardPage() {
  const { stats, isLoading: statsLoading } = useAdminStats();
  const { users, isLoading: usersLoading, updateStatus, grantSubscription, cancelSubscription, fetchUsers } = useAdminUsers();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const totalSubs = stats
    ? Object.values(stats.subscriptions.by_plan).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div>
      <DashboardHeader title="لوحة الأدمن" subtitle="إدارة التطبيق والمستخدمين" />

      <div style={{ padding: "2rem" }}>

        {/* ===== إحصائيات المستخدمين ===== */}
        <SectionTitle>المستخدمون</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card skeleton" style={{ height: 150 }} />)
          ) : stats ? (
            <>
              <StatCard title="إجمالي المستخدمين"  value={stats.users.total}         icon="👥" color={colors.primary.teal}  suffix="مستخدم" />
              <StatCard title="المستخدمون النشطون" value={stats.users.active}        icon="✓"  color={colors.accent.green} suffix="نشط"    />
              <StatCard title="جدد هذا الأسبوع"    value={stats.users.new_this_week} icon="⬆"  color={colors.accent.blue}  suffix="مستخدم" change={12} />
              <StatCard title="المحظورون"           value={stats.users.banned}        icon="✗"  color="#EF4444"             suffix="حساب"   />
            </>
          ) : null}
        </div>

        {/* ===== إحصائيات النشاط ===== */}
        <SectionTitle>النشاط الكلي</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card skeleton" style={{ height: 150 }} />)
          ) : stats ? (
            <>
              <StatCard title="الصفحات المربوطة" value={stats.pages.total}                        icon="⚑" color={colors.primary.teal}  suffix="صفحة" />
              <StatCard title="إجمالي الحملات"   value={stats.campaigns.total}                    icon="◎" color={colors.accent.blue}  suffix="حملة" />
              <StatCard title="الحملات النشطة"   value={stats.campaigns.active}                   icon="●" color={colors.accent.green} suffix="نشطة" />
              <StatCard title="ردود فاشلة/شهر"   value={stats.activity.failed_replies_this_month} icon="⚠" color="#F59E0B"             suffix="رد"   />
            </>
          ) : null}
        </div>

        {/* ===== توزيع الاشتراكات ===== */}
        <SectionTitle>الاشتراكات</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>الاشتراكات النشطة</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: colors.primary.teal, marginBottom: "1rem" }}>
              {stats?.subscriptions.active_total.toLocaleString("ar") || "—"}
            </div>
            {stats && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {Object.entries(stats.subscriptions.by_plan).map(([plan, count]) => {
                  const percent = totalSubs ? Math.round((count / totalSubs) * 100) : 0;
                  return (
                    <div key={plan}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{PLAN_LABELS[plan] || plan}</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: PLAN_COLORS[plan] }}>{count} ({percent}%)</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: "var(--color-bg-elevated)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${percent}%`, background: PLAN_COLORS[plan], borderRadius: 3, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>إجمالي النشاط</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <ActivityRow label="ردود على تعليقات"   value={stats?.activity.total_replies_sent || 0} color={colors.primary.teal} />
              <ActivityRow label="رسائل خاصة مرسلة"  value={stats?.activity.total_dms_sent || 0}    color={colors.accent.blue}  />
            </div>
          </div>
        </div>

        {/* ===== إدارة المستخدمين ===== */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <SectionTitle style={{ margin: 0 }}>إدارة المستخدمين</SectionTitle>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="بحث بالاسم أو الإيميل..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "0.5rem 0.85rem", borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-light)", background: "var(--color-bg-elevated)",
                color: "var(--color-text-primary)", fontSize: "0.85rem",
                fontFamily: "var(--font-body)", outline: "none", width: 220,
              }}
            />
            <button type="submit" style={{
              padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", border: "none",
              background: "var(--color-primary)", color: "white",
              fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-body)",
            }}>
              بحث
            </button>
          </form>
        </div>

        <AdminUsersTable
          users={users}
          isLoading={usersLoading}
          onUpdateStatus={updateStatus}
          onGrantSubscription={grantSubscription}
          onCancelSubscription={cancelSubscription}
        />

        {/* ===== الكوبونات ===== */}
        <div style={{ marginTop: "2.5rem" }}>
          <AdminCouponsPanel />
        </div>

      </div>
    </div>
  );
}

function SectionTitle({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.08em", marginBottom: "0.75rem", ...style }}>
      {children}
    </h3>
  );
}

function ActivityRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color }}>{value.toLocaleString("ar")}</span>
    </div>
  );
}
