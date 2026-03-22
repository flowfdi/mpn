import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Forest green palette — #228B22 = hsl(120,60%,34%)
        forest: {
          50:  "#f0faf0",
          100: "#d9f2d9",
          200: "#b3e5b3",
          300: "#7cce7c",
          400: "#44b044",
          500: "#228B22",
          600: "#1a6b1a",
          700: "#155215",
          800: "#0f3d0f",
          900: "#0a290a",
          950: "#051405",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%":       { transform: "scaleY(1.0)" },
        },
      },
      animation: {
        "wave-bar": "wave-bar 0.7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
