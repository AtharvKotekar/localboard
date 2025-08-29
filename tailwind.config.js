/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0f111a',
        'cyber-darker': '#0a0d14',
        'cyber-surface': '#1a1d29',
        'neon-green': '#64ffda',
        'neon-cyan': '#82b1ff',
        'neon-pink': '#ff6b9d',
        'neon-purple': '#c792ea',
        'cyber-gray': '#263238',
        'cyber-blue': '#1e3a5f',
        'text-primary': '#eeffff',
        'text-secondary': '#82aaff',
        'text-muted': '#546e7a',
        'border-color': '#263238',
      },
      fontFamily: {
        'cyber': ['Courier New', 'monospace'],
        'display': ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite alternate',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%': { 
            boxShadow: '0 0 5px #00ff87, 0 0 10px #00ff87, 0 0 15px #00ff87',
            textShadow: '0 0 5px #00ff87'
          },
          '100%': { 
            boxShadow: '0 0 10px #00ff87, 0 0 20px #00ff87, 0 0 30px #00ff87',
            textShadow: '0 0 10px #00ff87'
          }
        },
        'glow': {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}