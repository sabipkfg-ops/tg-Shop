/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        'bg-2': '#111111',
        'bg-3': '#1a1a1a',
        text: {
          primary: '#ffffff',
          secondary: '#999999',
          muted: '#444444',
        },
        border: '#222222',
        accent: '#ffffff',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        mono: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
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