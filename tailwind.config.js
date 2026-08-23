/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    container:{
      center:true,
      padding:'16px',
    },
    extend: {
      colors:{
        primary:"var(--color-primary)",
        secondary:"var(--color-secondary)"
      },
      screens:{
        '2xl':'1320px',
      },
    },
  },
  plugins: [],
}

