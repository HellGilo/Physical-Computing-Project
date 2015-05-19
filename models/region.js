/**
 * Created by Hellmaster on 19/05/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Region = new Schema({
        beacons : { type: Object, required: true},
        created_at: {type : Date, required : true},
        walls : {type : Object, required: true},
        identifier : {type: String, required : true},
        version : {type: String, required: true},
        orientation: {type: Number, required: true},
        name : {type: String, required: true},
        linear_objects : { type: Object, required: true}
    }
);


module.exports = mongoose.model('Region', Region);