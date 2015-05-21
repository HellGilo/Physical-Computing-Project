/**
 * Created by Hellmaster on 19/04/15.
 */

'use strict'

var conf = {

    port : 3000,

    root_url : (process.env.NODE_ENV && process.env.NODE_ENV === 'production') ?"http://some_path:some_port" : "http://localhost:3000",

    mongoDBurl: "mongodb://127.0.0.1/db_test",
    DBoptions: {
        user: "",
        pass: ""
    },


    token_exp : 180,
    token_secret : "this.is.my"

};


module.exports = conf;

