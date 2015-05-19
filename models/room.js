/**
 * Created by Hellmaster on 23/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Room = new Schema({
        name        : {type : String, unique: true},
        _region  : { type: Schema.Types.ObjectId, ref: 'Region', required: true  },
        timemodified     :{ type: Number, default: Date.now }
    }
);




module.exports = mongoose.model('Room', Room);