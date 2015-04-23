/**
 * Created by Hellmaster on 23/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
        name        : {type : String},
        _course     : [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        start       : {type : Date},
        end         : {type : Date},
        room        : String,
        presences   : [{ type: Schema.Types.ObjectId, ref: 'Presence' }],
        updated     :{ type: Date, default: Date.now }
    }
);




module.exports = mongoose.model('Event', EventSchema);