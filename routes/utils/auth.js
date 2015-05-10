/**
 * Created by Hellmaster on 07/05/15.
 */
"use strict";

var auth = {

    validate_role: function(user,course) {
        return (course._lecturer.indexOf(user._id) != -1) || (course._assistants.indexOf(user._id) != -1)
    }



};


module.exports = auth;