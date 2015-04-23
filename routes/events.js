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





module.exports = router;