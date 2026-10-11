/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx}', './src/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        fondo: '#eef3ef',
        menta: '#5ebfae',
        mentaOscura: '#2b7a6d',
        mentaSuave: '#d8f3ec',
        tinta: '#1d2a2b',
        grisTexto: '#6b7773',
        naranjaCita: '#d9853b',
      },
    },
  },
  plugins: [],
};
