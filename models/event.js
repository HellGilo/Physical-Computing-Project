/**
 * Created by Hellmaster on 23/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
        name        : {type : String},
        _course     : { type: Schema.Types.ObjectId, ref: 'Course' },
        start       : {type : Number},
        end         : {type : Number},
        _room       :{ type: Schema.Types.ObjectId, ref: 'Room'},
        _presences   : [{ type: Schema.Types.ObjectId, ref: 'Presence',default:[]  }],
        timemodified     :{ type: Number, default: Date.now }
    }
);




module.exports = mongoose.model('Event', EventSchema);