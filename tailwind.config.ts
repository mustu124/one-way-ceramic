import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        beige: '#EDE8DF',
        beige2: '#E0D8CC',
        gold: '#B8976A',
        'gold-light': '#D4B896',
        'gold-dark': '#8A6D45',
        brown: '#5C4A32',
        text: '#3A2E22',
        'text-light': '#7A6A57',
        clay: '#A65F46',
        ink: '#25211D'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(58, 46, 34, 0.12)'
      },
      animation: {
        pulsewa: 'pulsewa 1.9s ease-in-out infinite'
      },
      keyframes: {
        pulsewa: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(92, 74, 50, 0.32)' },
          '50%': { boxShadow: '0 0 0 16px rgba(92, 74, 50, 0)' }
        }
      }
    }
  },
  plugins: []
}

export default config
