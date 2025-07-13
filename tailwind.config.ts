import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom animations for the game
      keyframes: {
        'chip-place': {
          '0%': { transform: 'scale(0.8) translateY(-10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'card-deal': {
          '0%': { transform: 'translateX(-100px) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        'chip-place': 'chip-place 0.3s ease-out',
        'card-deal': 'card-deal 0.5s ease-out',
      },
      // Optimize colors to only include what you use
      colors: {
        emerald: {
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        yellow: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        red: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        green: {
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gray: {
          200: '#e5e7eb',
          400: '#9ca3af',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}

export default config