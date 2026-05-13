/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#FF0000",
          hover: "#CC0000",
          glow: "rgba(255, 0, 0, 0.5)",
        },
        secondary: "#1A1A1A",
        accent: "#FF3333",
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        exo2: ["var(--font-exo2)"],
        rajdhani: ["var(--font-rajdhani)"],
        poppins: ["var(--font-poppins)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "futuristic-grid": "linear-gradient(rgba(255, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "50px 50px",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)" },
          "50%": { opacity: 0.7, boxShadow: "0 0 40px rgba(255, 0, 0, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
