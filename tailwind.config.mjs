/** @type {import('tailwindcss').Config} */
import { addDynamicIconSelectors } from "@iconify/tailwind";
import daisyUI from "daisyui";

export default {
  // 开启 class 模式的暗色变体
  darkMode: "class",

  // 扫描路径，根据你项目结构调整
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],

  theme: {
    extend: {},
  },

  // 如果你用到这些 safelist 样式，需要保留
  safelist: [
    "alert",
    "alert-info",
    "alert-success",
    "alert-warning",
    "alert-error",
  ],

  plugins: [
    daisyUI,
    addDynamicIconSelectors,
  ],

  daisyui: {
    // 只启用这两套主题
    themes: ["winter", "dracula"],
    // 切到暗色时使用的主题名
    darkTheme: "dracula",
    logs: false,
  },
};
