var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var server = require('../serverIndex.js')
var knex = require('../db/knex.js')
var pg = require('pg')
require('dotenv')
/* GET home page. */
function companies() {
  return knex('companies')
}

router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'Face It',
  });
});

router.post("/", function(req, res, next) {
  var blank = []
  var searchTag = req.body.hashtag
  var dataFormat = function(passedThrough){
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
    ageDatabase(results, req.body.hashtag)
    genderDatabase(results, req.body.hashtag)
    raceDatabase(results, req.body.hashtag)

  }

  function databaseInsert(x) {
    companies().select().where('name', x).first().then(function(result){
      if(result == undefined) {
        companies().insert({'name': x}).then(function(result){

        })
      }
    })
  }
  function ageDatabase(info, compName) {
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
      companies().select().where('name', compName).first().then(function(result1){
        companies().where('name', compName).update({teen: result1.teen + teen , twenties: result1.twenties + twenties , thirties: result1.thirties + thirties, fourties: result1.fourties + fourties, fifties: result1.fifties + fifties, sixties: result1.sixties + sixties}).then(function(result){

        })

        })
      }

  }
  function raceDatabase(info, compName) {
    var black = 0
    var white = 0
    var asian = 0
    if(info.race == 'Black'){
      black +=1
    }
    else if(info.race == 'White'){
      white +=1
    }
    else if(info.race == 'Asian'){
      asian +=1
    }
    companies().select().where('name', compName).first().then(function(result){
      companies().where('name', compName).update({black: result.black + black, white: result.white + white, asian: result.asian + asian}).then(function(rest){
    });
  });
  }




  function genderDatabase(info, compName) {
    var male = 0
    var female = 0
    if(info.gender == 'Male'){
      male +=1
    }
    else if(info.gender == 'Male'){
      female +=1
    }
    companies().select().where('name', compName).first().then(function(result){
      companies().where('name', compName).update({male: result.male + male, female: result.female + female}).then(function(rest){
    });
  });
  }


  function pullFacialInfo(response) {
    var info = []
    var data = response.body
    console.log( "GoldenBoy 1 "+data);
    if (data["face"] !== undefined && data['face'].length) {
      console.log(data['face'][0]);
      var age = data["face"][0]["attribute"]["age"]
      var gender = data["face"][0]["attribute"]["gender"]
      var race = data["face"][0]["attribute"]["race"]
      info.push({"age":age})
      info.push({"gender": gender})
      info.push({"race": race})

      var formattedInfo = info
      dataFormat(formattedInfo)
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


  databaseInsert(searchTag)
  var twitter = twitterCall(req.body.hashtag, function(response) {
    var ProfURL = urlFunc(response)
    var data = runFaceAPI(ProfURL, function(results) {
      blank.push(results)
      // call some JS function and pass faceResults
      // that returns something you need for your view
      var  face = makeItReadAble(blank[0])
      var faceResults = JSON.stringify(face)
      res.render('info', {
        title: 'Face It', info: faceResults
      })
      })
  })
});

router.get('/book', function(req, res) {

  facePlus('http://a5.files.biography.com/image/upload/c_fit,cs_srgb,dpr_1.0,h_1200,q_80,w_1200/MTIwNjA4NjMzNTU2NjAwMzMy.jpg')

  res.render('face', {
    Hello: 'Unirest'
  })
})

router.get("/info", function(req, res) {

  res.render('info', {
    title: 'Face It'
  })
})







module.exports = router
