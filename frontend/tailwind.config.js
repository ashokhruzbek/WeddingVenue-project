/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1E3A5F',
          950: '#102a43',
        },
        'gold': {
          50: '#fdfbf3',
          100: '#faf5e1',
          200: '#f5eac3',
          300: '#edd89e',
          400: '#e4c373',
          500: '#D4AF37',
          600: '#c49a2c',
          700: '#a47c24',
          800: '#856323',
          900: '#6d5120',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}