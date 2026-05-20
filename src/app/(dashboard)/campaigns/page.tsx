"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import CampaignCard from "@/components/campaigns/CampaignCard";
import CreateCampaignModal from "@/components/campaigns/CreateCampaignModal";
import { useCampaignsData } from "@/hooks/useCampaignsData";
import { usePagesData } from "@/hooks/usePagesData";

export default function CampaignsManagementPage() {
  const { campaigns, isLoading, error, toggleCampaign, deleteCampaign, refetch } = useCampaignsData();
  const { pages } = usePagesData();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter,        setFilter]        = useState<"all" | "active" | "inactive">("all");
  const [showModal,     setShowModal]     = useState(false);

  const filtered = campaigns.filter(c => {
    if (filter === "active")   return c.is_active;
    if (filter === "inactive") return !c.is_active;
    return true;
  });

  const handleToggle = async (id: string) => {
    setActionLoading(id);
    await toggleCampaign(id);
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    await deleteCampaign(id);
    setActionLoading(null);
  };

  const getPageName = (pageId: string) =>
    pages.find(p => p.id === pageId)?.page_name;

  const activeCount   = campaigns.filter(c => c.is_active).length;
  const inactiveCount = campaigns.filter(c => !c.is_active).length;

  return (
    <div>
      <DashboardHeader title="الحملات" subtitle="إدارة الردود التلقائية على البوستات" />

      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {([
              { key: "all",      label: `الكل (${campaigns.length})`   },
              { key: "active",   label: `نشطة (${activeCount})`        },
              { key: "inactive", label: `موقوفة (${inactiveCount})`    },
            ] as const).map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "0.45rem 0.9rem", borderRadius: "9999px", border: "none",
                background: filter === f.key ? "var(--color-primary)" : "var(--color-bg-elevated)",
                color: filter === f.key ? "white" : "var(--color-text-secondary)",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}>
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", border: "none",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              color: "white", fontSize: "0.88rem", fontWeight: 600,
              cursor: "pointer", boxShadow: "var(--shadow-teal)",
            }}
          >
            + حملة جديدة
          </button>
        </div>

        {isLoading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card skeleton" style={{ height: 240 }} />
            ))}
          </div>
        )}

        {error && <p style={{ color: "var(--color-error)", textAlign: "center" }}>⚠ {error}</p>}

        {!isLoading && !error && (
          filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
              {filtered.map(campaign => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  pageName={getPageName(campaign.page_id)}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  isLoading={actionLoading === campaign.id}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", borderStyle: "dashed" }}>
              <div style={{ fontSize: 48, marginBottom: "1rem" }}>◎</div>
              <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>لا توجد حملات بعد</h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>أنشئ حملة جديدة للبدء بالرد التلقائي</p>
              <button onClick={() => setShowModal(true)} style={{
                padding: "0.75rem 2rem", borderRadius: "var(--radius-md)", border: "none",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                color: "white", fontWeight: 600, cursor: "pointer",
              }}>
                + إنشاء أول حملة
              </button>
            </div>
          )
        )}
      </div>

      {showModal && (
        <CreateCampaignModal
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
