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

  server.get('*', async (req, res) => {
    console.log('File: ' + req.originalUrl)
    await handle(req, res)
  })
  server(req, res)
})