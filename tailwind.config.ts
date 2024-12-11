import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: 
      {
        ajitSky: "#0A97B0",
        ajitSkyLight: "#EDF9FD",
        ajitPurple: "#CFCEFF",
        ajitPurpleLight: "#F1F0FF",
        ajitYellow: "#FAE27C",
        ajitYellowLight: "#FEFCE8",
      },
      // {
      //   ajitSky: "",
      //   ajitSkyLight: "#F8FAFC",
      //   ajitPurple: "#A2D2DF",
      //   ajitPurpleLight : "#FFFED3",
      //   ajitYellow : "#FFEB55",
      //   ajitYellowLight:"#FFEB55"
      // }
      
    },
  },
  plugins: [],
};
export default config;
