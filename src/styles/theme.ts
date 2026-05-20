/**
 * الهوية البصرية لمشروع Sparrow
 * كل الألوان والخطوط والأحجام من هنا فقط
 * أي تعديل هنا ينعكس على كامل التطبيق
 */

export const colors = {
  // --- الألوان الأساسية ---
  primary: {
    teal:        "#0D9488", // تركواز — اللون الرئيسي
    tealLight:   "#14B8A6",
    tealDark:    "#0F766E",
  },

  // --- الألوان الثانوية ---
  accent: {
    green:       "#10B981", // أخضر للنجاح والإيجابيات
    greenLight:  "#34D399",
    blue:        "#3B82F6", // أزرق للمعلومات
    blueLight:   "#60A5FA",
    royal:       "#1E3A8A", // أزرق ملكي غامق للعناوين والتأكيد
    royalLight:  "#1D4ED8",
  },

  // --- الخلفيات ---
  background: {
    base:        "#0A0F1E", // خلفية داكنة رئيسية
    surface:     "#0F172A", // بطاقات وعناصر
    elevated:    "#1E293B", // عناصر مرفوعة (modals, dropdowns)
    border:      "#1E293B", // حدود العناصر
    borderLight: "#334155", // حدود أكثر وضوحاً
  },

  // --- النصوص ---
  text: {
    primary:   "#F1F5F9", // النص الرئيسي
    secondary: "#94A3B8", // نص ثانوي
    muted:     "#475569",  // نص خافت
    inverse:   "#0A0F1E", // نص على خلفيات فاتحة
  },

  // --- حالات النظام ---
  status: {
    success:     "#10B981",
    successBg:   "#064E3B",
    warning:     "#F59E0B",
    warningBg:   "#451A03",
    error:       "#EF4444",
    errorBg:     "#450A0A",
    info:        "#3B82F6",
    infoBg:      "#1E3A5F",
  },

  // --- ألوان الإحصائيات (مرتبة) ---
  charts: [
    "#0D9488", // تركواز
    "#3B82F6", // أزرق
    "#10B981", // أخضر
    "#1E3A8A", // ملكي
    "#14B8A6", // تركواز فاتح
    "#6366F1", // بنفسجي
  ],
} as const;


export const fonts = {
  // خط العناوين — حاد ومميز
  display: "'Syne', sans-serif",

  // خط الجسم — واضح وقابل للقراءة
  body: "'DM Sans', sans-serif",

  // خط الأرقام والكود
  mono: "'JetBrains Mono', monospace",

  // روابط Google Fonts للاستيراد
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
} as const;


export const spacing = {
  xs:  "0.25rem",  // 4px
  sm:  "0.5rem",   // 8px
  md:  "1rem",     // 16px
  lg:  "1.5rem",   // 24px
  xl:  "2rem",     // 32px
  xxl: "3rem",     // 48px
} as const;


export const radius = {
  sm:   "0.375rem", // 6px
  md:   "0.75rem",  // 12px
  lg:   "1rem",     // 16px
  xl:   "1.5rem",   // 24px
  full: "9999px",   // دائري كامل
} as const;


export const shadows = {
  // ظل ملون بالتركواز لإبراز العناصر المهمة
  teal:  "0 0 20px rgba(13, 148, 136, 0.3)",
  blue:  "0 0 20px rgba(59, 130, 246, 0.2)",
  card:  "0 4px 24px rgba(0, 0, 0, 0.4)",
  modal: "0 20px 60px rgba(0, 0, 0, 0.7)",
} as const;


// متغيرات CSS — تُستخدم في globals.css
export const cssVariables = `
  :root {
    --color-primary:        ${colors.primary.teal};
    --color-primary-light:  ${colors.primary.tealLight};
    --color-primary-dark:   ${colors.primary.tealDark};
    --color-accent-green:   ${colors.accent.green};
    --color-accent-blue:    ${colors.accent.blue};
    --color-royal:          ${colors.accent.royal};
    --color-bg-base:        ${colors.background.base};
    --color-bg-surface:     ${colors.background.surface};
    --color-bg-elevated:    ${colors.background.elevated};
    --color-border:         ${colors.background.border};
    --color-border-light:   ${colors.background.borderLight};
    --color-text-primary:   ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-text-muted:     ${colors.text.muted};
    --color-success:        ${colors.status.success};
    --color-warning:        ${colors.status.warning};
    --color-error:          ${colors.status.error};
    --font-display:         ${fonts.display};
    --font-body:            ${fonts.body};
    --font-mono:            ${fonts.mono};
    --shadow-teal:          ${shadows.teal};
    --shadow-card:          ${shadows.card};
    --radius-md:            ${radius.md};
    --radius-lg:            ${radius.lg};
  }
`;
