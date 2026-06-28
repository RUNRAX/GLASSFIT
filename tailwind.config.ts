import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          dark: "#0B0B10",
          light: "#15151D",
        },
        glass: {
          fill: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.14)",
        },
        accent: {
          primary: "#2EE6C5", // electric mint
          energy: "#FF6B5B", // coral
          recovery: "#5FA8FF", // sky
          streak: "#FFC857", // amber
        },
        text: {
          primary: "#F5F5F7",
          secondary: "rgba(245,245,247,0.6)",
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        '24': '24px',
      },
      boxShadow: {
        'glass-inner': 'inset 0 1px 0 rgba(255,255,255,0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
