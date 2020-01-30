const path = require('path')
const admin = require('firebase-admin');
const functions = require('firebase-functions')
const express = require('express');
const next = require('next')
const bodyParser = require('body-parser')

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
db.settings({timestampsInSnapshots: true })

var dev = process.env.NODE_ENV !== 'production'
var app = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` },
})
var handle = app.getRequestHandler()

exports.next = functions.https.onRequest(async (req, res) => {
  await app.prepare()
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  const commands = [
    "こんにちは",
    "今何時？",
    "今日の東京の天気は？"
  ]

  // 履歴
  server.get('/history/list', (req, res) => {
    db.collection('history').orderBy('response_timestamp', 'desc').limit(10).get().then((snapshot) => {
      const history = new Array()
      snapshot.forEach(doc => {
        const data = doc.data()
        // utc to jst
        let date = new Date(data.response_timestamp.toDate())
        date.setTime(date.getTime() + 1000*60*60*9)
        const dateStr = date.toISOString().split('.')[0]

        history.push({
          user_input: data.user_input,
          bot_response: data.bot_response,
          response_timestamp: dateStr
        })
      })
      res.send(JSON.stringify(history));
    })
  });

  // チャット
  server.post('/chat', (req, res) => {
    // こんにちは / 今何時？ / 今日の東京の天気は？の命令しか受付しない
    if (commands.indexOf(req.body.userInput) == -1) {
      res.status(400).send({err: '入力されたテキストは無効です'})
      return;
    }

    // Botの返答
    let botResponse = ''
    switch(req.body.userInput) {
      case commands[0]:
        botResponse = 'こんにちは。'
        break;
      case commands[1]:
        botResponse = 'HH時MM分です。'
        break;
      case commands[2]:
        botResponse = '晴れです。'
        break;
      default:
        console.log('input is not include any above command.')
    }

    // Firestore
    const message = {
      "user_input": req.body.userInput,
      "request_timestamp": new Date(req.body.requestTime),
      "bot_response": botResponse,
      "response_timestamp": new Date()
    }

    // 新規追加
    db.collection('history').add(message).then(() => {
      message.request_timestamp = message.request_timestamp.toLocaleTimeString()
      message.response_timestamp = message.response_timestamp.toLocaleTimeString()
  
      res.send(JSON.stringify(message))
    }).catch(error => {
      res.status(500).send({err: error})
    })
  })

  server.get('*', async (req, res) => {
    console.log('File: ' + req.originalUrl)
    await handle(req, res)
  })
  server(req, res)
})