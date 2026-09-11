/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "slate-bg": "#F8FAFC",
        "card-bg": "#FFFFFF",
        "border-card": "#E2E8F0",
        "primary": "#1D4ED8",
        "primary-hover": "#1E40AF",
        "primary-container": "#EFF6FF",
        "secondary": "#EA580C",
        "secondary-container": "#FFF7ED",
        "tertiary": "#7C3AED",
        "tertiary-container": "#F5F3FF",
        "text-slate-dark": "#0F172A",
        "text-slate-sub": "#334155",
        "text-slate-muted": "#64748B"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Hanken Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem'
      }
    },
  },
  plugins: [],
}

