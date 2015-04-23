/**
 * Created by Hellmaster on 23/04/15.
 */

var express = require('express');
var router = express.Router();

/* GET home page for presences */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


/* GET get info about a defined presence  */
router.get('/:pid', function(req, res, next) {
    res.send(200);
    // TODO - for anyone
});



/* POST updates to a defined presence  */
router.post('/:pid', function(req, res, next) {
    res.send(200);
    // TODO - teachers and TAs can update anyone presence
    // TODO - students can only update their own
});



module.exports = router;