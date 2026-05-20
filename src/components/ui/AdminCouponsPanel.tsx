"use client";

/**
 * AdminCouponsPanel — قسم إدارة الكوبونات
 * يُضاف في صفحة الأدمن كقسم منفصل
 */

import { useState, useEffect } from "react";

const USE_MOCK = true;

interface Coupon {
  id:              string;
  code:            string;
  description:     string | null;
  discount_type:   "percentage" | "free_days" | "free_plan";
  discount_value:  number;
  applicable_plan: string | null;
  max_uses:        number | null;
  uses_count:      number;
  one_per_user:    boolean;
  is_active:       boolean;
  expires_at:      string | null;
  created_at:      string;
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: "c001", code: "WELCOME20", description: "خصم ترحيبي للمستخدمين الجدد",
    discount_type: "percentage", discount_value: 20, applicable_plan: null,
    max_uses: 100, uses_count: 34, one_per_user: true, is_active: true,
    expires_at: "2026-12-31T23:59:00Z", created_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "c002", code: "FREE30DAYS", description: "شهر مجاني للشركاء",
    discount_type: "free_days", discount_value: 30, applicable_plan: null,
    max_uses: 50, uses_count: 12, one_per_user: true, is_active: true,
    expires_at: null, created_at: "2026-05-10T12:00:00Z",
  },
  {
    id: "c003", code: "ANNUAL50", description: "خصم 50% على الخطة السنوية",
    discount_type: "percentage", discount_value: 50, applicable_plan: "annual",
    max_uses: 20, uses_count: 20, one_per_user: true, is_active: false,
    expires_at: "2026-06-01T00:00:00Z", created_at: "2026-04-15T09:00:00Z",
  },
];

const DISCOUNT_TYPE_LABELS = {
  percentage: { label: "خصم %",        color: "var(--color-accent-green)" },
  free_days:  { label: "أيام مجانية",  color: "var(--color-accent-blue)"  },
  free_plan:  { label: "خطة مجانية",   color: "var(--color-primary)"      },
};

const PLAN_OPTIONS = [
  { value: "",            label: "كل الخطط" },
  { value: "monthly",    label: "شهري"      },
  { value: "semi_annual",label: "نصف سنوي"  },
  { value: "annual",     label: "سنوي"      },
];

