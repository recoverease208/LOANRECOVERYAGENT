import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#1C2A38",
        navy: "#061C3F",
        mint: "#00C9A7",
        "mint-soft": "#35E0C4",
        muted: "#7C8A9A",
        secondary: "#5B6777",
        border: "#E7EEF5",
        surface: "#F8FBFD",
        hover: "#F1F7FA",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      borderRadius: {
        xl: "0.75rem"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(6, 28, 63, 0.08)"
      }
    }
  },
  plugins: [animate]
};
