import mdx from "@astrojs/mdx";
import react from "@astrojs/react";              // ← 新增
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import playformCompress from "@playform/compress";
import terser from "@rollup/plugin-terser";
import swup from "@swup/astro";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";

import remarkMath from "remark-math";
import { transformers } from "./src/config/transformers.js";

import { CODE_THEME } from "./src/consts.ts";

import { initI18n } from "./src/locales";
import { rehypeFadeInUp } from "./src/plugins/rehype-fade-in-up.mjs";
import { remarkAddAnchor } from "./src/plugins/remark-add-anchor.mjs";
import { remarkHeadingExtractor } from "./src/plugins/remark-heading-extractor.mjs";

import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  // site: USER_SITE,
  site: "https://github.com/DeliXi199/delixi199.github.io/",
  output: "static",
  style: {
    scss: {
      includePaths: ["./src/styles"],
    },
  },
  integrations: [
    react(),            // ← 加在这里
    mdx(),
    icon({
      include: {
        mdi: ["*"],
      },
    }),
    swup({
      cache: true,
      progress: true,
      accessibility: true,
      smoothScrolling: true,
      preload: {
        hover: true,
        visible: false,
      },
      containers: ["#swup"],
    }),
    terser({
      compress: true,
      mangle: true,
    }),
    sitemap(),
    tailwind(),
    pagefind(),
    playformCompress(),
    initI18n(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: CODE_THEME.light,
        dark: CODE_THEME.dark,
      },
      transformers,
    },
    remarkPlugins: [
      remarkMath,
      remarkAddAnchor,
      remarkReadingTime,
      remarkHeadingExtractor,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeFadeInUp,
      [
        rehypeExternalLinks,
        {
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              width: "1em",
              height: "1em",
              viewBox: "0 0 24 24",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
            },
            children: [
              {
                type: "element",
                tagName: "g",
                properties: {
                  id: "SVGRepo_bgCarrier",
                  "stroke-width": "0",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "g",
                properties: {
                  id: "SVGRepo_tracerCarrier",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "g",
                properties: {
                  id: "SVGRepo_iconCarrier",
                },
                children: [
                  {
                    type: "element",
                    tagName: "g",
                    properties: {
                      id: "SVGRepo_iconCarrier",
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "path",
                        properties: {
                          d: "M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11",
                          stroke: "#888",
                          "stroke-width": "2",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
    },
  },
});
