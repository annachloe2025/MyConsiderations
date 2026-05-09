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
├── .gitignore          ← site/, __pycache__/, _archive/ を除外
├── hooks/
│   └── generate_archive.py  ← archive.md を自動生成するhook
├── overrides/
│   └── main.html       ← Material override（apple-touch-icon等の <head> 追加）
├── _archive/           ← 公開対象外。原本資料・対話ログ・下書きの置き場
│                         （.gitignoreで除外、GitHubには上がらない）
└── docs/               ← MkDocsの docs_dir
    ├── index.md        ← トップページ
    ├── tags.md         ← タグ一覧ページ（自動集計）
    ├── archive.md      ← 日付別アーカイブ（hookで自動生成。手で編集しない）
    ├── assets/         ← アイコン・manifest.json
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

## 原本資料の置き場（_archive/）

まとめる前のChatGPT/Claudeの対話ログ、走り書き、下書き等は `_archive/` に置く。

- 公開対象外（docs_dir の外なのでサイトに含まれない）
- `.gitignore` で除外されているのでGitHubにも上がらない
- ローカルのバックアップ目的で保持

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

---

## YouTube動画化ワークフロー（youtube/ サブフォルダ）

記事を Codex の `genelate_mp4` パイプラインで動画化し、YouTube Data API v3 経由で `@anna-chloe` チャンネルにアップロードする運用。

### フォルダ構成

```
youtube/
├── outputs/<記事名>/
│   ├── 01_plan/ ... 08_chapters/   ← Codex 生成物
│   └── 09_description/              ← Claude 生成物
│       ├── description.txt          ← YouTube概要欄
│       └── metadata.json            ← title, tags, categoryId, playlistId, youtube_id 等
├── .credentials/                    ← OAuth クライアント＋トークン（.gitignore）
├── upload_to_youtube.py             ← アップロード本体
├── add_to_playlist.py               ← 既存動画を再生リストに追加
├── sync_from_youtube.py             ← YouTubeを真実とした metadata.json 復旧
├── upload_log.md                    ← アップロード履歴（追記のみ）
└── YouTubeへアップロード.bat       ← メニュー型ランチャー
```

### 重要：Cowork ↔ Windows ファイル同期問題（FUSE キャッシュ）

Cowork の rclone FUSE マウントは `cache_duration_s=3600` のため、**Cowork から書き込んだファイルが Windows 側で更新された後、最大 1 時間 Cowork の view が古いまま** になる既知バグがある（[anthropics/claude-code#55877](https://github.com/anthropics/claude-code/issues/55877)）。

具体的に起きる現象：

- Claude が `metadata.json` を初期作成（youtube_id なし）
- ユーザーが bat 実行 → Python on Windows が `youtube_id` を追記
- Claude が bash で metadata.json を読むと **古い（youtube_id なし）バージョンが返る**
- Claude が「壊れている！」と誤検知 → Windows 上の正しい metadata を上書きしてしまう

#### 運用ルール（必読）

1. **「ローカルファイルが壊れて見える」と感じたら、まず YouTube API で実状態を確認する**。bash 経由のローカル読み取りは信用しない
2. **metadata.json を編集する場合、必ず `youtube_id` を保持する**
   - 既存の値が分からない場合は YouTube API で取得（`videos.list` = 1ユニット）
   - 上書きしない
3. **Python 側の書き込みには `safe_write_metadata()` を使う**（書き込み後にリトライ付き自己検証）
4. **ユーザーに毎回ファイル状態を確認させない**。検証は API 経由か、Windows 上で動く Python 自身が行う
5. **Read ツール（host-direct）の view は信用してよい**。bash 経由は信用しない

#### 復旧方法

ローカル metadata.json が本当に壊れた／youtube_id を失った場合：

```powershell
cd C:\Users\hoeho\Documents\Claude\MyProfile\MyConsiderations\youtube
python sync_from_youtube.py
```

YouTube から実状態を取得して metadata.json を再構築する。bat の `[6]` メニューからも実行可能。

### YouTube Data API v3 クォータ

- 無料枠：1日 10,000 ユニット（太平洋時間 0時 = JST 16時 リセット）
- `videos.insert`: 100u（公式表）／`thumbnails.set`: 50u／`videos.update`: 50u
- `playlistItems.insert`: 50u／`playlistItems.list`: 1u
- 1日のアップロード上限の目安：60〜90本

### bat メニュー

| 番号 | 内容 | クォータ |
|---|---|---|
| 1 | 未アップロード動画を全部 unlisted でアップ | 1本 ~150u |
| 2 | 未アップロード動画を全部 public でアップ | 同上 |
| 3 | フォルダ名指定で 1 本だけ unlisted | 同上 |
| 4 | サムネ無し版（未承認チャンネル用） | 1本 100u |
| 5 | 既存動画を再生リストに一括追加 | 1本 50u |
| 6 | metadata.json を YouTube と同期（復旧） | 全体で 2u |

### 既存の状態を確認するには

ローカルファイル不信なので、YouTube 側の事実確認は API で：

```python
# 全動画の現状確認
from upload_to_youtube import get_auth_creds
from googleapiclient.discovery import build
yt = build("youtube", "v3", credentials=get_auth_creds())
ch = yt.channels().list(part="contentDetails", mine=True).execute()
uploads_pid = ch["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
items = yt.playlistItems().list(part="snippet,contentDetails", playlistId=uploads_pid, maxResults=50).execute()
for it in items["items"]:
    print(it["contentDetails"]["videoId"], it["snippet"]["title"])
```

### 再生リスト

「日々の気づき」: `PLk4KuUDWhnrbesTOP0IDsJHrJeLXoTRW6`
新しい動画は metadata.json の `playlistId` に上記 ID を指定すれば自動追加される。
