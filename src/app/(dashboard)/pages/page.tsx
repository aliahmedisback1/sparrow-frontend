"use client";

/**
 * صفحة إدارة صفحات فيسبوك
 * عرض الصفحات المربوطة + ربط صفحة جديدة + فصل صفحة
 */

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import PageCard from "@/components/campaigns/PageCard";
import { usePagesData } from "@/hooks/usePagesData";

export default function PagesManagementPage() {
  const { pages, isLoading, error, disconnectPage, retryWebhook } = usePagesData();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConnectInfo, setShowConnectInfo] = useState(false);

  const handleDisconnect = async (pageId: string) => {
    setActionLoading(pageId);
    await disconnectPage(pageId);
    setActionLoading(null);
  };

  const handleRetryWebhook = async (pageId: string) => {
    setActionLoading(pageId);
    await retryWebhook(pageId);
    setActionLoading(null);
  };

  return (
    <div>
      <DashboardHeader
        title="صفحاتي"
        subtitle="إدارة صفحات فيسبوك المربوطة بحسابك"
      />

      <div style={{ padding: "2rem" }}>

        {/* الشريط العلوي */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", margin: 0 }}>
              الصفحات المربوطة
            </h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>
              {pages.length} صفحة مربوطة
            </p>
          </div>

          {/* زر ربط صفحة جديدة */}
          <button
            onClick={() => setShowConnectInfo(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.65rem 1.25rem",
              borderRadius: "var(--radius-md)", border: "none",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              color: "white", fontSize: "0.88rem", fontWeight: 600,
              cursor: "pointer", boxShadow: "var(--shadow-teal)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            + ربط صفحة جديدة
          </button>
        </div>

        {/* رسالة ربط صفحة (مؤقتة حتى توفر Meta) */}
        {showConnectInfo && (
          <div style={{
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.3)",
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
          }}>
            <div>
              <p style={{ color: "var(--color-accent-blue)", fontWeight: 600, margin: "0 0 0.25rem" }}>
                ℹ ربط الصفحات يتطلب مفاتيح Meta
              </p>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem", margin: 0 }}>
                بعد إنشاء تطبيق Meta والحصول على App ID ستتمكن من ربط صفحاتك مباشرة من هنا
              </p>
            </div>
            <button
              onClick={() => setShowConnectInfo(false)}
              style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 18 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* حالة التحميل */}
        {isLoading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card skeleton" style={{ height: 220 }} />
            ))}
          </div>
        )}

        {/* خطأ */}
        {error && (
          <div style={{
            padding: "1.5rem", textAlign: "center",
            color: "var(--color-error)",
          }}>
            ⚠ {error}
          </div>
        )}

        {/* قائمة الصفحات */}
        {!isLoading && !error && pages.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}>
            {pages.map((page) => (
              <PageCard
                key={page.id}
                page={page}
                onDisconnect={handleDisconnect}
                onRetryWebhook={handleRetryWebhook}
                isActionLoading={actionLoading}
              />
            ))}
          </div>
        )}

        {/* لا توجد صفحات */}
        {!isLoading && !error && pages.length === 0 && (
          <div className="glass-card" style={{
            padding: "4rem 2rem", textAlign: "center",
            borderStyle: "dashed",
          }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>⚑</div>
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
              لا توجد صفحات مربوطة بعد
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
              اضغط على "ربط صفحة جديدة" للبدء
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
