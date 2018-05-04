var request = require('request');
pry = require('pryjs')

var getDefinition = function getDefinition(word,callback){
  var base_url = "https://od-api.oxforddictionaries.com/api/v1"
  var language = "en"
  var req_url = base_url + "/entries/" + language + "/" + word.replace(/ /g,"_").toLowerCase()
  var options = {
    url: req_url,
    headers: {
      'app_id': '460cfd22',
      'app_key': '85e4ca4ee67e2fb3f8fabc1f193aaa78'
    }
  };

  function responseCallback(error, response, body){
    if (!error && response.statusCode == 200) {
      var res = JSON.parse(body);
      callback(res.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
    }else{
      callback(null);
    }
  }

  request(options, responseCallback);
};

module.exports = {
  getDefinition
}
