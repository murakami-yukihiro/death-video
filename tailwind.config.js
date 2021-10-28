module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'pale-brown': '#BF9277',
        'lamp-black': '#28211F',
        'tyrian-purple': '#953C69',
        'carmine-red': '#E2021F',
        'milky-white': '#FCFCF9',
      },
      fontFamily: {
        kaisei: ['Kaisei Decol'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  variants: {
    extend: {
      animation: ['responsive', 'motion-safe', 'motion-reduce'],
    },
  },
  plugins: [],
};
