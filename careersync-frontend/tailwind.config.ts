import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
  fontFamily: {
  sans: ['var(--font-inter)'],
  serif: ['var(--font-playfair)'],
  },
  colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  brand: {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
  }
  },
  }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
