---
title: "cx_FreezeでPythonアプリをexe化!Windows用にsetup.pyを作成!!"
date: 2025-07-01
description: "setup.py を、Windowsでも使えるようにする手順を紹介します。"
tags: ["Python"]
category: Tech
---

Pythonで開発したGUIアプリケーションを、他の人が簡単に実行できる形式（Windowsなら.exe、macOSなら.app）に変換したい、と考えたことはありませんか？ `cx_Freeze` は、そんな願いを叶えてくれる便利なライブラリです。

しかし、開発環境がmacOSで、配布先がWindows（またはその逆）の場合、設定ファイルである `setup.py` の記述に少し工夫が必要になります。

筆者の開発環境はMacOSですが、Windowsでもビルドできるように方法を調べたので解説します。

---

## はじめに：macOS向けの setup.py

最初に、macOSでの実行を想定して書かれた `setup.py` を見てみましょう。(筆者がPySide6ライブラリを用いてGUIアプリを開発した際に作成した`setup.py`の参考例になります。)

```python
# setup.py (macOS version)
import sys
from cx_Freeze import setup, Executable
from pathlib import Path

# 基本情報
APP_NAME = "Sample App"
APP_VERSION = "2.0.0"

# ... (中略) ...

# macOS用の基本設定
build_exe_options = {
    "packages": ["PySide6.QtCore", "PySide6.QtGui", "PySide6.QtWidgets"],
    "excludes": ["tkinter", "unittest", "test"],
    "optimize": 2,
}

# アイコンファイルのパス
icon_path = Path("resources/icons/icon.icns")

# 実行ファイル設定
executables = [
    Executable(
        "main.py",
        target_name=APP_NAME,
        icon=str(icon_path) if icon_path.exists() else None,
    )
]

# macOS用バンドル設定
bdist_mac_options = {
    "bundle_name": APP_NAME,
    "iconfile": str(icon_path) if icon_path.exists() else None,
}

# セットアップ
setup(
    name=APP_NAME,
    version=APP_VERSION,
    options={
        "build_exe": build_exe_options,
        "bdist_mac": bdist_mac_options, # macOS専用のオプション
    },
    executables=executables,
)
```

このスクリプトには、macOS専用の設定（`bdist_mac_options`）やアイコン形式（`.icns`）がハードコードされています。このままではWindows環境で正しくビルドできません。

---

## Windows対応に重要な3つのポイント

この `setup.py` をWindowsに対応させるには、主に以下の3点を修正・追記する必要があります。

### 1. コンソールウィンドウを非表示にする (`base`)

GUIアプリケーションをWindowsで実行すると、背後にコマンドプロンプト（黒い画面）が表示されてしまうことがあります。これを防ぐには、`Executable` の引数に `base="Win32GUI"` を指定します。

### 2. Windows用のアイコンを指定する（`.ico`）

macOSのアイコンが `.icns` 形式であるのに対し、Windowsの実行ファイルでは `.ico` 形式のアイコンが必要です。プラットフォームに応じて使用するアイコンファイルを切り替える仕組みを導入します。

### 3. OSを判定して設定を切り替える（`sys.platform`）

`sys.platform` を使うことで、スクリプトが実行されているOSを判定できます。

---

## 完成形：クロスプラットフォーム対応 setup.py

```python
import sys
from cx_Freeze import setup, Executable
from pathlib import Path

# --- 基本情報 ---
APP_NAME = "Sample App"
APP_VERSION = "2.0.0"

# --- 共通設定 ---
packages = ["PySide6.QtCore", "PySide6.QtGui", "PySide6.QtWidgets"]
excludes = ["tkinter", "unittest", "test"]
include_files = ["resources/"]

build_exe_options = {
    "packages": packages,
    "excludes": excludes,
    "include_files": include_files,
    "optimize": 2,
}

# --- プラットフォームごとの設定 ---
base = None
icon_path = None
target_name = APP_NAME
options = {"build_exe": build_exe_options}

# Windowsの設定
if sys.platform == "win32":
    base = "Win32GUI"
    icon_path = Path("resources/icons/icon.ico")
    target_name = f"{APP_NAME}.exe"

# macOSの設定
elif sys.platform == "darwin":
    icon_path = Path("resources/icons/icon.icns")
    bdist_mac_options = {
        "bundle_name": APP_NAME,
        "iconfile": str(icon_path) if icon_path.exists() else None,
    }
    options["bdist_mac"] = bdist_mac_options

# --- 実行ファイル設定 ---
executables = [
    Executable(
        "main.py",
        base=base,
        target_name=target_name,
        icon=str(icon_path) if icon_path and icon_path.exists() else None,
    )
]

# --- セットアップ実行 ---
setup(
    name=APP_NAME,
    version=APP_VERSION,
    description="Sample App",
    options=options,
    executables=executables,
)
```

---

## ビルド方法

各OSで以下のコマンドを実行するだけで、それぞれの環境に対応した実行ファイルを作成できます。

```bash
# 実行ファイルを作成
python setup.py build

# WindowsでMSIインストーラーを作成する場合（オプション）
python setup.py bdist_msi

# macOSでappバンドルを作成する場合
python setup.py bdist_mac
```

---

## まとめ

`sys.platform` を活用することで、`setup.py` を一つ用意するだけで、WindowsとmacOSの両方に対応したアプリケーションのビルドが可能になります。OSごとの細かな違いをスクリプト内で吸収することで、開発と配布のプロセスがよりスマートになりました。
