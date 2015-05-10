/**
 * Created by Hellmaster on 23/04/15.
 */


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



/* GET info about a defined event */
router.get('/eid', function(req, res, next) {
    res.send(200);
    // TODO - for anyone
});


/* POST updates to a defined event */
router.post('/eid', function(req, res, next) {
    res.send(200);
    // TODO - teachers and TAs can update all info
    // TODO - students update their presence through the presences API
});


/* POST to create an event */
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