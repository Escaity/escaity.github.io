import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';
import tailwindcss from "@tailwindcss/vite";
import {remarkModifiedTime} from "./src/remarkPlugin/remark-modified-time.mjs";
import {resetRemark} from "./src/remarkPlugin/reset-remark.js";
import remarkDirective from "remark-directive";
import {remarkAsides} from './src/remarkPlugin/remark-asides.js'

import expressiveCode from "astro-expressive-code";
import {pluginLineNumbers} from '@expressive-code/plugin-line-numbers'

import {visit} from 'unist-util-visit'
import {pluginCollapsibleSections} from '@expressive-code/plugin-collapsible-sections'
import {existsSync, readdirSync, readFileSync} from 'fs'
import {getGitContentDates} from './src/utils/gitContentDates.ts'
import {site} from './src/consts.ts'

const BLOG_DIR = 'src/content/blog'

// 記事 URL(/blog/<id>/) → 記事ファイル。id はファイル名を小文字化したもの(glob ローダーの slug 化に合わせる)
const blogFileByUrl = new Map(
  readdirSync(BLOG_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => [new URL(`/blog/${file.replace(/\.mdx?$/, '').toLowerCase()}/`, site.url).href, `${BLOG_DIR}/${file}`])
)

// noindex を付けたページ(検索・404・記事の少ないタグなど)は sitemap に載せない。
// sitemap は全ページの出力後に生成されるので、出力済みの HTML の robots meta で判定する
const isNoindexPage = (page) => {
  const file = `dist${decodeURIComponent(new URL(page).pathname)}index.html`
  return existsSync(file) && readFileSync(file, 'utf-8').includes('<meta name="robots" content="noindex')
}

// 記事内の画像を遅延読み込みにし、クリックで拡大表示(fancybox)できるようにする
function customRehypeLazyLoadImage() {
  return function (tree) {
    visit(tree, {tagName: 'img'}, function (node) {
      node.properties.loading = 'lazy'
      node.properties.decoding = 'async'
      node.properties['data-fancybox'] = 'gallery'
    })
  }
}

export default defineConfig({
  site: site.url,
  // canonical・sitemap と内部リンクの URL を末尾スラッシュ付きに統一(GitHub Pages の 301 リダイレクトを避ける)
  trailingSlash: 'always',
  // Astro 7 の既定値は 'jsx'(空白の扱いが変わり見た目に影響する)ため明示する
  compressHTML: true,
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
    filter: (page) => !isNoindexPage(page),
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
      remarkPlugins: [remarkModifiedTime, resetRemark, remarkDirective, remarkAsides],
      rehypePlugins: [customRehypeLazyLoadImage],
    }),
  }
});
