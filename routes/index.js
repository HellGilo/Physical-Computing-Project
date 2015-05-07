"use strict";


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



/* POST to index for login */
router.get('/login', function(req, ress, next) {

});













module.exports = router;





















//
//
//var post_data2 = querystring.stringify({
//    'username' : '3008422@usi.ch',
//    "password":"RK9oK5wicmMyvWcJ"
//});
//
//ck += res.headers["set-cookie"][0].split(';')[0] +";";
//
//var options5 = {
//    host: "login2.usi.ch",
//    path: "/cas/login?service=https%3A%2F%2Flogin2.usi.ch%2Fidp%2FAuthn%2FRemoteUser",
//    method: 'POST',
//    headers: {
//        'Content-Type': 'application/x-www-form-urlencoded',
//        'Content-Length': post_data2.length,
//        "Cookie" : ck
//    }
//};
//
//
//var req = https.request(options5, function(res) {
//
//
//    res.on("data", function(d){
//        var StringDecoder = require('string_decoder').StringDecoder;
//        var decoder = new StringDecoder('utf8');
//
//        var cent = new Buffer(d);
//        ress.status(200);
//        ress.send(decoder.write(cent));
//
//
//
//    })
//
//    res.on('end',function(){});
//});
//
//req.write(post_data2);
//req.end();
//
//req.on('error', function(e) {
//    console.error(e);
//});