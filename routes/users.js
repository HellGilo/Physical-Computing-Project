"use strict";

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Auth = require('./utils/auth');
var Course = require("./../models/course");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



// GET info about a defined user
router.get('/:id', function(req, res, next) {

  var id = req.params.id;

  var populate = [
    { path: "_courses", select: "name"}
  ];

  User.find( { $or: [ { id: id }, { email: id}, {username : id} ] }, {_id : 0, __v : 0, token : 0}).populate(populate).exec(function (err, user) {
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



// POST updates to a defined user
router.post('/:id', function(req, res, next) {
  var myuser = req.user;
  var add_course = req.body.enroll || false;
  var remove_course = req.body.unenroll || false;

  if (!add_course && ! remove_course)  return res.send(200);

  var id = req.params.id;

  if (myuser.id != id && myuser.username != id && myuser.email != id) {
      if (!Auth.validate_role(myuser)) {
        res.status(401);
        return res.send("you don't have the authorization to complete this action");
      }
  }

  User.findOne( { $or: [ { id: id }, { email: id}, {username : id} ] }).exec(function (err, user) {
    if (err) {
      res.status(500);
      return res.send("error 500" + err.message);
    }
    if (!user) {
      res.status(404);
      return res.send("error 404" + err.message);
    }


    if(add_course)
    Course.findOne({_id : add_course}).exec(function(err, course) {

      if (err) {
        console.log(err);
        res.status(500);
        return res.send("error 500" + err.message);
      }

      if (!course) {
        res.status(404);
        return res.send("error 404" + err.message);
      }

        (user._courses.indexOf(course._id) == -1) ? user._courses.push(course._id) : "";

      user.save(function (err) {
            if (err) {
              console.log(err);
              res.status(500);
              return res.send("error 500" + err.message);
            }


            (course._students.indexOf(user._id) == -1) ? course._students.push(user._id) : "";

            course.save(function (err) {
                  if (err) {
                    console.log(err);
                    res.status(500);
                    return res.send("error 500" + err.message);
                  }

                  res.status(200);
                  return res.send(200);


                }
            );
          }
      );

    });


 else   if(remove_course)
      Course.findOne({_id : add_course}).exec(function(err, course) {

        if (err) {
          console.log(err);
          res.status(500);
          return res.send("error 500" + err.message);
        }

        if (!course) {
          res.status(404);
          return res.send("error 404" + err.message);
        }

         (user._courses.indexOf(remove_course) != -1) ? user._courses.splice(user._courses.indexOf(remove_course), 1) : "";


        user.save(function (err) {
              if (err) {
                console.log(err);
                res.status(500);
                return res.send("error 500" + err.message);
              }


              (course._students.indexOf(user._id) != -1) ? course._students.splice(course._students.indexOf(user._id), 1) : "";

              course.save(function (err) {
                    if (err) {
                      console.log(err);
                      res.status(500);
                      return res.send("error 500" + err.message);
                    }

                    res.status(200);
                    return res.send(200);


                  }
              );
            }
        );

      });

  });
});



module.exports = router;
