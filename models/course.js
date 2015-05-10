/**
 * Created by Hellmaster on 23/04/15.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
        name        : {  type: String, required: true, unique: true},
        _lecturer   : [{  type: Schema.Types.ObjectId, ref: 'User', default:[] }],
        _assistants : [{ type: Schema.Types.ObjectId, ref: 'User',default:[]  }],
        _students   : [{ type: Schema.Types.ObjectId, ref: 'User',default:[]  }],
        _schedule   : [{ type: Schema.Types.ObjectId, ref: 'Event',default:[]  }],
        timemodified     :{ type: Date, default: Date.now }
    }
);





module.exports = mongoose.model('Course', CourseSchema);