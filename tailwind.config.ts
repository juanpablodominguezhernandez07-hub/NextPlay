import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        stadium: "#0E1A2B",
        turf: "#3A6B35",
        turfdark: "#274A24",
        chalk: "#F6F4EF",
        gold: "#C9A24B",
        ink: "#1C1F24",
        steel: "#5B6472"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      }
    }
  },
  plugins: []
};

export default config;
