/**
 * Created by Hellmaster on 07/05/15.
 */


var jwt = require('jwt-simple');
//var validateUser = require('../routes/auth').validateUser;

var config = require("./../../config");
var User = require('../../models/user');


module.exports = function(req, res, next) {

    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    //var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    //if (token || key) {
    if (token) {
        try {
            var decoded = jwt.decode(token,config.token_secret, null, null);
            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }

            //Authorize the user to see if s/he can access our resources

            validateUser(token, function(err, dbUser){
                if(err){
                    res.status(500);
                    res.json({
                        "status": 500,
                        "message": " something went wrong while finding the right user ",
                        "error": err
                    });
                }
                else if (dbUser) {
                    console.log("user found");
                    req.user = dbUser;
                    next();
                } else {
                    // No user with this name exists, respond back with a 401
                    res.status(401);
                    return res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                }
            })
        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "You are using the fucking wrong token!",
                "error": err
            });
        }
    } else {
        res.status(401);
        return res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });

    }




    function validateUser(token, cb){
        User.findOne({token : token}, function(err, user){
            if (err){
                console.log(err)
                return cb(err, null);
            }
            else if(!user)
                return cb(false, null);
            else
                return cb(false, user)
        })
    }


};



