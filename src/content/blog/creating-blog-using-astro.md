---
title: "Astroでブログ作ってみた"
date: 2024-01-07
description: 最初のAstro記事です。
tags: ["Astro", "ブログ"]
category: 雑記
---

[初めてのAstroブログ](https://docs.astro.build/ja/tutorial/0-introduction/ )という公式チュートリアル記事をほとんど真似して作ってみました。（デザインは所々変えてます。）タグ機能がお手軽に作れて良い。
デプロイ先に関しては[Github Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages )や[Cloudflare Pages](https://pages.cloudflare.com/)などでも良かったんですが、学習用に契約していたVPSにWEBサーバーを構築してデプロイしています。

## チュートリアルに加えてやったこと
- **1. ページネーション**: Astroの標準ライブラリで用意されているpaginate()関数を使用して実装。
<br>　　
- **2. シンタックスハイライト**: AstroにはshikiConfig(astro.config.mjs)なる設定項目があり、mdファイルに独自のシンタックスハイライトを設定できちゃう🐣
<br>　　
- **3. ダークテーマ**: チュートリアル通りに実装しようと思ったけど、<a href="https://watercss.kognise.dev/" target="_blank" rel="noopener noreferrer">Water.css</a> のデザインと配色が気に入ったのでこちらのcssを導入しました。
## 今後の目標
技術系の記事を追加していきたい。Unity関係の記事が多くなるかもしれない。