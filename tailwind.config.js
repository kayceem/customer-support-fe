/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'inter': ['Inter'],
      'mono': ['Manrope'],
    },
    extend: {
      colors: {
        blue: {
          DEFAULT: "#256FFF",
          light: "#E7EFFF",
        },
        gray: {
          DEFAULT: "#737373",
          darker: "#000000",
          dark: "#2A2A2A",
          light: "#4A4A4A",
          normal: "#9B9B9B",
          lightGray: "#404040",
          border: "#E6E8E7"
        },
        black: {
          DEFAULT: "#000000",
          light: "#232323"
        },
        red: {
          DEFAULT: "#E26464"
        },
        green: {
          DEFAULT: "#32543B"
        }

      },
    },
  },
  plugins: [],
};
