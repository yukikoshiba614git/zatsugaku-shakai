# 雑学アプリ 自動化ガイド（Claude Code用）

## このリポジトリについて

中学生向け地理学習アプリ。地方ごとに1つのHTMLファイルを `chiri/` に配置し、GitHub Pagesで公開している。

- 公開URL: https://yukikoshiba614git.github.io/zatsugaku-shakai/
- 完成済み: `chiri/kyushu.html`

---

## 新しい地方を追加する手順

### ステップ1：データファイルを確認する

```
data/{地方名}_data.json
```

このファイルがあることを確認する。なければ作業を止めてユーザーに伝える。

### ステップ2：HTMLを生成する

```bash
node generate.js {地方名}
```

例：
```bash
node generate.js chugoku
node generate.js kinki
```

成功すると `chiri/{地方名}.html` が生成される。

### ステップ3：GitHubにpushする

```bash
git add chiri/{地方名}.html
git commit -m "Add {地方名}.html：{地方の日本語名}地方"
git push origin main
```

### ステップ4：完了を報告する

pushが成功したら、以下を伝える：
- 生成されたファイル名
- 公開URL（例: https://yukikoshiba614git.github.io/zatsugaku-shakai/chiri/chugoku.html）

---

## ファイル構造

```
zatsugaku-shakai/
├── CLAUDE.md              ← このファイル
├── template.html          ← HTMLテンプレート（編集しない）
├── generate.js            ← 生成スクリプト（編集しない）
├── data/
│   ├── chugoku_data.json
│   ├── kinki_data.json
│   └── ...
└── chiri/
    ├── kyushu.html        ← 完成済み
    ├── chugoku.html       ← 生成されるファイル
    └── ...
```

---

## 地方名の対応表

| 地方名（英語） | 日本語名 | ファイル名 |
|-------------|---------|----------|
| chugoku | 中国・四国 | chugoku.html |
| kinki | 近畿 | kinki.html |
| chubu | 中部 | chubu.html |
| kanto | 関東 | kanto.html |
| tohoku | 東北 | tohoku.html |
| hokkaido | 北海道 | hokkaido.html |

---

## 注意事項

- `template.html` と `generate.js` は編集しない
- `data/` フォルダのJSONファイルは編集しない
- `chiri/kyushu.html` は編集しない（完成済みの参考ファイル）
- pushするブランチは必ず `main`
