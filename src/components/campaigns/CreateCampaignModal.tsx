"use client";

import { useState } from "react";
import { CreateCampaignData, campaignsAPI, Page } from "@/lib/api";
import { MOCK_PAGES } from "@/lib/mockData";

const USE_MOCK = true;

interface CreateCampaignModalProps {
  onClose:   () => void;
  onSuccess: () => void;
}

type Step = "post" | "reply" | "dm" | "confirm";

const STEPS: { key: Step; label: string }[] = [
  { key: "post",    label: "البوست"  },
  { key: "reply",   label: "الرد"    },
  { key: "dm",      label: "الرسالة" },
  { key: "confirm", label: "تأكيد"   },
];

const REPLY_OPTIONS = [
  { value: "default" as const, label: "افتراضي",  desc: "رد ثابت محدد من النظام"         },
  { value: "custom"  as const, label: "مخصص",     desc: "رد تكتبه أنت لهذا البوست"       },
  { value: "random"  as const, label: "عشوائي",   desc: "يختار عشوائياً من قائمة ردودك" },
];

const DM_CONDITION_OPTIONS = [
  { value: "always"   as const, label: "لكل تعليق بدون شرط"               },
  { value: "keywords" as const, label: "فقط إذا احتوى التعليق كلمة محددة"  },
];

