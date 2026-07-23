export default {
  content: ['./client/index.html', './client/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nic-green': '#78C900',
        'nic-gray': '#4A4A4A',
        'nic-lightgray-1': '#808080',
        'nic-lightgray-2': '#B2B2B2',
      },
      fontFamily: {
        'nic-heading': ['Sylfaen', 'Georgia', 'serif'],
        'nic-body': ['Franklin Gothic Book', 'Arial', 'sans-serif'],
        'nic-modern': ['Open Sans', 'Franklin Gothic Book', 'sans-serif'],
      },
      fontSize: {
        'nic-h1': ['14pt', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'nic-h2': ['13pt', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'nic-h3': ['12pt', { lineHeight: '1' }],
        'nic-body': ['11pt', { lineHeight: '1.5' }],
      },
      spacing: {
        'nic-xs': '4px',
        'nic-sm': '8px',
        'nic-md': '12px',
        'nic-lg': '16px',
        'nic-xl': '24px',
        'nic-2xl': '32px',
      },
    },
  },
  plugins: [],
}
