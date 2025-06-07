import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        davys_gray: {
          DEFAULT: '#595758',
          100: '#121212',
          200: '#242324',
          300: '#363536',
          400: '#484747',
          500: '#595758',
          600: '#7c797a',
          700: '#9d9b9c',
          800: '#bdbcbd',
          900: '#dedede',
        },
        lavender_blush: {
          DEFAULT: '#ffeef2',
          100: '#630017',
          200: '#c6002e',
          300: '#ff2a5c',
          400: '#ff8da7',
          500: '#ffeef2',
          600: '#fff3f6',
          700: '#fff6f8',
          800: '#fff9fa',
          900: '#fffcfd',
        },
        pale_purple: {
          DEFAULT: '#ffe4f3',
          100: '#610035',
          200: '#c2006b',
          300: '#ff249c',
          400: '#ff85c8',
          500: '#ffe4f3',
          600: '#ffebf6',
          700: '#fff0f8',
          800: '#fff5fa',
          900: '#fffafd',
        },
        pink_lavender: {
          DEFAULT: '#ffc8fb',
          100: '#5b0055',
          200: '#b600a9',
          300: '#ff11ef',
          400: '#ff6cf5',
          500: '#ffc8fb',
          600: '#ffd2fc',
          700: '#ffddfd',
          800: '#ffe9fe',
          900: '#fff4fe',
        },
        amaranth_pink: {
          DEFAULT: '#ff92c2',
          100: '#510023',
          200: '#a10046',
          300: '#f20069',
          400: '#ff4395',
          500: '#ff92c2',
          600: '#ffa9ce',
          700: '#ffbfdb',
          800: '#ffd4e7',
          900: '#ffeaf3',
        },
      },
    },
  },
  plugins: [],
};

export default config;