/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Alan Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#EE3379', 
      },
    },
    
  },
  plugins: [],
};
