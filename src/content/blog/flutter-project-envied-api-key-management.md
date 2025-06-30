---
title: "FlutterプロジェクトにEnviedを導入してAPI Keyを管理する！"
date: 2024-02-03
description: "enviedのbuild_runner実行時のエラーに対処する方法について解説します。"
tags: ["Flutter","env"]
category: Tech
---

ChatGPTのAPI Keyを環境変数として利用するため[Envied](https://pub.dev/packages/envied)を導入しようとしたのですが、 公式のReadme通りにやってもbuild_runner実行時にエラーが発生しました。  
その対処法が見つかったのでメモを残しておきます。  

## 開発環境

**・ OS: Windows 11  
・ Flutter: v3.16.5  
・ Dart: v3.2.3  
・ Envied: ^0.5.3**

## ディレクトリ構成

最終的な構成は下記の通りです。
```bash
lib/
  ┣ env/
  ┃  ┣ env.dart
  ┃  ┗ env.g.dart
  ┗ main.dart
.env.dev
.gitignore
~~~ 以下略 ~~~
```

## 下準備

.gitignoreに下記を追記してenv関連を除外しておきます。
```bash title=".gitignore" ins={1-2}
.env*
env/
```

環境ファイル（.env.devとします）に利用したい環境変数の名前と値を入力します。
```dotenv
OPENAI_API_KEY='sk-###'
```

lib/env/にenv.dartを作成します。コードは下記になります。
```dart
// env.dart
import 'package:envied/envied.dart';

part 'env.g.dart';

@Envied(path: '.env.dev')
abstract class Env {
  @EnviedField(varName: 'OPENAI_API_KEY', obfuscate: true)
  static final String OPENAI_API_KEY = _Env.OPENAI_API_KEY;
}
```
注意点として、**@EnviedFieldのvarNameの値と使用する環境変数名は一致**させないといけないようです。  

## env.g.dartを生成する

筆者の場合、Flutterプロジェクトで利用するため、以下のコマンドでEnviedをインストールします。
```bash
flutter pub add envied
flutter pub add --dev envied_generator
flutter pub add --dev build_runner
```

次にenv.g.dartを生成するコマンドを入力します。
```bash
dart run build_runner build --delete-conflicting-outputs
```

すると、lib/env/にenv.g.dartというファイルが生成されます。こちらが生成されていれば導入は完了です。
```dart title="lib/env/env.g.dart"
// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'env.dart';

// **************************************************************************
// EnviedGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: type=lint
final class _Env {
  static const List<int> _enviedkeyOPENAI_API_KEY = <int>[
    3044926770,
    1562077553,
    844297019,
    1889294018,
    1834524378,
~~~ 以下略 ~~~
```

## 使用例

下記のコードでコンソール上にAPI Keyの値を出力してみます。
```dart
import 'env/env.dart';
void main() {
  print(Env.OPENAI_API_KEY); // sk-###
}
```
環境ファイルに記入した値がコンソールに出力されれば成功です。
___
参考リンク:
>[Flutter ENVied package build runner error](https://stackoverflow.com/questions/77540172/flutter-envied-package-build-runner-error)