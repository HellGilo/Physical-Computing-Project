/**
 * Created by Hellmaster on 23/04/15.
 */

"use strict";

var express = require('express');
var router = express.Router();
var config = require("./../config");
var Auth = require('./utils/auth');
var Room = require('../models/room');
var Region = require('../models/region');


/* GET home page for courses  */
router.get('/', function(req, res, next) {

});

/* GET info about a defined course  */
router.get('/:rid', function(req, res, next) {

    Room.findOne( {name : req.params.rid }).populate({path: "_region", select : "beacons created_at walls identifier version orientation name linear_objects"}).exec(function (err, room) {
        if (err) {
            res.status(500);
            return res.send("error 500" + err.message);
        }
        if (!room) {
            res.status(404);
            return res.send("couldn't find the wanted room");
        }
        res.status(200);
        return res.json(room)
    });

});


/* POST to create a course */
router.post('/', function(req, res, next) {

    var room_name = req.body.name;
    var region = req.body["region"]



    var new_room = new Room ({definition : req.body["definition"], name : req.body.name});


    var new_region = new Region(region);



    new_region.save(function(err){
        if (err) {
            console.log(err);
            res.status(500);
            return res.send("error 500" + err.message);
        }
        console.log(new_region);

        var new_room = new Room({name : room_name, _region : new_region._id });

        new_room.save(function(err){
            if (err) {
                console.log(err);
                res.status(500);
                return res.send("error 500" + err.message);
            }
            console.log(new_room);
            return res.send(200);
        });


    });



});






/* POST an update to a defined course  */
//router.post('/:cid', function(req, res, next) {
//
//    Course.findOne({"_id" : req.params.cid}, function(err, course) {
//        if (err) {
//            console.log(err);
//            res.status(500);
//            return res.send("error 500" + err.message);
//        }
//
//        else if (!course) {
//            res.status(404);
//            return res.send("the course does not exists");
//        }
//
//
//        else if (!Auth.validate_role(req.user, course)) {
//            res.status(401);
//            return res.send("you don't have the authorization to complete this action");
//        }
//
//        var lecturers = req.body.lecturers || false;
//        var assistants = req.body.assistants || false;
//        var students = req.body.students || false;
//
//        var add_event = req.body.new_event || false;
//
//        var remove_event = req.body.remove_event || false;
//
//        if (add_event) {
//            var e = new Event({
//                name: add_event.name,
//                _course: req.params.cid,
//                start: add_event.start,
//                end: add_event.end,
//                room: add_event.room,
//                timemodified: new Date().getTime()
//            });
//
//            e.save(function (err) {
//                    if (err) {
//                        console.log(err);
//                        res.status(500);
//                        return res.send("error 500" + err.message);
//                    }
//                    course._schedule.push(e._id);
//                    save();
//                }
//            )
//        }
//
//        else if (remove_event){
//            Event.findOne({_id : remove_event}).remove(function(err){
//
//                    if (err) {
//                        console.log(err);
//                        res.status(500);
//                        return res.send("error 500" + err.message);
//                    }
//                    (course._schedule.indexOf(remove_event) != -1) ? course._schedule.splice(course._schedule.indexOf(remove_event), 1) : "";
//                    save();
//                }
//            )
//
//        }
//
//
//
//
//        function save() {
//
//            if (lecturers)
//                course._lecturer = lecturers;
//            if(assistants)
//                course._assistants = assistants;
//            if(students)
//                course._students = students;
//
//            course.timemodified = new Date().getTime();
//
//            course.save(function (err) {
//                if (err) {
//                    console.log(err);
//                    res.status(500);
//                    return res.send("error 500" + err.message);
//                }
//                res.status(200);
//                res.send(200);
//            });
//
//        }
//    })
//
//
//
//
//});






module.exports = router;