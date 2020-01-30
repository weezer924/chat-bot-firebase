# chat-bot-firebase
a simple bot hosting on firebase

## System
<img width="932" alt="スクリーンショット 2020-01-31 0 25 08" src="https://user-images.githubusercontent.com/37494988/73463190-2e6e8c00-43c0-11ea-992a-e24ac8e30fe9.png">

## Source Code
#### Front-End 
   src/app/components/InputComponet.js  (テキスト入力と履歴)

#### Back-End
   src/functions/index.js (サーバ処理、DBの更新、外部APIの呼び出し)

## APIs
  ##### GET /history/list

  Firestoreの”history”コレクションからresponse_timestamp降順、最新の10件を取得する

  ##### POST /chat 

  1)request.body.user_inputは[こんにちは / 今何時？ / 今日の東京の天気は？]の文字が一致するが前提

  2)それぞれの条件分岐でBotの返信内容を処理する

  3)処理した結果をDBのhistoryコレクッション保存(新規作成)

  4)表示のため、Front-Endに処理した結果を送信




