/**
 * Created by Hellmaster on 19/04/15.
 */
var mongoose = require('mongoose');
var config = require("./config");

db = mongoose.connect(config.mongoDBurl, config.DBoptions);
mongoose.connection.on('open', function() {
    console.log('express Server connected to '+config.mongoDBurl);
});

mongoose.connection.on('error', function(e,g) {
    console.log(e);
});


