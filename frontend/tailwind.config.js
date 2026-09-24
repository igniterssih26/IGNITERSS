/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          dark: '#0f172a',
          navy: '#0b1329',
          hud: '#0a0f1d',
          border: '#1e293b',
          accent: '#0284c7',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          subtle: '#334155'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