export default function AdminCouponsPanel() {
  const [coupons,     setCoupons]     = useState<Coupon[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [actionId,    setActionId]    = useState<string | null>(null);

  // بيانات النموذج
  const [code,           setCode]           = useState("");
  const [description,    setDescription]    = useState("");
  const [discountType,   setDiscountType]   = useState<Coupon["discount_type"]>("percentage");
  const [discountValue,  setDiscountValue]  = useState("");
  const [applicablePlan, setApplicablePlan] = useState("");
  const [maxUses,        setMaxUses]        = useState("");
  const [expiresAt,      setExpiresAt]      = useState("");
  const [onePerUser,     setOnePerUser]     = useState(true);
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  useEffect(() => {
    const load = async () => {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 400));
        setCoupons(MOCK_COUPONS);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const resetForm = () => {
    setCode(""); setDescription(""); setDiscountType("percentage");
    setDiscountValue(""); setApplicablePlan(""); setMaxUses("");
    setExpiresAt(""); setOnePerUser(true); setShowForm(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    const newCoupon: Coupon = {
      id:              `c${Date.now()}`,
      code:            code.toUpperCase(),
      description:     description || null,
      discount_type:   discountType,
      discount_value:  parseFloat(discountValue),
      applicable_plan: applicablePlan || null,
      max_uses:        maxUses ? parseInt(maxUses) : null,
      uses_count:      0,
      one_per_user:    onePerUser,
      is_active:       true,
      expires_at:      expiresAt || null,
      created_at:      new Date().toISOString(),
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setIsSubmitting(false);
    resetForm();
  };

  const handleToggle = async (id: string) => {
    setActionId(id);
    await new Promise(r => setTimeout(r, 300));
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف هذا الكوبون؟")) return;
    setActionId(id);
    await new Promise(r => setTimeout(r, 300));
    setCoupons(prev => prev.filter(c => c.id !== id));
    setActionId(null);
  };

  const getValueLabel = (coupon: Coupon) => {
    if (coupon.discount_type === "percentage") return `${coupon.discount_value}%`;
    if (coupon.discount_type === "free_days")  return `${coupon.discount_value} يوم`;
    return `${coupon.discount_value} يوم مجاني`;
  };

  return (
    <div>
      {/* الشريط العلوي */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.08em", margin: 0 }}>
          الكوبونات ({coupons.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "0.45rem 1rem", borderRadius: "var(--radius-md)", border: "none",
            background: showForm ? "var(--color-bg-elevated)" : "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            color: showForm ? "var(--color-text-secondary)" : "white",
            fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
          }}
        >
          {showForm ? "إلغاء" : "+ كوبون جديد"}
        </button>
      </div>

      {/* نموذج الإنشاء */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>

            <FormField label="كود الكوبون *">
              <input type="text" placeholder="WELCOME20" value={code} onChange={e => setCode(e.target.value)} required style={inputStyle} />
            </FormField>

            <FormField label="نوع الخصم *">
              <select value={discountType} onChange={e => setDiscountType(e.target.value as Coupon["discount_type"])} style={inputStyle}>
                <option value="percentage">خصم نسبة مئوية</option>
                <option value="free_days">أيام مجانية إضافية</option>
                <option value="free_plan">خطة مجانية كاملة</option>
              </select>
            </FormField>

            <FormField label={discountType === "percentage" ? "نسبة الخصم % *" : "عدد الأيام *"}>
              <input type="number" placeholder={discountType === "percentage" ? "20" : "30"} value={discountValue} onChange={e => setDiscountValue(e.target.value)} required min="1" max={discountType === "percentage" ? "100" : undefined} style={inputStyle} />
            </FormField>

            <FormField label="تطبّق على خطة">
              <select value={applicablePlan} onChange={e => setApplicablePlan(e.target.value)} style={inputStyle}>
                {PLAN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </FormField>

            <FormField label="الحد الأقصى للاستخدام">
              <input type="number" placeholder="غير محدود" value={maxUses} onChange={e => setMaxUses(e.target.value)} min="1" style={inputStyle} />
            </FormField>

            <FormField label="تاريخ الانتهاء">
              <input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} style={inputStyle} />
            </FormField>

            <FormField label="الوصف">
              <input type="text" placeholder="وصف اختياري..." value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
            </FormField>

            <FormField label="الخيارات">
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                <input type="checkbox" checked={onePerUser} onChange={e => setOnePerUser(e.target.checked)} style={{ accentColor: "var(--color-primary)" }} />
                مرة واحدة لكل مستخدم
              </label>
            </FormField>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={isSubmitting} style={{
              padding: "0.6rem 1.5rem", borderRadius: "var(--radius-md)", border: "none",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              color: "white", fontWeight: 600, fontSize: "0.88rem",
              cursor: "pointer", fontFamily: "var(--font-body)",
            }}>
              {isSubmitting ? "جارٍ الإنشاء..." : "إنشاء الكوبون"}
            </button>
          </div>
        </form>
      )}

      {/* قائمة الكوبونات */}
      {isLoading ? (
        <div className="glass-card skeleton" style={{ height: 120 }} />
      ) : coupons.length === 0 ? (
        <div className="glass-card" style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)", borderStyle: "dashed" }}>
          لا توجد كوبونات بعد
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          {/* رأس الجدول */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr auto", padding: "0.65rem 1.25rem", borderBottom: "1px solid var(--color-border)", fontSize: "0.7rem", fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.05em" }}>
            <span>الكوبون</span><span>النوع</span><span>القيمة</span><span>الاستخدام</span><span>الانتهاء</span><span>إجراءات</span>
          </div>

          {coupons.map((coupon, idx) => {
            const typeInfo = DISCOUNT_TYPE_LABELS[coupon.discount_type];
            const usagePercent = coupon.max_uses ? (coupon.uses_count / coupon.max_uses) * 100 : 0;

            return (
              <div key={coupon.id} style={{
                display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr auto",
                padding: "0.85rem 1.25rem", alignItems: "center",
                borderBottom: idx < coupons.length - 1 ? "1px solid var(--color-border)" : "none",
                opacity: actionId === coupon.id ? 0.6 : 1,
                background: !coupon.is_active ? "rgba(71,85,105,0.05)" : "transparent",
              }}>

                {/* الكود والوصف */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.88rem", color: coupon.is_active ? "var(--color-primary-light)" : "var(--color-text-muted)" }}>
                      {coupon.code}
                    </span>
                    {!coupon.is_active && <span style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", background: "var(--color-bg-elevated)", padding: "0.1rem 0.4rem", borderRadius: "9999px" }}>موقوف</span>}
                  </div>
                  {coupon.description && <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: 2 }}>{coupon.description}</div>}
                </div>

                {/* النوع */}
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: typeInfo.color }}>{typeInfo.label}</span>

                {/* القيمة */}
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: typeInfo.color }}>
                  {getValueLabel(coupon)}
                </span>

                {/* الاستخدام */}
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginBottom: 3 }}>
                    {coupon.uses_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                  </div>
                  {coupon.max_uses && (
                    <div style={{ height: 4, borderRadius: 2, background: "var(--color-bg-elevated)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${usagePercent}%`, background: usagePercent >= 100 ? "var(--color-error)" : typeInfo.color, borderRadius: 2 }} />
                    </div>
                  )}
                </div>

                {/* الانتهاء */}
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                  {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString("ar-SA") : "لا يوجد"}
                </span>

                {/* الأزرار */}
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => handleToggle(coupon.id)}
                    disabled={!!actionId}
                    title={coupon.is_active ? "إيقاف" : "تفعيل"}
                    style={{ padding: "0.3rem 0.55rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)", background: "transparent", color: coupon.is_active ? "var(--color-warning)" : "var(--color-success)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}
                  >
                    {coupon.is_active ? "إيقاف" : "تفعيل"}
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    disabled={!!actionId}
                    style={{ padding: "0.3rem 0.55rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "var(--color-error)", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-body)" }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", marginBottom: "0.35rem" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.55rem 0.75rem", borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-border-light)", background: "var(--color-bg-elevated)",
  color: "var(--color-text-primary)", fontSize: "0.85rem", fontFamily: "var(--font-body)", outline: "none",
};
