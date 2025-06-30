---
title: "Github Actionsでサイト更新を自動化する方法"
date: 2024-05-28
description: "エックスサーバーで公開しているサイトをGithub Actionsを用いてGithubに変更をプッシュするだけで更新する方法を解説します！！"
tags: ["Astro", "ブログ"]
category: Tech
---

このブログではGithubを用いてバージョン管理をしていたものの、サイト更新の際には下記のようなワークフローをとっていました。 
　

  **① ローカルで記事作成**  
  **➁ リモートリポジトリにプッシュ**  
  **③ npm run build でビルドしたディレクトリをFTPソフトを用いてエックスサーバーにアップロード**  
　

手順③を自動化したいと思い調べたところ、Github Actionsでその作業を自動化する方法を見つけましたので解説します！！


## GitHub Actions のワークフロー
リポジトリ内に <code>.github/workflows</code>ディレクトリを作成し、その中にYAMLファイルを作成します。（私の場合はmain.ymlとしました。）  

``` yaml title=".github/workflows/main.yml"
name: Astro Blog Build & Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main
          
      - name: Node setup
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm i && npm run build
      
      - name: prepare .ssh dir
        run: mkdir -p .ssh && chmod 700 .ssh

      - name: ssh key generate
        run: echo "$SSH_SECRET_KEY" > .ssh/id_rsa && chmod 600 .ssh/id_rsa
        env:
          SSH_SECRET_KEY: ${{ secrets.SSH_SECRET_KEY }}
          
      - name: rsync deploy
        run: rsync --checksum -ahv --delete --exclude ".git/" --exclude ".ssh/" -e "ssh -i .ssh/id_rsa -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p ${SSH_PORT}" ./dist/ ${SSH_USER}@${SSH_HOST}:${SSH_DIR}
        env:
          SSH_PORT: ${{ secrets.SSH_PORT }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_DIR:  /var/www/blog/

```
ここからはmain.ymlについて部分ごとに解説をしていきます。
## 1. 実行環境の作成
```yaml
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
```
<code>on</code>の設定で指定したブランチ(ここでは"main")へ<code>push</code>時に処理を実行し、<code>jobs</code>（単一の処理ブロック）はUbuntuで実行環境を構築しています。  
　
## 2. リポジトリのビルド
```yaml
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main
          
      - name: Node setup
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm i && npm run build
```
<code>steps</code>には<code>jobs</code>内の個々の処理を記述していきます。まず、<code>actions/checkout@v4</code>を使用しリポジトリのチェックアウト、<code>ref</code>でブランチ名を指定します。（こちらの指定がない場合はデフォルトブランチが選択されます）  
次に<code>Node setup</code>ですが、こちらについては私が使用しているAstroフレームワークのバージョンの関係で<code>npm</code>のバージョンが18以上である必要があったため記述しています。  
バージョン指定後にビルドコマンドを実行しています。（node モジュールをインストールするためにnpm iを実行しています）  
　
## 3. 秘密鍵の生成
```yaml
      - name: prepare .ssh dir
        run: mkdir -p .ssh && chmod 700 .ssh

      - name: ssh key generate
        run: echo "$SSH_SECRET_KEY" > .ssh/id_rsa && chmod 600 .ssh/id_rsa
        env:
          SSH_SECRET_KEY: ${{ secrets.SSH_SECRET_KEY }}
```
まず、.sshというフォルダを作成し、ディレクトリの権限を700に変更します。次に、.sshにid_rsaというファイルを作成し、ファイルの権限を600に変更します。secrets.というプレフィックスがついている変数はGithubの設定ページで設定した環境変数です。こちらはリポジトリの"Settings"ページから"Security->Secrets and variables->Actions"のページで"New repository secret"ボタンを押下することで作成できます。  

![Github_Actions_環境変数](/entries/20240528/GitHub_Actions_secret_setting.png)  

<code>SSH_SECRET_KEY</code>にはサーバーで作成した秘密鍵の中身をコピーしたものを環境変数にペーストします。（秘密鍵ファイルの末尾に改行が入っているか確かめてください）
### 注意点
・使用する秘密鍵（SSH_SECRET_KEY)にパスフレーズを設定すると<code>rsync</code>の実行でエラーが発生するため、パスフレーズは空白にするとよさそうです。下記コマンドでパスフレーズの変更ができます。
``` bash
ssh-keygen -p -f /path/to/private_key
```
　
## 4. rsyncによるビルドのデプロイ
```yaml
      - name: rsync deploy
        run: rsync --checksum -ahv --delete --exclude ".git/" --exclude ".ssh/" -e "ssh -i .ssh/id_rsa -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p ${SSH_PORT}" ./dist/ ${SSH_USER}@${SSH_HOST}:${SSH_DIR}
        env:
          SSH_PORT: ${{ secrets.SSH_PORT }}
          SSH_USER: ${{ secrets.SSH_USER }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_DIR:  /var/www/blog/
```
<code>rsync</code>を実行します。上述したようにsecrets.変数についてはGitHubの環境変数設定で追加したものになります。  
同期させたくないファイル、ディレクトリは<code>--exclude</code>で除外します。  
<code>-e</code>でリモートシェルを指定します。作成した秘密鍵を<code>ssh</code>の<code>-i</code>オプションで指定します。  
<code>rsync</code>最後のオプションで同期元ファイル(ここでは<code>./dist/</code>)と同期先ファイル(ここでは<code>${SSH_USER}@${SSH_HOST}:${SSH_DIR}</code>)をしており、ディレクトリを指定する場合は末尾に<code>/</code>をつけます。

## おわりに
これにて解説は終了です。以上の手順が成功すれば、サイト更新する際にpushするだけでバージョン管理に加えてwebサーバーへの反映が自動化できるようになり、更新作業が楽になりました。  
___
参考リンク:

>[Github ActionsでConoha WINGにrsyncを使ってデプロイする](https://1000notes.jp/blog/2021/conoha-rsync/)  
>[【CI/CD的な】GitHub Actionsを使ってビルドからrsyncでデプロイまでを自動化する](https://puyobyee18.hatenablog.com/entry/2020/07/18/005950)
