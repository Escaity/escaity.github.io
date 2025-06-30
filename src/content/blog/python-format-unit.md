---
title: "【Python】数値を単位(K,M,G)表記に変換する！！ "
date: 2025-06-27
description: "数値の単位表記をPythonで簡単に実現する方法をご紹介します。"
tags: ["Python"]
category: Tech
---


Webサイトの閲覧数やアプリのダウンロード数、金額などを表示するとき、「1234567」とそのまま表示するよりも「1.2M」と表示した方が、ぐっと直感的で分かりやすくなりますよね。

今回は、そんな数値の単位表記をPythonで簡単に実現する方法をご紹介します。コピペしてすぐに使える関数を作成しましたので、ぜひ活用してください！


## 実装コード
```python
def format_unit(num, precision=1):
    """数値をK, M, G, Tなどの単位表記に変換"""
    if not isinstance(num, (int, float)):
        raise TypeError("数値ではありません。")
    
    if num == 0:
        return "0"
    
    # 負数の処理
    sign = '-' if num < 0 else ''
    num = abs(num)
    
    # 単位リスト（大きい順）
    units = [
        (1_000_000_000_000, 'T'),  # テラ
        (1_000_000_000, 'G'),      # ギガ
        (1_000_000, 'M'),          # メガ
        (1_000, 'K'),              # キロ
    ]
    
    for unit_value, unit_symbol in units:
        if num >= unit_value:
            value = num / unit_value
            formatted_value = f'{value:.{precision}f}'
            
            # 小数点以下が0の場合は整数表示
            if formatted_value.endswith(f'.{"0" * precision}'):
                formatted_value = f'{int(value)}'
                
            return f'{sign}{formatted_value}{unit_symbol}'
    
    # 1000未満はそのまま
    return f'{sign}{int(num) if num == int(num) else num}'
```

## 使い方と実行結果
この関数を使うと、こんな風に数値を変換できます。
```python
print(format_unit(1234))          # → 1.2K  ← すっきり！
print(format_unit(1000000))       # → 1M   ← 一目瞭然！  
print(format_unit(1850000, 2))    # → 1.85M ← 精度も自由自在
print(format_unit(1234567890))    # → 1.2G  ← 10億超えもお任せ
print(format_unit(-5432))         # → -5.4K ← マイナスも対応
```


`precision`パラメータにより、小数点以下の表示桁数を柔軟に調整できます。

## 実装のポイント

### 単位定義の順序設計
```python
units = [
    (1_000_000_000_000, 'T'), # テラ（1兆）
    (1_000_000_000, 'G'),     # ギガ（10億）
    (1_000_000, 'M'),         # メガ（100万）
    (1_000, 'K'),             # キロ（1千）
]
```

**重要：** 単位リストは降順（大きい順）で定義する必要があります。こうすることで、例えば 1,234,567 という数値が来たときに、まず T (1兆) や G (10億) のチェックをスキップし、M (100万) で正しく判定されるようになります。
### 動的フォーマット処理
Python 3.6から導入された f-string を使うと、文字列のフォーマットがとても簡単に書けます。
```python
formatted_value = f'{value:.{precision}f}'
```
f-string記法を活用しています。{変数名:.{桁数}f} のように書くことで、変数を指定した小数点以下の桁数で表示できます。

### 表示最適化ロジック

```python
if formatted_value.endswith(f'.{"0" * precision}'):
    formatted_value = f'{int(value)}'
```
小数点以下がすべて0の場合（例：`1.0M`）は、整数表示（`1M`）に自動変換することで、より洗練された出力を実現しています。
