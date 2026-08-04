/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        noir: "#0F0D0B",
        "noir-light": "#1A1613",
        champagne: {
          DEFAULT: "#C6A664",
          light: "#E8D9B5",
          dark: "#9C7F45",
        },
        ivory: "#FBF8F3",
        maroon: {
          DEFAULT: "#3D0C11",
          light: "#5C1620",
        },
        stone: {
          50: "#FAF9F7",
          100: "#F0EDE7",
          200: "#E2DDD3",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #9C7F45 0%, #E8D9B5 50%, #9C7F45 100%)",
        "noir-fade": "linear-gradient(180deg, rgba(15,13,11,0) 0%, rgba(15,13,11,0.9) 100%)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "fade-up": "fadeUp 0.7s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        gold: "0 4px 30px rgba(198,166,100,0.25)",
        card: "0 8px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
