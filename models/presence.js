/**
 * Created by Hellmaster on 23/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PresenceSchema = new Schema({

        _user       : { type: Schema.Types.ObjectId, ref: 'User' },
        _course     : { type: Schema.Types.ObjectId, ref: 'Course' },
        arrival     : {type : Date},
        exit        : {type : Date},
        timemodified     : { type: Date, default: Date.now }

    }
);


module.exports = mongoose.model('Presence', PresenceSchema);