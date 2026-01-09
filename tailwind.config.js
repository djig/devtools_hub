/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "zoom-in-95": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        // Liquid glass animations
        "blob-morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60%/30% 40% 70% 60%" },
          "75%": { borderRadius: "60% 40% 60% 40%/70% 30% 50% 60%" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-15px) rotate(2deg)" },
          "66%": { transform: "translateY(5px) rotate(-2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "refraction": {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(15deg)" },
        },
        // Enhanced v2 keyframes
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px 4px rgba(59, 130, 246, 0.3), 0 0 40px 8px rgba(59, 130, 246, 0.1)"
          },
          "50%": {
            boxShadow: "0 0 30px 6px rgba(59, 130, 246, 0.5), 0 0 60px 12px rgba(59, 130, 246, 0.2)"
          },
        },
        "aurora-wave": {
          "0%": { transform: "translateX(-50%) translateY(0%) rotate(0deg)" },
          "33%": { transform: "translateX(-30%) translateY(-20%) rotate(3deg)" },
          "66%": { transform: "translateX(-70%) translateY(10%) rotate(-3deg)" },
          "100%": { transform: "translateX(-50%) translateY(0%) rotate(0deg)" },
        },
        "aurora-wave-reverse": {
          "0%": { transform: "translateX(-50%) translateY(0%) rotate(0deg)" },
          "33%": { transform: "translateX(-70%) translateY(15%) rotate(-2deg)" },
          "66%": { transform: "translateX(-30%) translateY(-15%) rotate(2deg)" },
          "100%": { transform: "translateX(-50%) translateY(0%) rotate(0deg)" },
        },
        "color-shift": {
          "0%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(30deg)" },
          "100%": { filter: "hue-rotate(0deg)" },
        },
        "float-rotate": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-10px) rotate(2deg)" },
          "50%": { transform: "translateY(-5px) rotate(-1deg)" },
          "75%": { transform: "translateY(-15px) rotate(1deg)" },
        },
        "particle-float": {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.3" },
          "25%": { transform: "translateY(-30px) translateX(10px)", opacity: "0.6" },
          "50%": { transform: "translateY(-50px) translateX(-5px)", opacity: "0.4" },
          "75%": { transform: "translateY(-30px) translateX(-10px)", opacity: "0.7" },
        },
        "spotlight-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.1)" },
        },
        "iridescent-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "shimmer-slide": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-in-out",
        "zoom-in-95": "zoom-in-95 0.2s ease-in-out",
        "slide-in": "slide-in-from-bottom 0.3s ease-out",
        // Liquid glass animations
        "blob-morph": "blob-morph 25s ease-in-out infinite",
        "blob-morph-slow": "blob-morph 35s ease-in-out infinite",
        "gradient-shift": "gradient-shift 15s ease infinite",
        "float": "float 20s ease-in-out infinite",
        "float-slow": "float 30s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "refraction": "refraction 8s ease-in-out infinite",
        // Enhanced v2 animations
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "aurora-wave": "aurora-wave 20s ease-in-out infinite",
        "aurora-wave-slow": "aurora-wave 30s ease-in-out infinite",
        "aurora-wave-reverse": "aurora-wave-reverse 25s ease-in-out infinite",
        "color-shift": "color-shift 10s ease-in-out infinite",
        "float-rotate": "float-rotate 6s ease-in-out infinite",
        "particle-float": "particle-float 8s ease-in-out infinite",
        "spotlight-pulse": "spotlight-pulse 3s ease-in-out infinite",
        "iridescent-shift": "iridescent-shift 8s ease infinite",
        "shimmer-slide": "shimmer-slide 3s ease-in-out infinite",
      },
      backdropBlur: {
        "3xl": "64px",
        "4xl": "96px",
      },
      backgroundSize: {
        "200%": "200% 200%",
        "300%": "300% 300%",
      },
    },
  },
  plugins: [],
}
