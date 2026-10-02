---
title: "MacOSで時刻同期がずれた時の対処法"
date: 2024-01-11
description: "Macの時刻が1時間ほどずれて直らないときの対処法を2つ紹介。システム設定で時間帯の自動設定をオンにする方法と、ターミナルでtimedプロセスをkillして再起動させる方法を解説します。"
tags: ["macOS"]
category: Tech
---

MacBookを長時間放置していたところ時刻が1時間ほどズレていたため、時刻同期する方法について調べてみました。
2つの有力な方法が見つかりました。（筆者は2.の方法で直りました。）

## 1. Macのシステム設定(時刻)を変更する
**システム設定 > 日付と時刻** の設定項目にある　"**現在の位置情報に基づいて、時間帯を自動的に設定**"がOffになっていればOnにします。

<img src="/entries/20240112/system_time_setting.webp" alt="macOSのシステム設定「日付と時刻」画面。「現在の位置情報に基づいて、時間帯を自動的に設定」がオンになっている" style="width:400px; margin: auto;" loading="lazy" decoding="async" data-fancybox="gallery">

## 2. Terminalでtimedをkillする
ターミナルを開き以下のコマンドを入力します。
```bash
ps -ef | grep timed
```
すると出力結果にこのような記述がでてきます。こちらのidを参考にして
```bash
266  151     1    0 251223  ??         0:08.99 /usr/libexec/timed
```
killコマンドを入力します
```bash
sudo kill 151
```
うまくいけば、即時に時刻同期が直ります。  
___
参考リンク:

>[「日付と時刻を自動で設定」にチェックを入れると日付が大幅にずれる](https://discussionsjapan.apple.com/thread/252960467?sortBy=best) 