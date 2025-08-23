/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    // Plugin per gestire meglio i problemi di rendering
    'autoprefixer': {},
    'postcss-flexbugs-fixes': {},
  },
}

export default config
