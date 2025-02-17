/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // src 폴더 내 모든 JS, JSX, TSX 파일에서 Tailwind 사용 가능
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
