/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cinema: {
          black:      '#07070D',
          deep:       '#0E0E18',
          card:       '#141421',
          elevated:   '#1C1C2E',
          border:     '#252538',
          gold:       '#F5C518',
          'gold-dim': '#C9A000',
          'gold-glow':'rgba(245,197,24,0.15)',
          red:        '#EF4444',
          muted:      '#6B6B8A',
          subtle:     '#9898B8',
          light:      '#EEEEF5',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #F5C518 0%, #FFE566 50%, #C9A000 100%)',
        'card-gradient':   'linear-gradient(180deg, transparent 40%, rgba(7,7,13,0.98) 100%)',
        'hero-glow':       'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,197,24,0.12) 0%, transparent 70%)',
        'sidebar-glow':    'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(245,197,24,0.06) 0%, transparent 60%)',
      },
      boxShadow: {
        'gold-sm':  '0 0 15px rgba(245,197,24,0.15)',
        'gold-md':  '0 0 30px rgba(245,197,24,0.2)',
        'gold-lg':  '0 0 50px rgba(245,197,24,0.25)',
        'card':     '0 4px 24px rgba(0,0,0,0.5)',
        'card-lg':  '0 8px 48px rgba(0,0,0,0.6)',
        'inset-top':'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(245,197,24,0.3)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(245,197,24,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}