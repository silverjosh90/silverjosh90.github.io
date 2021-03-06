var unirest = require('unirest')
var knex = require('./db/knex.js')
var pg = require('pg')

function companies() {
  return knex('companies')
}

function databaseInsert(x) {
  companies().select().where('name', x).first().then(function(result){
    if(result == undefined) {
      companies().insert({'name': x}).then(function(result){

      })
    }
  })
}
function dataFormat(passedThrough){
  var aged = []
  var gendered = []
  var raced = []
  var results = {}
  for (var i = 0; i < passedThrough.length; i++) {
    var j= passedThrough[i]
    if(j['age'] !== undefined) {
    var ages = j['age']['value'] / 10
    var agev = Math.floor(ages)
    aged.push(agev)
  }
  if(j['gender'] !== undefined) {
    var gend = j['gender']['value']
    gendered.push(gend)
  }
  if(j['race'] !== undefined) {
    var rac = j["race"]["value"]
    raced.push(rac)
  }
  }
  results.age = aged
  results.gender = gendered
  results.race = raced
  console.log(results);
  console.log(results.gender.length);

}

function putInDatabase(info) {
  teen = 0
  twenties = 0
  thirties = 0
  fourties = 0
  fifties = 0
  sixties = 0
  if(info.age){
    var aged = info.age
    for (var i = 0; i < aged.length; i++) {
      var singleAge = aged[i]
      if(singleAge <= 1){
        teen +=1
      }
      else if(singleAge <= 2){
        twenties +=1
      }
      else if(singleAge <= 3){
        thirties +=1
      }
      else if(singleAge <= 4){
        fourties +=1
      }
      else if(singleAge <= 5){
        fifties +=1
      }
      else if(singleAge <= 6){
        sixties +=1
      }
    }
    // var existing_values = companies().select().where('name', req.body.hashtag ).first().then(function(result1){
    //   companies().update({teen: 0 , twenties: 0 , thirties: 0, forties: 0, fifties: 0, sixties: 0})
    //
    //   })
    }


}


function pullFacialInfo(response) {
  var info = []
  var data = response.body
  if (data["face"][0] !== undefined) {
    var age = data["face"][0]["attribute"]["age"]
    var gender = data["face"][0]["attribute"]["gender"]
    var race = data["face"][0]["attribute"]["race"]
    info.push({"age":age})
    info.push({"gender": gender})
    info.push({"race": race})
    console.log(info);
    dataFormat(info)
  }
  return info
}

function facePlus(face, callback) {
  unirest.get('https://apius.faceplusplus.com/v2/detection/detect?url=' + face + '&api_secret=17MjeURDf_CO82JYuWcDeJDGbSrvT0JC&api_key=3a66b94f0a395a0cae0dc57451ff1375&attribute=gender,age,race')
    .end(function(response) {
      return callback(response);
    });

}

function runFaceAPI(urlArray, callback) {
  faceStats = []
  for (var i = 0; i < 3; i++) {
    facePlus(urlArray[i], function(response) {
      var facialInfo = pullFacialInfo(response)
      faceStats.push(facialInfo)
      if(faceStats.length === 3){
        return callback(faceStats)
      }
    })
  }
}

function urlFunc(response) {
  var urlArray = []
  var twitterResponse = response.raw_body

  twit = JSON.parse(twitterResponse)
  imageURL = twit["statuses"]

  for (var i = 0; i < imageURL.length; i++) {
    var j = imageURL[i]["user"]["profile_image_url_https"]
    var bigImg = j.replace("_normal", "")
    urlArray.push(bigImg)
  }
  return urlArray
}

// Face ++ API call

//Twitter API call

function twitterCall(search, callback) {
  var url = [];
  return unirest.get('https://api.twitter.com/1.1/search/tweets.json?q=%23' + search)
    .headers({
      'Host': 'api.twitter.com',
      'UserAgent': 'FaceIt Analyzer',
      'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAJXtjAAAAAAAsCq%2FDdho0BH3XcpIs3a7KSv3eTQ%3DmalMDz9X4egeebhLVmlH7KLgpHDKBGjJuQREXSEBIo1q9kgcKd'
    })
    .end(function(response) {
      return callback(response);
      // var profileImage = urlFunc(response)
      // for(x in profileImage) {
      //   var bigImg= profileImage[x].replace("_normal","")
      //   url.push(bigImg)
      // }
      // return response
    });
}

function makeItReadAble(x) {
  faces= {}
  for (var i = 0; i < x.length; i++) {

  faces["Person"+i] = x[i]
  // var taco = faces["Person"+i]
  //
  // if(taco !== []) {
  //   faces["Person"+i]["age"] = taco[0]["age"]
  //   faces["Person"+i]["gender"] = taco[1]["gender"]
  //   faces["Person"+i]["race"] = taco[2]["race"]
  //   console.log("*****TACO");
  //   console.log(taco["gender"]);
  //   console.log("END TACO");
  }
  return faces
}

//test



module.exports = {
  urlFunc: urlFunc,
  twitterCall: twitterCall,
  facePlus: facePlus,
  pullFacialInfo: pullFacialInfo,
  runFaceAPI: runFaceAPI,
  makeItReadAble: makeItReadAble,
  databaseInsert: databaseInsert
}
