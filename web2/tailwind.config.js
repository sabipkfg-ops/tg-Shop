/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#111111',
        'bg-2': '#1a1a1a',
        'bg-3': '#222222',
        text: {
          primary: '#ffffff',
          secondary: '#888888',
          muted: '#444444',
        },
        border: '#2a2a2a',
        accent: '#ffffff',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '20px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease',
        'fade-in': 'fadeIn 0.25s ease',
      },
    },
  },
  plugins: [],
}
