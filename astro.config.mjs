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
import {readdirSync} from 'fs'
import {getGitContentDates} from './src/utils/gitContentDates.ts'

const SITE_URL = 'https://escaity.github.io/'
const BLOG_DIR = 'src/content/blog'

// 記事 URL(/blog/<id>/) → 記事ファイル。id はファイル名を小文字化したもの(glob ローダーの slug 化に合わせる)
const blogFileByUrl = new Map(
  readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => [new URL(`/blog/${file.replace(/\.mdx?$/, '').toLowerCase()}/`, SITE_URL).href, `${BLOG_DIR}/${file}`])
)

// 検索エンジンに登録しないページ(noindex を付けているもの)
const sitemapExcludePaths = ['/search/']

function customRehypeLazyLoadImage() {
  return function (tree) {
    visit(tree, function (node) {
      if (node.tagName === 'img') {
        if (node.properties['data-src']) {
          node.properties.src = node.properties['data-src']
          delete node.properties['data-src']
        }
        if (node.properties['data-alt']) {
          node.properties.alt = node.properties['data-alt']
          delete node.properties['data-alt']
        }
        node.properties.loading = 'lazy'
        node.properties.decoding = 'async'
        node.properties['data-fancybox'] = 'gallery'
      }
    })
  }
}

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // canonical・sitemap と内部リンクの URL を末尾スラッシュ付きに統一(GitHub Pages の 301 リダイレクトを避ける)
  trailingSlash: 'always',
  compressHTML: true,
  adapter: undefined,
  redirects: {
    '/blog/1': '/',
    '/archive/1': '/archive/',
    // カテゴリ・タグ統合前の URL(大文字小文字だけが違う web/GitHub は同名ディレクトリと衝突するため対象外)
    '/category/Financial': '/category/Finance/',
    '/category/Biography': '/category/Finance/',
    '/category/Medicine': '/category/雑記/',
    '/category/Game': '/category/雑記/',
    '/category/Music': '/category/雑記/',
    '/category/エラー': '/tags/error/',
    '/tags/ブログ': '/tags/blog/',
    '/tags/Mac': '/tags/macOS/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap({
    filter: (page) => !sitemapExcludePaths.includes(new URL(page).pathname),
    // 記事は git の最終コミット日(.lastmod-ignore-revs のコミットは除外)を lastmod にする
    serialize(item) {
      const file = blogFileByUrl.get(item.url)
      const lastModified = file && getGitContentDates(file).lastCommittedAt
      return lastModified ? {...item, lastmod: lastModified.toISOString()} : item
    },
  }), solid(), expressiveCode({
    plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
    themes: ["catppuccin-mocha", "catppuccin-latte"],
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
