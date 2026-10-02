# AIcicle Records

https://escaity.github.io/ のソースです。[Astro](https://astro.build/) で生成し、GitHub Actions で GitHub Pages にデプロイしています(テーマは [astro-yi](https://github.com/cirry/astro-yi) をベースに改造)。

## コマンド

```bash
npm install
npm run dev      # 開発サーバー(http://localhost:4321)
npm run build    # dist/ に出力し、Pagefind の検索インデックスを生成
npm run preview  # ビルド結果の確認
```

## 構成

- `src/content/blog/` 記事(Markdown)。frontmatter の項目は `src/content.config.ts` を参照
- `src/consts.ts` サイト名・ナビゲーション・プロフィールのリンクなどの設定
- `src/utils/` 記事の取得・並び替え・ページ分割(`posts.ts`)、カテゴリー/タグ(`labels.ts`)などの共通処理
- `src/remarkPlugin/` 最終更新日・読了時間、`:::tip` などの注記ブロック、mermaid のための Markdown 変換
- `.lastmod-ignore-revs` 記事の「最終更新日」の計算から除外するコミット
- 環境変数 `PUBLIC_GA_ID` を設定すると Google Analytics を読み込む
