/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
          container: "hsl(var(--primary-container))",
          onContainer: "hsl(var(--on-primary-container))",
          offContainer: "hsl(var(--off-primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          container: "hsl(var(--secondary-container))",
          onContainer: "hsl(var(--on-secondary-container))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--on-surface))",
          variant: "hsl(var(--surface-variant))",
          onVariant: "hsl(var(--on-surface-variant))",
          inverse: "hsl(var(--inverse-surface))",
          inverseOn: "hsl(var(--inverse-on-surface))",
        },
        outline: {
          DEFAULT: "hsl(var(--outline))",
          variant: "hsl(var(--outline-variant))",
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
        // Warna status khusus dari theme.ts
        status: {
          present: "#4caf50",
          late: "#ff9800",
          absent: "#f44336",
          leftEarly: "#2196f3",
          noClockOut: "#607d8b",
          pending: "#2196f3",
          approved: "#4caf50",
          rejected: "#ff7043",
          canceled: "#f44336",
          draft: "#2196f3",
          confirmed: "#3ddad7",
          paid: "#4caf50",
          new: "#2196f3",
          won: "#4CAF50",
          cancel: "#F44336",
          lose: "#9E9E9E",
          ongoing: "#F5B716",
          open: "#03A9F4",
        },
        // Elevation levels dari theme.ts
        elevation: {
          level0: "#FFFFFF",
          level1: "#F8F8F8",
          level2: "#F2F2F2",
          level3: "#ECECEC",
          level4: "#E6E6E6",
          level5: "#DFDFDF",
        },
        // Direct brand palette dari theme.ts
        brand: {
          primary: "#9e0b0f",
          primaryContainer: "#F4C4C5",
          onPrimaryContainer: "#600608",
          secondary: "#5E2129",
          secondaryContainer: "#D69399",
          tertiary: "#B3475B",
          surface: "#FFFFFF",
          background: "#F5F5F5",
          text: "#2E2E2E",
          outline: "#7A3E42",
          outlineVariant: "#BFA5A7",
          inverseSurface: "#2C2C2C",
          inverseOnSurface: "#F5F5F5",
          inversePrimary: "#F4C4C5",
          border: "#CCCCCC",
          notification: "#E63946",
        },
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
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.8s infinite",
      },
    },
  },
  plugins: [],
}
