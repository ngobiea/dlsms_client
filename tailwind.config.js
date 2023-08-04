/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      margin: {
        chat: '24rem',
      },
    },
    colors: {
      title: '#064f32',
      sidebar: '#06603a',
      sidebarHover: '#2b7858',
    },
  },
  plugins: [require('flowbite/plugin')],
};
