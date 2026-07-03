import type { Config } from 'tailwindcss';

// Palette de marque — c'est le SEUL fichier à modifier pour retheme ce
// site pour un nouvel artisan (couleurs). Le reste du code référence
// uniquement ces tokens sémantiques (brand / accent).
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0b2545',
          50: '#eef3fa',
          100: '#d6e2f0',
          200: '#adc5e1',
          300: '#7fa3cf',
          400: '#4c7cb5',
          500: '#2c5d99',
          600: '#1c447c',
          700: '#153563',
          800: '#0f2749',
          900: '#0b2545',
          950: '#071731',
        },
        accent: {
          DEFAULT: '#f5a623',
          50: '#fff8ec',
          100: '#ffedc7',
          200: '#ffd98a',
          300: '#ffc04d',
          400: '#fbaa2b',
          500: '#f5a623',
          600: '#d67e0d',
          700: '#b1590e',
          800: '#8f4512',
          900: '#763a13',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
