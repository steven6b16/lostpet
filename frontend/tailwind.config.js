/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pet-purple': '#6B46C1', // PetBacker 主色（紫色）
        'pet-light-purple': '#B794F4', // 淺紫色
        'one-degree-bg': '#E6F7FA', // OneDegree 背景色
        'one-degree-card': '#FFFFFF', // 卡片背景色
      },
    },
  },
  plugins: [],
}