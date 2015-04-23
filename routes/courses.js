/**
 * Created by Hellmaster on 23/04/15.
 */


var express = require('express');
var router = express.Router();
var config = require("./../config");


/* GET home page for courses  */
router.get('/', function(req, res, next) {
    res.json({
        "get_course": config.root_url + "/course/:cid",
        "post_course": config.root_url +"/course/:cid"
    })
});


/* GET info about a defined course  */
router.get('/:cid', function(req, res, next) {
    res.send(200);
    // TODO - anyone
});


/* POST an update to a defined course  */
router.post('/:cid', function(req, res, next) {
    res.send(200);
    // TODO - only for teachers and TAs
});











module.exports = router;