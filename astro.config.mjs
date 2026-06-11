import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwindcss from "@tailwindcss/vite";
import {remarkModifiedTime} from "./src/remarkPlugin/remark-modified-time.mjs";
import {resetRemark} from "./src/remarkPlugin/reset-remark.js";
import remarkDirective from "remark-directive";
import {remarkAsides} from  './src/remarkPlugin/remark-asides.js'

import expressiveCode from "astro-expressive-code";
import {pluginLineNumbers} from '@expressive-code/plugin-line-numbers'

import {visit} from 'unist-util-visit'
import {pluginCollapsibleSections} from '@expressive-code/plugin-collapsible-sections'

function customRehypeLazyLoadImage() {
  return function (tree) {
    visit(tree, function (node) {
      if (node.tagName === 'img') {
        node.properties['data-src'] = node.properties.src
        node.properties.src = '/spinner.gif'
        node.properties['data-alt'] = node.properties.alt
        node.properties.alt = 'default'
      }
    })
  }
}

export default defineConfig({
  site: 'https://escaity.github.io/',
  output: 'static',
  adapter: undefined,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap(), solid(), expressiveCode({
    plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
    themes: ["github-dark", "github-light"],
    styleOverrides: {
      codeFontFamily: "firacode",
      uiFontFamily: "firacode",
    },
    themeCssSelector: (theme) => `[data-theme="${theme.type}"]`
  }), mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkModifiedTime, resetRemark, remarkDirective, remarkAsides({})],
      rehypePlugins: [customRehypeLazyLoadImage],
    }),
  }
});
