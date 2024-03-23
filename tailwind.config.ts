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
        spotify: {
          base: "#121212",
          highlight: "#1a1a1a",
          dark: "#0a0a0a",
          subdued: "#727272",
          gray: "#a7a7a7",
          green: "#1ed760",
          press: "#169c46",
        },
      },
    },
  },
  plugins: [],
};
export default config;
