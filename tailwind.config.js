/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f0f",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#e11d48",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#27272a",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#27272a",
          foreground: "#a1a1aa",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}