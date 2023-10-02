/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    colors:{...colors,
      'tenPer':'#0582F5',
      'thirtyPer':'#EBEBEB',
      'sixtyPer':'#FFFFFF',
      'heading':'#131313',
      'text':'#434343',
      'borderc':'#A6A6A6',
      'accepted':'#0FA958',
      'rejected':'#A90F0F'
    },
    extend: {},
  },
  plugins: [],
}

