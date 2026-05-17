/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#ffffff',
        'bg-2': '#f8f8f8',
        'bg-3': '#f0f0f0',
        red: {
          main: '#E8000A',
          bright: '#FF0010',
          muted: '#c00008',
          glow: 'rgba(232,0,10,0.3)',
        },
        text: {
          primary: '#111111',
          secondary: '#555555',
          muted: '#aaaaaa',
        },
        border: '#e5e5e5',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 0.35s ease forwards',
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.25s ease',
        'pulse-red': 'pulseRed 2s infinite',
      },
      keyframes: {
        glitch: {
          '0%':  { clipPath: 'inset(0 0 100% 0)', transform: 'translateX(0)' },
          '20%': { clipPath: 'inset(30% 0 50% 0)', transform: 'translateX(-3px)' },
          '40%': { clipPath: 'inset(70% 0 10% 0)', transform: 'translateX(3px)' },
          '60%': { clipPath: 'inset(10% 0 80% 0)', transform: 'translateX(-2px)' },
          '100%': { clipPath: 'inset(0 0 0 0)', transform: 'translateX(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(204,0,0,0)' },
          '50%':      { boxShadow: '0 0 12px 2px rgba(204,0,0,0.35)' },
        },
      },
    },
  },
  plugins: [],
}
