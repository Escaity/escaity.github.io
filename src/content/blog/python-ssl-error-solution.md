---
title: "Python SSL証明書エラー解決ガイド (MacOS)"
date: 2025-06-26
description: "ssl.SSLCertVerificationError: 発生する原因と、具体的な解決策を解説します"
tags: ["Python", "error"]
category: Tech
---


PythonでAPI通信やスクレイピングを行う際、macOS環境で次のようなエラーに遭遇したことはありませんか？

```
ssl.SSLCertVerificationError: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate in certificate chain (_ssl.c:1000)
```

このエラーは、Pythonが接続先のサーバーのSSL証明書を正しく検証できないために発生します。この記事では、このエラーが発生する原因と、具体的な解決策を解説します。


## 🧐 問題提起：なぜこのエラーは起きるのか？

このSSLCertVerificationErrorは、「SSL証明書の検証に失敗した」ことを意味します。

**SSL/TLS証明書とは？**: WebサイトやAPIサーバーが「本物」であることを証明するための電子的な身分証明書のようなものです。これにより、通信が暗号化され、データの盗聴や改ざんを防ぎます。

**証明書の検証**: 私たちのPC（クライアント）は、サーバーから提示された証明書が、信頼できる第三者機関（認証局 / CA - Certificate Authority）によって発行されたものかを確認します。この確認作業を「検証」と呼びます。

特に、公式サイト（python.org）からダウンロードしたPythonをmacOSにインストールした場合、PythonはmacOS標準の信頼された認証局リスト（キーチェーン）を自動的に参照しません。そのため、Python自身が参照するための認証局リストを持っていない状態となり、サーバー証明書の検証に失敗してしまうのです。

## ✅ 解決策：証明書をインストールしよう

最も安全で推奨される解決策は、Pythonに信頼できる認証局の証明書リストをインストールすることです。

### 最も簡単な解決策：Install Certificates.commandの実行

macOS用のPythonインストーラには、この問題を解決するための便利なスクリプトが同梱されています。

1. Finderを開き、アプリケーションフォルダに移動します。
2. Python 3.XX（お使いのバージョン）のフォルダを見つけて開きます。
3. 中にある `Install Certificates.command` というファイルをダブルクリックして実行します。

これを実行するとターミナルが起動し、certifiというライブラリを通じて必要な証明書が自動でインストールされます。完了後、再度プログラムを実行すれば、多くの場合エラーは解消されているはずです。

### その他の解決策：certifiの更新

証明書を管理しているcertifiパッケージが古い可能性もあります。ターミナルで以下のコマンドを実行し、パッケージを最新版に更新してみてください。

```bash
pip install --upgrade certifi
```

## ⚠️ 注意点：検証無効化のリスク

SSL証明書の検証を無効にすることは、ドアに鍵をかけずに外出するようなものです。これにより、**中間者攻撃（Man-in-the-Middle Attack）** のリスクに晒されます。

悪意のある第三者が通信の途中に割り込み、本物のサーバーになりすまして情報を盗んだり、改ざんしたりする可能性があります。

したがって、根本的な解決策である`Install Certificates.command`の実行を強く推奨します。

## 🎉 まとめ

macOSでPythonを使う際に遭遇しがちな`ssl.SSLCertVerificationError`は、Pythonが信頼できる証明書リストを持っていないことが主な原因です。

- **最善の策**: アプリケーションフォルダ内の`Install Certificates.command`を実行する。
- **次善の策**: `pip install --upgrade certifi`で関連パッケージを更新する。
- **最終手段（非推奨）**: コード内でSSL検証を一時的に無効にする。

この手順で、安全に問題を解決し、快適な開発を進めましょう！