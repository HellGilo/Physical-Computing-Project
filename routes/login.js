/**
 * Created by Hellmaster on 07/05/15.
 */

var Moodle = require('./utils/moodle_login');
var express = require('express');
var router = express.Router();
var config = require("./../config");
var User = require('../models/user');
var jwt = require('jwt-simple');


/* POST user authentication . */
router.post('/', function(req, res, next) {


    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid credentials"
        });
        return;
    }


    Moodle.login(username,password, authentication_callback(res));
});

function authentication_callback(origin_res){
    return function(json){
        if(!json) {
            origin_res.status(401);
            return origin_res.send("you do not fucking exist to moodle")
        }

        else {
            var user = JSON.parse(json).user;
            User.findOne({username : user.username}, {_id : 0, __v : 0 }, function(err, us){
                if (err)
                    console.log(err);
                else if (!us) {
                    create_user(user, origin_res);
                }
                else {
                    return origin_res.json({user : us})
                }
            })

        }
    }
}


function create_user(new_user, res){

    var token = genToken(new_user);
    var user = new User(new_user);
    user.token = token.token;

    user.save(function(err){
        if (err) {
            console.log(err);
            res.status(500);
            return res.send("error 500" + err.message);
        }
        User.findOne({username : user["username"]}, {_id : 0, __v : 0}, function(err, us){
            if (err)
                console.log(err);
            else {
                return res.json({user : us})
            }
        })
    });
}

function genToken() {
    var expires = expiresIn(config.token_exp);
    var token = jwt.encode({
        exp: expires
    }, config.token_secret);

    return {
        token: token,
        expires: expires
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = router;