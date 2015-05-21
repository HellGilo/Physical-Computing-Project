/**
 * Created by Hellmaster on 23/04/15.
 */
"use strict";

var express = require('express');
var router = express.Router();
var Event = require('../models/event');
var Auth = require('./utils/auth');
var User = require('../models/user');
var Presence = require('../models/presence');
var Promise = require("bluebird");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



/* GET info about a defined event */
router.get('/:eid', function(req, res, next) {
    var populate = [
        { path: "_course", select: "name"},
        {path : "_presences", select : "_user arrival exit"}
    ];

    Event.findOne({_id : req.params.eid }).populate(populate).exec(function (err, event) {
        if (err) {
            res.status(500);
            return res.send("error 500" + err.message);
        }
        if (!event) {
            res.status(404);
            return res.send("couldn't find the wanted course");
        }


        var promises_user = [];
        for(var p = 0; p < event._presences.length; p++){
            promises_user.push(populate_students(event._presences[p]));
        }


        Promise.all(promises_user).then(function(){
            res.status(200)
            return res.json(event)
        })

    });



    function populate_students(presence){
        return new Promise(function (resolve, reject) {
            User.populate(presence, {
                path: '_user',
                select: 'firstname lastname'
            },  function() {
                resolve(presence);
            });
        })
    }



});


/* POST updates to a defined event */
router.post('/:eid', function(req, res, next) {
    var user = req.user;

    var arrival = req.body.arrival || false;
    var exit = req.body.exit || false;

    Event.findOne({_id : req.params.eid}).populate({path : "_presences", select : "_user"}).exec(function(err, event){


        console.log(event);

        if (err) {
            res.status(500);
            return res.send("error 500" + err.message);
        }

        if (!event) {
            res.status(404);
            return res.send("couldn't find the wanted course");
        }

        if (arrival){

            for(var p = 0; p < event._presences.length; p++){
                console.log(event._presences[p]._user.equals(user._id));
                if(event._presences[p]._user.equals(user._id) ) {
                    res.status(403);
                    return res.json ( {message : "you have already signed your presence to this event"});
                }
            }

            var new_presence = new Presence({
                _user           : user._id,
                _course         : event._course,
                arrival         : arrival
            });

            new_presence.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    return res.send("error 500" + err.message);
                }

                event._presences.push(new_presence._id);

                event.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        return res.send("error 500" + err.message);
                    }

                    res.status(200);
                    res.json({message : "ok"});
                });
            });
        }
        else if(exit){
            var presence = false;
            for(var p = 0; p < event._presences.length; p++){
                if(event._presences[p]._user.equals(user._id) ) {
                    presence = event._presences[p]._id;
                    break;
                }
            }
            if(!presence){
                res.status(403);
                return res.send("you were not signed for this course");
            }

            Presence.findOne({_id : presence}).exec(function(err, pres){

                if (err) {
                    res.status(500);
                    return res.send("error 500" + err.message);
                }

                if (!pres) {
                    res.status(404);
                    return res.send("there was an error retrieving the presence even if it was previously found");
                }


                if(pres.exit){
                    res.status(403);
                    return res.json({message: "you were already signed out from this lecture"})
                }

                pres.exit = exit;

                pres.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        return res.send("error 500" + err.message);
                    }

                    res.status(200);
                    res.send("ok");
                });
            })






        }





    })









});






//
///* POST to create an event */
//router.post('/', function(req, res, next) {
//
//    if(!Auth.validate_role(req.user)){
//        res.status(401);
//        return res.send("you don't have the authorization to complete this action");
//    }
//
//    var new_course = new Course ({name : req.body["name"], _lecturer : [req.user._id]});
//
//    new_course.save(function(err){
//        if (err) {
//            console.log(err);
//            res.status(500);
//            return res.send("error 500" + err.message);
//        }
//
//        User.findOne({_id : req.user._id }).exec(function (err, user) {
//            if (err) {
//                res.status(500);
//                return res.send("error 500" + err.message);
//            }
//            if (!user) {
//                res.status(404);
//                return res.send("couldn't find the wanted user");
//            }
//
//            user._courses.push(new_course._id);
//
//            user.save(function(err){
//                    if (err) {
//                        console.log(err);
//                        res.status(500);
//                        return res.send("error 500" + err.message);
//                    }
//                    res.status(200);
//                    return res.send(200);
//                }
//            )
//
//        });
//    });
//});



module.exports = router;