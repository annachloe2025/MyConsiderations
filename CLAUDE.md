# 日々の気づき (MyConsiderations)

日常の中でふと気づいたこと、考えたことを書き留めているメモ集。「現時点での個人的考察・見解・分析」を集積するプロジェクト。

- フォルダ名 / リポ名: `MyConsiderations`
- サイト表示名: 日々の気づき
- 公開URL: https://annachloe2025.github.io/MyConsiderations/

## このフォルダの目的

物理の勉強中、ニュースを見たとき、AIと対話しているときなど、日常のふとした瞬間に生まれた「気づき」を言語化して残す場所。結論を出すためではなく、思考の過程そのものを記録している。各記事は「現時点での考察」であり、将来書き換えられる可能性が前提。

## 主なテーマ

- **言語と認知** — 日本語と英語の概念のズレが理解を妨げる構造への気づき（例：「保存」がconserve/preserve/keep/saveを全部隠してしまう問題）
- **社会・政治の構造** — 善意の管理が支配に変わる危うさ、情報弱者とAIの関係など
- **人間の本能と文明の乖離** — 進化の時間軸と文明の時間軸のミスマッチ。「悪役は悪くない」という視点
- **AI の振る舞いへの批評** — ChatGPTの詭弁的な話し方の分析、AIが誠実性より体裁を優先する構造的な問題
- **小説のアイデア** — 気づきから派生した物語の種（「見えない牢屋」など）
- **個人の内面** — 世界への責任感を手放すことで得られた解放感と、その矛盾

## 思考の特徴

- 表面的な正しさより「構造」を掘る
- 善悪の二項対立を避け、両方の立場を時間軸や進化の視点で捉える
- 「悲しい」という感情を結論として恐れない
- AIに対しても人間に対しても、誠実さ＞快適さを重視する

## ファイル構成（MkDocs対応）

このフォルダは MkDocs（Material for MkDocs）で公開する形に整備されている。

```
MyConsiderations/
├── mkdocs.yml          ← MkDocs設定
├── requirements.txt    ← Python依存関係
├── CLAUDE.md           ← このファイル（プロジェクトのメタ情報）
├── README.md           ← GitHub用説明
├── update.bat          ← コミット＋push＋gh-deploy のワンクリック実行
├── hooks/
│   └── generate_archive.py  ← archive.md を自動生成するhook
└── docs/               ← MkDocsの docs_dir
    ├── index.md        ← トップページ
    ├── tags.md         ← タグ一覧ページ（自動集計）
    ├── archive.md      ← 日付別アーカイブ（hookで自動生成。手で編集しない）
    ├── 言語/
    ├── 文学/
    ├── 哲学/
    ├── 社会/
    ├── AI・情報/
    └── 健康/
```

## 3つの導線

- **大分類**（左タブ）: 言語/文学/哲学/社会/AI・情報/健康のフォルダで分類
- **タグ**（/tags/ ページ）: ファイル先頭の `tags:` front matterから横断集計
- **日付別**（/archive/ ページ）: ファイル名の `YYYY-MM-DD_` プレフィックスから年月別アーカイブを自動生成

## ファイル命名規則

`YYYY-MM-DD_タイトル.md` を基本とする（例外あり）。

## 新しいメモを追加するとき

- 該当する大分類フォルダ（言語/文学/哲学/社会/AI・情報/健康）に保存
- ファイル先頭に YAML front matter で複数タグを付与する
  ```yaml
  ---
  tags:
    - タグ1
    - タグ2
  ---
  ```
- 「きっかけ → 気づき → 自分なりの解釈」の流れで書く
- 正解を出す必要はない。考えた過程を残すことが目的

## ローカルで確認するには

```powershell
cd C:\Users\hoeho\Documents\Claude\MyProfile\MyConsiderations
python -m mkdocs serve
# → http://127.0.0.1:8000
```

## 公開（GitHub Pages）するには

```powershell
update.bat
```

これでコミット → push → `mkdocs gh-deploy` が走り、 https://annachloe2025.github.io/MyConsiderations/ に反映される。
