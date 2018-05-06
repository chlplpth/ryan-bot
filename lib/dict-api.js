var request = require('request');
pry = require('pryjs')

var getDefinition = function getDefinition(word){
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

  request(options, definitionCallback);
};

var getSynonym = function getSynonym(word){
  var base_url = "https://od-api.oxforddictionaries.com/api/v1"
  var language = "en"
  var req_url = base_url + "/entries/" + language + "/" + word.replace(/ /g,"_").toLowerCase() + "/synonyms;antonyms"
  var options = {
    url: req_url,
    headers: {
      'app_id': '460cfd22',
      'app_key': '85e4ca4ee67e2fb3f8fabc1f193aaa78'
    }
  };

  request(options, synonymCallback);
};

function definitionCallback(error, response, body){
  return new Promise(function(resolve, reject){
    if (!error && response.statusCode == 200) {
      var res = JSON.parse(body);
      resolve(res.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
    }else{
      reject("Error");
    }
  });
}
function synonymCallback(error, response, body){
  return new Promise(function(resolve, reject){
    if (!error && response.statusCode == 200) {
      var res = JSON.parse(body);
      var synonyms = res.results[0].lexicalEntries[0].entries[0].senses[0].synonyms

      var synonymsTxt = ""
      for (i = 0; i < 5; i++) {
          if(!synonyms[i])break;
          synonymsTxt += synonyms[i].text + ", ";
      }
      synonymsTxt = synonymsTxt.slice(0, -2);
      resolve(synonymsTxt);
    }else{
      reject("Error");
    }
  });
}


module.exports = {
  getDefinition,
  getSynonym
}
