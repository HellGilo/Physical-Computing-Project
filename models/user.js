/**
 * Created by Hellmaster on 19/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        net_id      : {type: String, required: true, unique: true},
        token       : {type: String},
        email       : {type:String, required: true, unique: true},
        first_name  : {type: String},
        last_name   : {type: String},
        type        : { type: String, enum: ['student', 'teacher', 'assistant']},
        _courses    : [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        updated     : { type: Date, default: Date.now }
    }
);




module.exports = mongoose.model('User', UserSchema);