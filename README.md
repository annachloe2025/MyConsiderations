# MyConsiderations — 日々の気づき

現時点での個人的考察・見解・分析を集積するプロジェクト。

公開URL: <https://annachloe2025.github.io/MyConsiderations/>

## このサイトについて

日常の中でふと気づいたこと、考えたことを書き留めているメモ集。各記事は「現時点での考察」であり、将来書き換えられる可能性が前提。結論を出すためではなく、思考の過程そのものを記録している。

## カテゴリ

- 言語 — 日本語と英語の概念のズレ、言語化能力
- 文学 — 小説論、創作論、メンタルモデリング
- 哲学 — 進化論的思考、本能と文明、個人の内面
- 社会 — 政治構造、ジェンダー、制度設計
- AI・情報 — AI批評、プロンプト技法、対話分析
- 健康 — 室内環境、運動、医学的考察

## ローカルで動かすには

```powershell
cd MyConsiderations
pip install -r requirements.txt
python -m mkdocs serve
# → http://127.0.0.1:8000
```

## 公開の更新

```powershell
update.bat
```

これでコミット → push → `mkdocs gh-deploy` が自動実行され、GitHub Pages に反映されます。
