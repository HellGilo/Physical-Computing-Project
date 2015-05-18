/**
 * Created by Hellmaster on 23/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Room = new Schema({
        name        : {type : String, unique: true},
        definition  : {type : Object, unique: true},
        timemodified:{ type: Date, default: Date.now }
    }
);




module.exports = mongoose.model('Room', Room);