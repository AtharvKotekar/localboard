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
        'fluorescent-green': '#39ff14',
        'dim-green': '#2dd40a',
        'faint-green': '#1a8a08',
        'dark-gray': '#0a0a0a',
        'med-gray': '#1a1a1a',
        'light-gray': '#2a2a2a',
        'gray-text': '#808080',
        'border': '#333333',
        
        // Legacy colors for compatibility
        'cyber-dark': '#000000',
        'cyber-darker': '#0a0a0a',
        'cyber-surface': '#1a1a1a',
        'neon-green': '#39ff14',
        'neon-cyan': '#39ff14',
        'neon-pink': '#39ff14',
        'neon-purple': '#39ff14',
        'cyber-gray': '#333333',
        'cyber-blue': '#1a1a1a',
        'text-primary': '#ffffff',
        'text-secondary': '#39ff14',
        'text-muted': '#808080',
        'border-color': '#333333',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'cyber': ['JetBrains Mono', 'monospace'],
        'display': ['Inter', 'sans-serif'],
      },
      fontWeight: {
        'extralight': '100',
        'light': '200',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
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