import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
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
          dim: "hsl(var(--primary-dim))",
          fixed: {
            DEFAULT: "hsl(var(--primary-fixed))",
            dim: "hsl(var(--primary-fixed-dim))",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          container: "hsl(var(--tertiary-container))",
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
          DEFAULT: "#00dc82", // Branding highlight
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
        surface: {
          DEFAULT: "hsl(var(--surface))",
          bright: "hsl(var(--surface-bright))",
          dim: "hsl(var(--surface-dim))",
          container: {
            DEFAULT: "hsl(var(--surface-container))",
            low: "hsl(var(--surface-container-low))",
            lowest: "hsl(var(--surface-container-lowest))",
            high: "hsl(var(--surface-container-high))",
            highest: "hsl(var(--surface-container-highest))",
          },
        },
      },
      fontFamily: {
        headline: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.25rem",
        sm: "0.125rem",
        xl: "0.75rem",
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
