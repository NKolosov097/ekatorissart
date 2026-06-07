import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#f7f4ef",
        ink: "#1a1a1a",
        muted: "#6b6b6b",
        accent: "#8a6a3b",
        line: "#e6e1d8",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Amiri", "Georgia", "serif"],
        sans: ["Inter", "Cairo", "system-ui", "sans-serif"],
        arabic: ["Cairo", "Amiri", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
