/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom fitness colors
        'fitness-primary': 'oklch(0.55 0.15 250)',
        'fitness-secondary': 'oklch(0.85 0.12 160)',
        'fitness-accent': 'oklch(0.75 0.15 45)',
        'fitness-success': 'oklch(0.65 0.15 140)',
        'fitness-warning': 'oklch(0.75 0.15 45)',
        'fitness-error': 'oklch(0.65 0.25 25)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          to: { 
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        "scale-in": {
          from: { 
            opacity: "0",
            transform: "scale(0.9)"
          },
          to: { 
            opacity: "1",
            transform: "scale(1)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      fontFamily: {
        'display': ['var(--font-crimson)', 'serif'],
        'body': ['var(--font-work-sans)', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'heading-1': ['2rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'heading-2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
        'heading-3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 oklch(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px oklch(0 0 0 / 0.1), 0 8px 10px -6px oklch(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px oklch(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
