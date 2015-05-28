/**
 * Created by Hellmaster on 23/04/15.
 */

"use strict";

var express = require('express');
var router = express.Router();
var config = require("./../config");
var Course = require("./../models/course");
var Auth = require('./utils/auth');
var User = require('../models/user');
var Event = require('../models/event');
var Room = require('../models/room');
var Presences = require('../models/presence');

/* GET home page for courses  */
router.get('/', function(req, res, next) {

    Course.find({}).populate({path: "_lecturer", select : "firstname lastname"}).exec(function(err, courses){

        if (err) {
            res.status(500);
            return res.send("error 500" + err.message);
        }
        if (!courses) {
            res.status(404);
            return res.send("couldn't find the wanted course");
        }

        else res.send(courses);


    })



});

/* GET info about a defined course  */
router.get('/:cid', function(req, res, next) {
    var populate = [
        { path: "_lecturer", select: "firstname lastname avatar email"},
        { path: "_assistants", select: "firstname lastname avatar email"},
        { path: "_students", select: " firstname lastname avatar email"},
        { path: "_schedule", select: " name start end _room _presences",  options: { sort: { 'start': 1 } } }
    ];

    Course.findOne({_id : req.params.cid }).populate(populate).exec(function (err, course) {
        if (err) {
            res.status(500);
            return res.send("error 500" + err.message);
        }
        if (!course) {
            res.status(404);
            return res.send("couldn't find the wanted course");
        }

        Room.populate(course, {
            path: '_schedule._room',
            select: 'name'
        },  function() {

            Presences.populate(course, {
                path: '_schedule._presences',
                select: '_user arrival exit'
            },  function() {

                User.populate(course, {
                    path: '_schedule._presences._user',
                    select: 'firstname lastname'
                },  function() {
                    res.status(200);
                    return res.json(course)
                });

            });




        });
    });

});


/* POST to create a course */
router.post('/', function(req, res, next) {

    var new_course = new Course ({name : req.body["name"], _lecturer : [req.user._id]});

    new_course.save(function(err){
        if (err) {
            console.log(err);
            res.status(500);
            return res.send("error 500" + err.message);
        }

        User.findOne({_id : req.user._id }).exec(function (err, user) {
            if (err) {
                res.status(500);
                return res.send("error 500" + err.message);
            }
            if (!user) {
                res.status(404);
                return res.send("couldn't find the wanted user");
            }

            user._courses.push(new_course._id);

            user.save(function(err){
                if (err) {
                    console.log(err);
                    res.status(500);
                    return res.send("error 500" + err.message);
                }
                    res.status(200);
                    return res.send(200);
                }
            )

        });
    });
});






/* POST an update to a defined course  */
router.post('/:cid', function(req, res, next) {

    Course.findOne({"_id" : req.params.cid}, function(err, course) {
        if (err) {
            console.log(err);
            res.status(500);
            return res.send("error 500" + err.message);
        }

        else if (!course) {
            res.status(404);
            return res.send("the course does not exists");
        }


        else if (!Auth.validate_role(req.user, course)) {
        res.status(401);
        return res.send("you don't have the authorization to complete this action");
    }

        var lecturers = req.body.lecturers || false;
        var assistants = req.body.assistants || false;
        var students = req.body.students || false;

        var add_event = req.body.new_event || false;

        var remove_event = req.body.remove_event || false;

        if (add_event) {
                    Room.findOne({name : add_event.room}).exec(function(err, room){

                        if (err) {
                            console.log(err);
                            res.status(500);
                            return res.send("error 500" + err.message);
                        }

                        else if (!room) {
                            res.status(404);
                            return res.send("the room does not exists");
                        }
                        else {

                            var e = new Event({
                                name: add_event.name,
                                _course: req.params.cid,
                                start: add_event.start,
                                end: add_event.end,
                                _room: room._id
                            });

                            e.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.status(500);
                                        return res.send("error 500" + err.message);
                                    }
                                    course._schedule.push(e._id);
                                    save();
                                }
                            )
                }
            })
        }

        else if (remove_event){
            Event.findOne({_id : remove_event}).remove(function(err){

                    if (err) {
                        console.log(err);
                        res.status(500);
                        return res.send("error 500" + err.message);
                    }
                    (course._schedule.indexOf(remove_event) != -1) ? course._schedule.splice(course._schedule.indexOf(remove_event), 1) : "";
                    save();
                }
            )

        }


        function save() {

            if (lecturers)
            course._lecturer = lecturers;
            if(assistants)
            course._assistants = assistants;
            if(students)
            course._students = students;

            course.timemodified = new Date().getTime();

            course.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    return res.send("error 500" + err.message);
                }
                res.status(200);
                res.send(200);
            });

        }
    })




});






module.exports = router;