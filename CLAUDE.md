# 雑学アプリ 完全自動化ガイド（Claude Code用）

## このリポジトリについて

中学生向け地理学習アプリ。地方ごとに1つのHTMLファイルを `chiri/` に配置し、GitHub Pagesで公開している。

- 公開URL: https://yukikoshiba614git.github.io/zatsugaku-shakai/
- 完成済み: `chiri/kyushu.html` `chiri/chugoku.html` `chiri/kinki.html`

---

## 「〇〇地方を追加して」と言われたら、全部自動でやること

### ステップ1：データJSONを自動生成してファイルに保存する

`data/{地方名}_data.json` が存在しない場合、データを生成してPythonで保存する。

生成するデータの仕様：
- items: 30項目（各セクション6項目）
- quizzes: 15問
- sections: 5つ（地方の特徴に合わせて設定）
- 中学生が「おもしろい！」と思える雑学スタイル

データ保存のコマンド例：
```bash
python3 -c "
import json
data = { ...生成したデータ... }
with open('data/chubu_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f'items={len(data[\"items\"])}個, quizzes={len(data[\"quizzes\"])}問')
"
```

### ステップ2：HTMLを生成してpushする

```bash
node generate.js {地方名} --push
```

これ1コマンドでHTML生成＋git commit＋pushまで完了する。

### ステップ3：完了を報告する

- 公開URL を必ず報告すること
- 例: https://yukikoshiba614git.github.io/zatsugaku-shakai/chiri/chubu.html

---

## ファイル構造

```
zatsugaku-shakai/
├── CLAUDE.md
├── template.html          （編集禁止）
├── generate.js            （編集禁止）
├── data/
│   └── {地方名}_data.json
└── chiri/
    └── {地方名}.html
```

---

## 地方名の対応表

| 英語 | 日本語 | 主なテーマ |
|------|--------|----------|
| chubu | 中部 | 自然環境・中京工業・中央高地農業・北陸・交通 |
| kanto | 関東 | 自然環境・東京・過密問題・工業・農業 |
| tohoku | 東北 | 自然環境・農業・伝統文化・工業・震災復興 |
| hokkaido | 北海道 | 自然環境・開拓・農業・酪農・水産・観光 |

---

## データJSONのフォーマット

```json
{
  "title": "〇〇地方の雑学",
  "region": "〇〇地方",
  "headerTitle": "🗾 〇〇まるごと雑学",
  "completeDesc": "...説明文...<br><br><strong>さあ、クイズで腕試しをしよう！</strong>",
  "quizHeader": "📝 〇〇地方クイズ",
  "storageKey": "〇〇_v1",
  "sections": ["セクション1", "セクション2", "セクション3", "セクション4", "セクション5"],
  "items": [
    {
      "num": "01",
      "section": 0,
      "keyword": "キーワード",
      "emoji": "🗾",
      "title": "タイトル",
      "q": "問いかけ",
      "a": "答え",
      "body": "本文（改行多め・勉強感ゼロ）",
      "summary": "まとめ（emoji + 一文）",
      "reality": "補足データ",
      "realityIcon": "📏",
      "vocab": [
        {"word": "用語", "def": "説明"},
        {"word": "用語", "def": "説明"}
      ]
    }
  ],
  "quizzes": [
    {
      "q": "問題文",
      "options": ["A", "B", "C", "D"],
      "ans": 0,
      "exp": "解説"
    }
  ]
}
```

## 注意事項

- template.html と generate.js は編集しない
- items は必ず30個、quizzes は必ず15問
- pushするブランチは必ず main
