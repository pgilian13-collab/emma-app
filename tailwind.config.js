/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#111827',
        panel: '#1F2937',
        panelLight: '#374151',
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
        },
        secondary: {
          DEFAULT: '#EC4899',
          hover: '#DB2777',
          light: '#F472B6',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(139, 92, 246, 0.35)',
        glowSecondary: '0 0 24px rgba(236, 72, 153, 0.35)',
        panel: '0 4px 24px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
