/**
 * Created by Hellmaster on 19/04/15.
 */

/** User Schema for Chancemap **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        net_id  : {type: String, required: true, unique: true},
        email     : {type:String, required: true, unique: true},
        first_name : String,
        last_name  : String
    }
);





module.exports = mongoose.model('User', UserSchema);