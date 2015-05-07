/**
 * Created by Hellmaster on 19/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        id              : {type: String, required: true, unique: true},
        username        : {type: String, required: true, unique: true},
        token           : {type: String},
        email           : {type:String, required: true, unique: true},
        firstname       : {type: String},
        lastname        : {type: String},
        role            : { type: String, enum: ['student', 'teacher', 'assistant'],default:"student"},
        city            : {type: String},
        lang            : {type: String},
        avatar          : {type: String},
        _courses        : [{ type: Schema.Types.ObjectId, ref: 'Course' }],
        timemodified    : { type: Number }
    }
);

module.exports = mongoose.model('User', UserSchema);