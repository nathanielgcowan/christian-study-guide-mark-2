import { join } from "path";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    join(__dirname, "app/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "components/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "pages/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "lib/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
