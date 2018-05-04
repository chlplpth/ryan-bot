'use strict';


const line = require('@line/bot-sdk');
const express = require('express');
const dictApi = require('./lib/dict-api')

var dotenv = require('dotenv');
dotenv.load();

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type === 'message' && event.message.text) {
    var word = event.message.text

    dictApi.getDefinition(word, function(definition){
      if(!definition){
        definition = "Error"
      }
      return client.replyMessage(event.replyToken,
        [
          {
            type: 'text',
            text: "query : " + word
          },
          {
            type: 'text',
            text: "definition : " + definition
          },
        ]
      );
    })
  }
}

app.listen(process.env.PORT || 3000);
