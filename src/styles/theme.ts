/**
 * الهوية البصرية لمشروع Sparrow
 * نسخة معدلة لتناسب:
 * البرتقالي الأساسي #F7941D
 * الأسود #000000
 * خط Tajawal
 */

export const colors = {
  // --- الألوان الأساسية ---
  primary: {
    orange: "#F7941D", // اللون الرئيسي
    orangeLight: "#FFB347",
    orangeDark: "#D97706",
  },

  // --- الألوان الثانوية ---
  accent: {
    amber: "#FDBA74",
    gold: "#FBBF24",
    charcoal: "#111111",
    charcoalSoft: "#1A1A1A",
    gray: "#2A2A2A",
    grayLight: "#3A3A3A",
  },

  // --- الخلفيات ---
  background: {
    base: "#000000", // الخلفية الرئيسية
    surface: "#0F0F0F", // الكروت والعناصر
    elevated: "#171717", // العناصر المرتفعة
    border: "#262626",
    borderLight: "#3F3F46",
  },

  // --- النصوص ---
  text: {
    primary: "#FFFFFF",
    secondary: "#D4D4D8",
    muted: "#71717A",
    inverse: "#000000",
  },

  // --- حالات النظام ---
  status: {
    success: "#22C55E",
    successBg: "#052E16",

    warning: "#F7941D",
    warningBg: "#451A03",

    error: "#EF4444",
    errorBg: "#450A0A",

    info: "#38BDF8",
    infoBg: "#082F49",
  },

  // --- ألوان الرسوم والإحصائيات ---
  charts: [
    "#F7941D",
    "#FFB347",
    "#FBBF24",
    "#FFFFFF",
    "#71717A",
    "#2A2A2A",
  ],
} as const;


export const fonts = {
  // خط العناوين
  display: "'Tajawal', sans-serif",

  // خط النصوص
  body: "'Tajawal', sans-serif",

  // خط الأرقام والكود
  mono: "'JetBrains Mono', monospace",

  // Google Fonts
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap",
} as const;


export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem",  // 8px
  md: "1rem",    // 16px
  lg: "1.5rem",  // 24px
  xl: "2rem",    // 32px
  xxl: "3rem",    // 48px
} as const;


export const radius = {
  sm: "0.5rem",   // 8px
  md: "0.875rem", // 14px
  lg: "1.25rem",  // 20px
  xl: "1.75rem",  // 28px
  full: "9999px",
} as const;


export const shadows = {
  // Glow برتقالي
  orange: "0 0 25px rgba(247, 148, 29, 0.35)",

  // ظل الكروت
  card: "0 8px 30px rgba(0, 0, 0, 0.45)",

  // ظل النوافذ
  modal: "0 25px 80px rgba(0, 0, 0, 0.75)",
} as const;


// متغيرات CSS — تُستخدم في globals.css
export const cssVariables = `
  :root {
    --color-primary:        ${colors.primary.orange};
    --color-primary-light:  ${colors.primary.orangeLight};
    --color-primary-dark:   ${colors.primary.orangeDark};

    --color-accent-amber:   ${colors.accent.amber};
    --color-accent-gold:    ${colors.accent.gold};
    --color-charcoal:       ${colors.accent.charcoal};

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
    --color-info:           ${colors.status.info};

    --font-display:         ${fonts.display};
    --font-body:            ${fonts.body};
    --font-mono:            ${fonts.mono};

    --shadow-orange:        ${shadows.orange};
    --shadow-card:          ${shadows.card};

    --radius-md:            ${radius.md};
    --radius-lg:            ${radius.lg};
  }
`;