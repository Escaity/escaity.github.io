---
title: "pod installで EACCES - Permission denied でインストールできない場合の対処方法"
date: 2024-01-31
description: "pod instal で管理者権限関連のエラーが発生した時の対処法について解説します。"
tags: ["Unity"]
category: エラー
---

iOSビルドに広告関連のSDKが入っている場合podを導入する必要があるのですが、podをアップデートした際にpermissionが変更されてしまったのか、下記のようなエラーが発生していました。
```bash
Errno:: EACCES - Permission denied @ rb_sysopen - /Users/d4ken/Library/Caches/CocoaPods/Pods/VERSION
~~~ 以下略 ~~~
```
こちらのエラー発生原因として~/Library/Caches/CococaPodsの権限がrootになっていることが考えられます。

こちらの権限を変更するには下記のコマンドを入力します。
```bash
sudo chown -R `whoami` ~/Library/Caches/CocoaPods
```
再度pod installしてみます。
```bash
$ pod install
Analyzing dependencies
Downloading dependencies
Installing Ads-Global (5.6.0.9)
Installing BURelyFoundation_Global (0.1.3.3)
Installing FBAEMKit (13.2.0)
Installing FBAudienceNetwork (6.14.0)
~~~ 以下略 ~~~
```


エラーの表示はなくなり、無事.xcworkspaceが生成されました。  
___
参考リンク:
>[Error running pod install for an update due to permissions](https://stackoverflow.com/questions/19956425/error-running-pod-install-for-an-update-due-to-permissions)