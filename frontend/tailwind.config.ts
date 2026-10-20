import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Burgundy & Champagne Palette requested by user
        primary: {
          DEFAULT: '#7A2943',
          50: '#fbf3f5',
          100: '#f7e6eb',
          200: '#efccd7',
          300: '#e3a6b8',
          400: '#d17592',
          500: '#ba4e71',
          600: '#9e3859',
          700: '#7A2943', // Main Burgundy
          800: '#68243a',
          900: '#582133',
          950: '#340f1c',
        },
        accent: {
          DEFAULT: '#C6A56B',
          50: '#faf8f3',
          100: '#f3eedf',
          200: '#e7dcbd',
          300: '#d9c494',
          400: '#C6A56B', // Main Champagne Gold
          500: '#b79253',
          600: '#a17a43',
          700: '#815e37',
          800: '#6b4d32',
          900: '#593f2c',
        },
        surface: {
          bg: '#FBF8F5',
          card: '#FFFFFF',
          text: '#30262B',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif Sinhala"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Noto Serif Sinhala"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
