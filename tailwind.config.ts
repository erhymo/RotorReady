import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./features/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
} satisfies Config
