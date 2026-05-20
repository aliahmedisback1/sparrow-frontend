import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ربط Tailwind بالهوية البصرية المركزية
      colors: {
        primary: {
          DEFAULT: "#0D9488",
          light:   "#14B8A6",
          dark:    "#0F766E",
        },
        accent: {
          green: "#10B981",
          blue:  "#3B82F6",
          royal: "#1E3A8A",
        },
        surface:  "#0F172A",
        elevated: "#1E293B",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg:      "1rem",
        xl:      "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
