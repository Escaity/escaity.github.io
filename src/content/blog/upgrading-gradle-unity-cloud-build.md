---
title: "Unity Cloud BuildのGradleをバージョンアップしてビルドする！"
date: 2024-01-13
description: "Unity Cloud BuildでGradleバージョンをアップグレードしてビルドする方法を解説します。"
tags: ["Unity"]
category: Tech
---

業務で開発しているゲームの広告SDKアップデートに伴い、Gradleをv6.7.1以降にアップグレードする必要がでてきました。
ローカル環境でビルドする分には大した作業ではないですが、Unity Cloud Buildでビルドする方法についてはまとまった情報がなかったため、備忘録もかねてこちらでまとめました。  
手順としては  
**[ 1 ]  pre-build scriptを作成する**  
**[ 2 ]  Pre-Export methodを作成する**  
**[ 3 ]  Unity Build Automationの Configurationを編集する**  
という流れになります。順に解説していきます。

## 1. pre-build script を作成する
Unity プロジェクトのルート直下に **.ci** というディレクトリを作成し、その中に **pre-build-script.sh** (ディレクトリ、ファイル名は自身が分かれば何でも良いです）を作成します。
ディレクトリ構造は下記のようになります。
```bash
project_root
┣ .ci
  ┗ pre-build-script.sh
┣ Assets
┣ Packages
...
```
<br>

**pre-build-script.sh**にはUnityクラウド環境に指定バージョンのGradleをインストールするためのスクリプトを記述します。(私の場合は6.7.1を指定しています。)
```bash
#!/bin/bash
# pre-build-script.sh
set -euxo pipefail
cd "$USERPROFILE"
curl -LO https://services.gradle.org/distributions/gradle-6.7.1-bin.zip

unameOut="$(uname -s)"
case "${unameOut}" in
    Darwin*)    unzip "gradle-6.7.1-bin";;
    CYGWIN*)    7z x "gradle-6.7.1-bin.zip";;
esac

ls -lh gradle-6.7.1
```
<br>

## 2. Pre-Export method を作成する
UnityプロジェクトのEditorディレクトリ内に**PreProcessBuild.cs**というクラスを作成します。手順1でインストールしたGradleのパスをビルド前に反映するメソッドを記述します。(Gradleバージョンは手順1で指定したものと同一にします)
```c#
// PreProcessBuild.cs
using System;
using System.IO;
using UnityEditor;
using UnityEngine;

namespace Project.Editor
{
    public class PreProcessBuild
    {
        public static void ChangeGradle()
        {
            EditorPrefs.SetBool("GradleUseEmbedded", false);
            var workspacePath = Environment.GetEnvironmentVariable("USERPROFILE");
            var gradlePath = Path.Combine(workspacePath, "gradle-6.7.1");
            EditorPrefs.SetString("GradlePath", gradlePath);
            Debug.Log("PreProcessBuild - changed path: "+EditorPrefs.GetString("GradlePath"));
        }
    }
}
```
<br>

## 3. Unity Build Automation の Configurationを編集する

Unity Cloudの　**DevOps > Build Automation > Configurations** から作成した**Target setup**の編集ページを開き、**Advanced settings**の**Script hooks**項目を編集します。
**Pre-build script**項目には手順1で作成したスクリプトのパスを、**Pre-Export method**項目は手順2で作成したクラスの名前空間を含めたメソッド名を入力します。
![システム設定](/entries/20240113/scripts_hooks.png)  
設定を保存して完了です。  
以上の設定を行い、Gradleがv6.7.1にアップグレードされた状態でクラウドビルドが出来ました。  
___
参考リンク:

>[How Do I Change the Gradle Version in Unity Build Automation?](https://support.unity.com/hc/en-us/articles/10900888253076-How-Do-I-Change-the-Gradle-Version-in-UCB-)  
>[Unity Cloud Buildでビルド後に独自のスクリプトを差し込む、成果物(ipa/apkなど)をAppCenterにアップロードする](https://blog.yucchiy.com/2022/12/ucb-post-script-upload-to-appcenter/)