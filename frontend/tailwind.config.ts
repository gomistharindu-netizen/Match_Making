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
        // Deep Rose & Champagne Gold Theme Palette
        primary: {
          DEFAULT: '#AD3B65', // Deep Rose - Buttons & Active states
          50: '#FDF6F8',
          100: '#F8E4EB', // Blush Pink
          200: '#F2C8D6',
          300: '#E5A1BA',
          400: '#D46E94',
          500: '#AD3B65',
          600: '#972F55',
          700: '#802446',
          800: '#671C38',
          900: '#53172D',
          950: '#350B1B',
        },
        brand: {
          DEFAULT: '#AD3B65',
          50: '#FDF6F8',
          100: '#F8E4EB',
          200: '#F2C8D6',
          300: '#E5A1BA',
          400: '#D46E94',
          500: '#AD3B65',
          600: '#972F55',
          700: '#802446',
          800: '#671C38',
          900: '#53172D',
        },
        accent: {
          DEFAULT: '#C6A56B', // Champagne Gold - Accents & Highlights
          50: '#faf8f3',
          100: '#f3eedf',
          200: '#e7dcbd',
          300: '#d9c494',
          400: '#C6A56B',
          500: '#b79253',
          600: '#a17a43',
          700: '#815e37',
          800: '#6b4d32',
          900: '#593f2c',
        },
        blush: {
          DEFAULT: '#F8E4EB', // Blush Pink - Section backgrounds
          50: '#FDFAFC',
          100: '#F8E4EB',
          200: '#F3CFDC',
          300: '#E9A6BD',
        },
        ivory: {
          DEFAULT: '#FFF8FA', // Soft Ivory Pink - Page background
          50: '#FFFFFF',
          100: '#FFF8FA',
          200: '#FBF0F4',
        },
        plum: {
          DEFAULT: '#352A30', // Dark Plum - Headings & Body text
          50: '#F7F5F6',
          100: '#EBE7E9',
          200: '#D6CFD3',
          300: '#B8ACB3',
          400: '#8F7E88',
          500: '#685962',
          600: '#52434D',
          700: '#42353E',
          800: '#352A30',
          900: '#261E23',
          950: '#181316',
        },
        surface: {
          bg: '#FFF8FA',
          card: '#FFFFFF',
          text: '#352A30',
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
