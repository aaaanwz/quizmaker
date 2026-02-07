# quizmaker

jsonファイルで問題を作成することで、GitHub Actionsで簡単にクイズアプリを公開できるツールです

## 使い方

1. /contentに問題データをJSON形式で作成する

```json
{
    "title": "しんかんせんクイズ",
    "questions": [
        {
            "photo": "https://www.jreast.co.jp/train/shinkan/img/e8_img01.jpg",
            "answer": "つばさ"
        },
        {
            "photo": "https://www.jreast.co.jp/train/shinkan/img/e6_img01.jpg",
            "answer": "こまち"
        },
        {
            "photo": "https://www.jreast.co.jp/train/shinkan/img/e5_img01.jpg",
            "answer": "はやぶさ"
        },
        {
            "photo": "https://www.jreast.co.jp/train/shinkan/img/e3_img01.jpg",
            "answer": "つばさ"
        },
        {
            "photo": "https://www.jreast.co.jp/train/shinkan/img/e2_img01.jpg",
            "answer": "やまびこ"
        },
        {
            "photo": "https://www.jreast.co.jp/train/shinkan/img/e7_img01.jpg",
            "answer": "かがやき"
        }
    ]
}
```

2. mainブランチにマージする

3. GitHub Pagesで公開されます

## ローカル実行方法

1. リポジトリをクローンする

2. 依存関係をインストールする
   ```bash
   npm install
   ```

3. 開発サーバーを起動する
   ```bash
   npm run dev
   ```
   http://localhost:3000 にアクセスすると確認できます。

   ビルドのみ行う場合は以下を実行します：
   ```bash
   npm run build
   ```

## アプリ仕様

- トップページ (/index.html)
  - クイズ一覧が表示されます
  - クイズのタイトルはJSONファイルから読み込まれます
  - クイズのURLは /quiz/{JSONファイル名}.html になります

- クイズページ (/quiz/{JSONファイル名}.html)
  - 効果音(content/question.mp3)と共に、photoブロックのURLで指定された画像が表示されます
  - answerブロックの値と、それ以外の回答がランダムで3個表示されます。並び順もランダムです
  - 正解がクリックされた場合は正解の音声 (content/correct.mp3)が、不正解の場合は不正解の音声 (content/incorrect.mp3)が再生され、次の問題に遷移します
  - 全ての問題が終わると正答率が表示され、トップページに戻ることができます。
