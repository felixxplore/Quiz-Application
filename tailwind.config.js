/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ab3cfc", // RGB(171, 60, 252)
        secondary: "#7e6df3", // RGB(126, 109, 243)
        tertiary: "#533b7c", // RGB(83, 59, 124)
        quaternary: "#7c589a", // RGB(124, 88, 154)
        quinary: "#9f8cca", // RGB(159, 140, 202)
        neutral: "#3e394c", // RGB(62, 57, 76)
      },
    },
  },
  plugins: [],
};
