import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: "#131921",
          light_dark: "#232F3E",
          yellow: "#FEBD69",
          orange: "#FF9900",
          orange_hover: "#E88B00",
          blue: "#007185",
          link: "#007185",
          hover: "#C7511F",
          bg: "#F5F6F7",
          border: "#D5D9D9",
          success: "#067D62",
          error: "#B12704",
        },
      },
    },
  },
  plugins: [],
};
export default config;

