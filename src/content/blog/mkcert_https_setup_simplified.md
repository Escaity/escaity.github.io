---
title: "ローカル開発をHTTPS対応に！Vite環境にmkcert導入する！！"
date: 2025-06-28
description: "ローカルHTTPS化を簡単に行えるツール「mkcert」の使い方と注意点を紹介"
tags: ["Web", "Vite"]
category: Tech
---

本番環境はHTTPSが常識ですが、ローカルでもHTTPSを使えば以下のメリットがあります：

- Secure Cookie や Web Crypto API が使える
- 本番との差異によるバグを防止できる

ここでは、ローカルHTTPS化を簡単に行えるツール「mkcert」の使い方と注意点を紹介します。

---

## 1. mkcertの導入と証明書作成

### 🔧 インストール（macOS + Homebrew）

```bash
brew install mkcert
mkcert -install
```

成功すると以下のようなメッセージが表示されます：

```
The local CA is now installed in the system trust store! ⚡️
```

### 🔐 証明書の作成

```bash
mkcert localhost 127.0.0.1 ::1
```

`localhost.pem` と `localhost-key.pem` の2つのファイルが生成されます。

---

## 2. 開発サーバーへの設定（例：Vite）

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
});
```

この設定後、`npm run dev` で `https://localhost:xxxx` にアクセス可能になります。

---

## 3. Firefoxでの注意点

`mkcert -install` 実行時、次の警告が出る場合があります：

```
Warning: "certutil" is not available, so the CA can't be automatically installed in Firefox!
```

### 🛠 対処法

```bash
brew install nss
mkcert -install
```

FirefoxがローカルCAを信頼するようになります。

> ※ Firefoxを使わない場合、この警告は無視してOKです。

---

これでローカルHTTPS開発環境が整いました！