export default function CreateCampaignModal({ onClose, onSuccess }: CreateCampaignModalProps) {
  const [step,         setStep]        = useState<Step>("post");
  const [isSubmitting, setSubmitting]  = useState(false);
  const [error,        setError]       = useState("");
  const [selectedPageId,  setSelectedPageId]  = useState("");
  const [postUrl,         setPostUrl]         = useState("");
  const [postPreview,     setPostPreview]     = useState("");
  const [replyType,       setReplyType]       = useState<"default" | "custom" | "random">("default");
  const [customReply,     setCustomReply]     = useState("");
  const [randomReplies,   setRandomReplies]   = useState<string[]>(["", ""]);
  const [sendDm,          setSendDm]          = useState(false);
  const [dmText,          setDmText]          = useState("");
  const [dmCondition,     setDmCondition]     = useState<"always" | "keywords">("always");
  const [dmKeywords,      setDmKeywords]      = useState("");

  const pages: Page[] = USE_MOCK ? MOCK_PAGES : [];
  const extractPostId = (url: string) => url.match(/\/(\d+)\/?$/)?.[1] || `post_${Date.now()}`;
  const currentStepIndex = STEPS.findIndex(s => s.key === step);
  const goNext = () => { const n = STEPS[currentStepIndex + 1]; if (n) setStep(n.key); };
  const goPrev = () => { const p = STEPS[currentStepIndex - 1]; if (p) setStep(p.key); };

  const isNextDisabled =
    (step === "post"  && (!selectedPageId || !postUrl)) ||
    (step === "reply" && replyType === "custom" && !customReply) ||
    (step === "dm"    && sendDm && !dmText);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data: CreateCampaignData = {
        facebook_post_id:   extractPostId(postUrl),
        page_id:            selectedPageId,
        post_url:           postUrl,
        post_preview:       postPreview || postUrl,
        reply_type:         replyType,
        custom_reply_text:  replyType === "custom" ? customReply : undefined,
        random_replies:     replyType === "random" ? randomReplies.filter(r => r.trim()) : undefined,
        send_dm:            sendDm,
        dm_text:            sendDm ? dmText : undefined,
        dm_condition:       dmCondition,
        dm_keywords:        dmCondition === "keywords"
          ? dmKeywords.split(",").map(k => k.trim()).filter(Boolean)
          : undefined,
        reply_all_comments: true,
        dm_once_per_user:   true,
      };
      if (!USE_MOCK) await campaignsAPI.create(data);
      else await new Promise(r => setTimeout(r, 800));
      onSuccess();
      onClose();
    } catch {
      setError("حدث خطأ أثناء الإنشاء — حاول مجدداً");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", padding: "2rem" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", margin: 0 }}>حملة جديدة</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {STEPS.map((s, i) => (
            <div key={s.key} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 3, borderRadius: 2, marginBottom: "0.4rem", background: i <= currentStepIndex ? "var(--color-primary)" : "var(--color-border-light)", transition: "background 0.3s" }} />
              <span style={{ fontSize: "0.7rem", color: i === currentStepIndex ? "var(--color-primary-light)" : "var(--color-text-muted)", fontWeight: i === currentStepIndex ? 600 : 400 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {step === "post" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="الصفحة" required>
              <select value={selectedPageId} onChange={e => setSelectedPageId(e.target.value)} style={selectStyle}>
                <option value="">اختر صفحة...</option>
                {pages.map(p => <option key={p.id} value={p.id}>{p.page_name}</option>)}
              </select>
            </Field>
            <Field label="رابط البوست" required>
              <input type="url" placeholder="https://facebook.com/..." value={postUrl} onChange={e => setPostUrl(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="وصف مختصر (اختياري)">
              <input type="text" placeholder="مثال: عرض تخفيضات الصيف..." value={postPreview} onChange={e => setPostPreview(e.target.value)} style={inputStyle} />
            </Field>
          </div>
        )}

        {step === "reply" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="نوع الرد" required>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {REPLY_OPTIONS.map(opt => (
                  <label key={opt.value} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", borderRadius: "var(--radius-md)", cursor: "pointer", border: `1px solid ${replyType === opt.value ? "var(--color-primary)" : "var(--color-border-light)"}`, background: replyType === opt.value ? "rgba(13,148,136,0.1)" : "transparent", transition: "all 0.2s" }}>
                    <input type="radio" value={opt.value} checked={replyType === opt.value} onChange={() => setReplyType(opt.value)} style={{ marginTop: 3, accentColor: "var(--color-primary)" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{opt.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Field>
            {replyType === "custom" && (
              <Field label="نص الرد" required>
                <textarea placeholder="اكتب الرد..." value={customReply} onChange={e => setCustomReply(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </Field>
            )}
            {replyType === "random" && (
              <Field label="قائمة الردود (على الأقل 2)" required>
                {randomReplies.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <input type="text" placeholder={`الرد ${i + 1}...`} value={r} onChange={e => { const u = [...randomReplies]; u[i] = e.target.value; setRandomReplies(u); }} style={{ ...inputStyle, flex: 1 }} />
                    {randomReplies.length > 2 && (
                      <button onClick={() => setRandomReplies(prev => prev.filter((_, idx) => idx !== i))} style={{ ...btnSecondary, color: "var(--color-error)" }}>✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setRandomReplies(prev => [...prev, ""])} style={btnSecondary}>+ إضافة رد</button>
              </Field>
            )}
          </div>
        )}

        {step === "dm" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <input type="checkbox" checked={sendDm} onChange={e => setSendDm(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--color-primary)" }} />
              <div>
                <div style={{ fontWeight: 600 }}>إرسال رسالة خاصة</div>
                <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>إرسال رسالة على inbox المعلّق تلقائياً</div>
              </div>
            </label>
            {sendDm && (
              <>
                <Field label="نص الرسالة" required>
                  <textarea placeholder="مرحباً! شكراً على تعليقك..." value={dmText} onChange={e => setDmText(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                </Field>
                <Field label="متى ترسل الرسالة؟">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {DM_CONDITION_OPTIONS.map(opt => (
                      <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontSize: "0.88rem" }}>
                        <input type="radio" value={opt.value} checked={dmCondition === opt.value} onChange={() => setDmCondition(opt.value)} style={{ accentColor: "var(--color-primary)" }} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </Field>
                {dmCondition === "keywords" && (
                  <Field label="الكلمات المفتاحية (افصل بفاصلة)" required>
                    <input type="text" placeholder="السعر, بكم, متوفر" value={dmKeywords} onChange={e => setDmKeywords(e.target.value)} style={inputStyle} />
                  </Field>
                )}
              </>
            )}
          </div>
        )}

        {step === "confirm" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <ConfirmRow label="الصفحة"     value={pages.find(p => p.id === selectedPageId)?.page_name || "-"} />
            <ConfirmRow label="البوست"     value={postPreview || postUrl || "-"} />
            <ConfirmRow label="نوع الرد"   value={{ default: "افتراضي", custom: "مخصص", random: "عشوائي" }[replyType]} />
            <ConfirmRow label="رسالة خاصة" value={sendDm ? (dmCondition === "always" ? "نعم — لكل تعليق" : "نعم — بكلمات") : "لا"} />
            {error && (
              <div style={{ padding: "0.75rem", borderRadius: "var(--radius-md)", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--color-error)", fontSize: "0.85rem" }}>⚠ {error}</div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", justifyContent: "space-between" }}>
          <button onClick={currentStepIndex === 0 ? onClose : goPrev} style={btnSecondary}>
            {currentStepIndex === 0 ? "إلغاء" : "السابق"}
          </button>
          {step !== "confirm" ? (
            <button onClick={goNext} disabled={isNextDisabled} style={{ ...btnPrimary, opacity: isNextDisabled ? 0.5 : 1 }}>التالي</button>
          ) : (
            <button onClick={handleSubmit} disabled={isSubmitting} style={{ ...btnPrimary, minWidth: 120 }}>
              {isSubmitting ? "جارٍ الإنشاء..." : "إنشاء الحملة ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--color-text-secondary)" }}>
        {label} {required && <span style={{ color: "var(--color-error)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.75rem", borderRadius: "var(--radius-md)", background: "rgba(15,23,42,0.5)" }}>
      <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>{label}</span>
      <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.65rem 0.85rem", borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-border-light)", background: "var(--color-bg-elevated)",
  color: "var(--color-text-primary)", fontSize: "0.88rem", fontFamily: "var(--font-body)", outline: "none",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
const btnPrimary: React.CSSProperties = {
  padding: "0.65rem 1.5rem", borderRadius: "var(--radius-md)", border: "none",
  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
  color: "white", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "var(--font-body)",
};
const btnSecondary: React.CSSProperties = {
  padding: "0.65rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)",
  background: "transparent", color: "var(--color-text-secondary)",
  fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "var(--font-body)",
};
