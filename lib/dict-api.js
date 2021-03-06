var request = require('request-promise');

var getDefinition = function getDefinition(word){
  var base_url = "https://od-api.oxforddictionaries.com/api/v1"
  var language = "en"
  var req_url = base_url + "/entries/" + language + "/" + word.replace(/ /g,"_").toLowerCase()
  var options = {
    uri: req_url,
    headers: {
      'app_id': process.env.API_APP_ID,
      'app_key': process.env.API_APP_KEY
    }
  };

  return request(options).then(function(response){
    var res = JSON.parse(response);
    return res.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
  }).catch(function (err) {
    return "Error";
  });
};

var getSynonym = function getSynonym(word){
  var base_url = "https://od-api.oxforddictionaries.com/api/v1"
  var language = "en"
  var req_url = base_url + "/entries/" + language + "/" + word.replace(/ /g,"_").toLowerCase() + "/synonyms;antonyms"
  var options = {
    uri: req_url,
    headers: {
      'app_id': process.env.API_APP_ID,
      'app_key': process.env.API_APP_KEY
    }
  };

  return request(options).then(function(response){
    var res = JSON.parse(response);
    var synonyms = res.results[0].lexicalEntries[0].entries[0].senses[0].synonyms

    var synonymsTxt = ""
    for (i = 0; i < 5; i++) {
        if(!synonyms[i])break;
        synonymsTxt += synonyms[i].text + ", ";
    }
    synonymsTxt = synonymsTxt.slice(0, -2);
    return synonymsTxt;
  }).catch(function (err) {
    return "Error";
  });

};

module.exports = {
  getDefinition,
  getSynonym
}
