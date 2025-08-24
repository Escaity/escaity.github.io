---
title: "GitHub Pages × AstroブログにGA4導入時のハマりポイント"
date: 2025-08-24
description: "Github PagesにデプロイしたブログにGAIDをsecretに設定する時に手詰まった箇所について解説"
tags: ["blog", "github"]
category: Tech
---

## はじめに
先日、本ブログにGoogleアナリティクス（GA4）を導入を試みました。
ローカル環境では問題なくGoogleアナリティクスのID（GAID）が読み込めていたのに、なぜか本番環境にデプロイすると全く反映されない…。  
数時間ハマったこの問題、原因は **GitHubのSecrets設定の勘違い** という、シンプルなものでした。

---

## 何が起きていたか？
状況を整理すると、以下の通りです。

1. `.env`ファイルにGoogleアナリティクスのID（`G-XXXXXXXXXX`）を設定。
2. アプリケーションコード内で `import.meta.env.PUBLIC_GA_ID` のように環境変数を読み込むように記述。
3. ローカルサーバー（`npm run dev`）で起動し、開発者ツールでGAIDがHTMLに埋め込まれ、アナリティクス上でも計測されていることを確認。
4. GitHubにコードをプッシュし、GitHub Actions経由でデプロイが実行。
5. デプロイされた本番サイトを確認すると、GAIDが読み込まれておらず、アナリティクスが全く機能していない。

コードに問題はなく、デプロイも成功している。  
それなのに環境変数だけが空になっている現象に頭を悩ませていました。

---

## 原因：GitHub Secretsは2種類あった
結論から言うと、原因は **GitHub Actionsのワークフローから参照されるべき正しい場所にSecretを設定していなかった** ことでした。

GitHub Actionsのワークフロー内で `${{ secrets.HOGEHOGE }}` という構文で値を参照するには、  
**Repository secrets** に登録する必要があります。

私が設定していたのは **Environment secrets** でした。  

<img src="/spinner.gif" data-src="/entries/20250824/build_env_empty.png" style="width:500px; margin: auto;">
<br>

そのため、GitHub Actionsが実行される際に「そんなSecretは存在しない」と判断され、環境変数が空のままビルドが進んでいました。(正常に値が反映されていれば "PUBLIC_GA_ID=***" のようにマスク表示されます。)


---

## GitHub Actionsで利用するSecretsの設定方法
1. 対象のリポジトリに移動し、 **[Settings]** タブをクリック。
2. 左側のサイドバーから **[Security] > [Secrets and variables] > [Actions]** を選択。
3. **[New repository secret]** ボタンをクリック。
4. **Name** 欄に、ワークフローファイルで参照したい名前（例：`GA_ID`）を入力。
5. **Secret** 欄に、環境変数の値を貼り付ける。
6. **[Add secret]** をクリックして保存。

<img src="/spinner.gif" data-src="/entries/20250824/github_actions_secret.png" style="width:600px; margin: auto;">
<br>

---

## まとめ
この設定を行った後、再度GitHub Actionsを動かしてデプロイしたところ、無事に本番環境でもGoogleアナリティクスのIDが読み込まれ、計測が開始されました。 🎉

---
参考リンク:

>[Github ActionsでSecretが取得できないときに疑うこと](https://qiita.com/shotaqiita/items/4f1df41db56e8902b325)