"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// GET info about a defined user
router.get('/:net_id', function(req, res, next) {

  User.find({net_id : req.params["net_id"]}).exec(function (err, user) {
    if (err) {
      res.status(500);
      return res.send("error 500" + err.message);
    }
    if (!user) {
      res.status(404);
      return res.send("error 404" + err.message);
    }
    res.send(user);
  });

  // TODO - for anyone
});



// POST create a new user
router.post("/create", function(req,res,next){
  var body = req.body;
  var new_user = new User( {
    net_id      : body.net_id,
    email       : body.email,
    first_name  : body.first_name,
    last_name   : body.last_name,
    type        : ['student', 'teacher', 'assistant'][body["type"]],
    updated     : new Date()
  });


  new_user.save(function(err){

    if (err) {
          console.log(err);
          res.status(500);
          return res.send("error 500" + err.message);
        }
        res.status(201);
        res.send("all ok");


  });

});


// POST updates to a defined user
router.post('/:net_id', function(req, res, next) {

  //
  //
  //User.find({net_id : req.params["net_id"]}).exec(function (err, user) {
  //  if (err) {
  //    res.status(500);
  //    return res.send("error 500" + err.message);
  //  }
  //  if (!user) {
  //    res.status(404);
  //    return res.send("error 404" + err.message);
  //  }
  //
  //
  //
  //
  //
  //

    res.send(200);
  // TODO - teachers and TAs can get info about any one
  // TODO - students can get only their own and only a subset for others
});

module.exports = router;
