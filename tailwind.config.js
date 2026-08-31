/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '16px',
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        bg: 'var(--color-bg)',
        muted: 'var(--color-muted)',
        line: 'var(--color-line)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      screens: {
        '2xl': '1320px',
      },
    },
  },
  plugins: [],
}