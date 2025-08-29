/* Tailwind config */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
      },
      borderRadius: {
        'xl': '12px'
      }
    }
  },
  plugins: []
};

