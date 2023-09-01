/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    container:{
      center:true,
      padding:'16px',
    },
    extend: {
      colors:{
        primary:"#292929",
        secondary:"#FFCB6D"
      },
      screens:{
        '2xl':'1320px',
      },
    },
  },
  plugins: [],
}

