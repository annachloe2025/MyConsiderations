"""
MkDocs hook: 日付別アーカイブと各カテゴリの記事一覧を自動生成する。

- 各 .md ファイルのファイル名先頭の日付プレフィックス（YYYY-MM-DD）を抽出し、
  docs/archive.md を年月ごとにグルーピングして書き出す。
- 各カテゴリの index.md にある「## 記事一覧」見出し以降に、
  そのカテゴリの記事リストを日付降順で書き込む。

ビルドのたびに毎回再生成されるので、新しい記事を追加しても自動で反映される。

使い方（mkdocs.yml）:
    hooks:
      - hooks/generate_archive.py
"""

import re
import sys
from collections import defaultdict
from pathlib import Path


_DATE_PREFIX_PATTERN = re.compile(r"^(\d{4}-\d{2}-\d{2})_(.+)\.md$")
_EXCLUDE_FILES = {"index.md", "tags.md", "archive.md"}
_ARTICLE_LIST_HEADER = "## 記事一覧"


def on_pre_build(config):
    docs_dir = Path(config["docs_dir"])

    posts = []
    posts_by_category = defaultdict(list)

    for md_file in docs_dir.rglob("*.md"):
        if md_file.name in _EXCLUDE_FILES:
            continue

        match = _DATE_PREFIX_PATTERN.match(md_file.name)
        if match:
            date_str, title = match.group(1), match.group(2)
        else:
            date_str = "0000-00-00"
            title = md_file.stem

        rel_path = md_file.relative_to(docs_dir)
        category = rel_path.parts[0] if len(rel_path.parts) > 1 else "未分類"

        post = {
            "date": date_str,
            "title": title,
            "category": category,
            "path": str(rel_path).replace("\\", "/"),
            "filename": md_file.name,
        }
        posts.append(post)
        posts_by_category[category].append(post)

    posts.sort(key=lambda p: (p["date"], p["title"]), reverse=True)

    # 1) docs/archive.md を生成
    write_archive(docs_dir, posts)

    # 2) 各カテゴリの index.md の「## 記事一覧」以降を更新
    update_category_indexes(docs_dir, posts_by_category)

    print(
        "[generate_archive] wrote archive.md ("
        + str(len(posts))
        + " posts) and updated "
        + str(len(posts_by_category))
        + " category indexes",
        file=sys.stderr,
    )


def write_archive(docs_dir, posts):
    by_month = defaultdict(list)
    for post in posts:
        if post["date"] == "0000-00-00":
            ym = "日付不明"
        else:
            ym = post["date"][:7]
        by_month[ym].append(post)

    lines = []
    lines.append(
        "<!-- このファイルは hooks/generate_archive.py によって自動生成されます。"
        "手動で編集しても次回ビルド時に上書きされます。 -->"
    )
    lines.append("")
    lines.append("# 日付別アーカイブ")
    lines.append("")
    lines.append("全記事を投稿日順に並べたページ。最新の記事が上に来ます。")
    lines.append("")
    lines.append("現在の記事総数: **" + str(len(posts)) + "件**")
    lines.append("")

    sorted_months = sorted(
        by_month.keys(), key=lambda k: (k != "日付不明", k), reverse=True
    )

    for ym in sorted_months:
        lines.append("## " + ym)
        lines.append("")
        for post in by_month[ym]:
            line = (
                "- **"
                + post["date"]
                + "** ["
                + post["title"]
                + "]("
                + post["path"]
                + ") <small>（"
                + post["category"]
                + "）</small>"
            )
            lines.append(line)
        lines.append("")

    archive_path = docs_dir / "archive.md"
    archive_path.write_text("\n".join(lines), encoding="utf-8")


def update_category_indexes(docs_dir, posts_by_category):
    """各カテゴリの index.md の「## 記事一覧」以降を自動生成する。"""
    for category, cat_posts in posts_by_category.items():
        idx_path = docs_dir / category / "index.md"
        if not idx_path.exists():
            continue

        content = idx_path.read_text(encoding="utf-8")

        # 「## 記事一覧」見出しを探す
        pos = content.find(_ARTICLE_LIST_HEADER)
        if pos == -1:
            # 見出しがない場合は何もしない（ユーザーが意図的に記事一覧を出さない選択）
            continue

        # 見出しまでを保持
        before = content[: pos + len(_ARTICLE_LIST_HEADER)]

        # 記事を日付降順でソート
        sorted_posts = sorted(
            cat_posts, key=lambda p: (p["date"], p["title"]), reverse=True
        )

        lines = [""]
        lines.append(
            "<!-- 以下は hooks/generate_archive.py によって自動生成されます。"
            "手動で編集しても次回ビルド時に上書きされます。 -->"
        )
        lines.append("")
        for post in sorted_posts:
            line = (
                "- **"
                + post["date"]
                + "** ["
                + post["title"]
                + "]("
                + post["filename"]
                + ")"
            )
            lines.append(line)
        lines.append("")

        new_content = before + "\n".join(lines)

        # 内容が変わっていなければ書き直さない（mtime保護）
        if new_content != content:
            idx_path.write_text(new_content, encoding="utf-8")
