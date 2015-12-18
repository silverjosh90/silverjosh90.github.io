var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var server = require('../serverIndex.js')
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: 'Face It'
  });
});

router.post("/", function(req, res, next) {
  var blank = []
  var twitter = server.twitterCall(req.body.hashtag, function(response) {
    var ProfURL = server.urlFunc(response)
    var data = server.runFaceAPI(ProfURL, function(results) {
      blank.push(results)
      // call some JS function and pass faceResults
      // that returns something you need for your view
      var  face = server.makeItReadAble(blank[0])
      var faceResults = JSON.stringify(face)
      res.render('info', {
        title: 'Face It', info: faceResults
      })
      })
  })
});

router.get('/book', function(req, res) {

  server.facePlus('http://a5.files.biography.com/image/upload/c_fit,cs_srgb,dpr_1.0,h_1200,q_80,w_1200/MTIwNjA4NjMzNTU2NjAwMzMy.jpg')

  res.render('face', {
    Hello: 'Unirest'
  })
})

router.get("/info", function(req, res) {

  res.render('info', {
    title: 'Face It'
  })
})



module.exports = router;
