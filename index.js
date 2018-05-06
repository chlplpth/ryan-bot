'use strict';


const line = require('@line/bot-sdk');
const express = require('express');
const dictApi = require('./lib/dict-api');
var Promise = require('promise');
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
    var promise = new Promise(function (resolve, reject) {
      resolve(buildReplyMsg(word));
    });

    promise.then(function(result){
      reply(event.replyToken,result)
    });

  }
}

function reply(token, replyMsg){
  return client.replyMessage(token, replyMsg);
}

function buildReplyMsg(word){
  var replyMsg =  [
                    {
                      type: 'text',
                      text: "query : " + word
                    }
                  ]

  Promise.all([dictApi.getDefinition(word), dictApi.getSynonym(word)])
  .then(function (res) {
    replyMsg.push(
      {
        type: 'text',
        text: "definition : " + res[0]
      }
    );
    replyMsg.push(
      {
        type: 'text',
        text: "synonym : " + res[1]
      }
    );
     eval(pry.it)
    return replyMsg
  })
}

app.listen(process.env.PORT || 3000);
