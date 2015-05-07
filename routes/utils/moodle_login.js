/**
 * Created by Hellmaster on 07/05/15.
 */

var querystring = require('querystring');
var https = require('https');

var request = require('request')
    , cheerio = require('cheerio');


var moodle = {

    login : function(username, password, cb){
        "use strict";

        var cookie_map = {};

        // TODO authenticate to moodle


        //1 chiami la pagina https://www2.icorsi.ch/auth/shibboleth
        //    2 imposti nel select value ="https://login2.usi.ch/idp/shibboleth" e fai submit
        //3 imposti username e password nel form di autenticazione e fai submit
        //4 se esiste il cookie "MoodleSession" e ti trovi sulla pagina https://www2.icorsi.ch vuol dire che sei autenticato
        //    ---> nel caso la password sia sbagliata non arriverai mai sulla pagina www2.icorsi.ch
        //5 chiami la pagina https://www2.icorsi.ch/auth/mobileaai/get_user.php per avere i dati dell'utente loggato in questa webview (verrà creata nei prossimi giorni, ti faccio sapere)

        var options = {
            host: "www2.icorsi.ch",
            path: "/auth/shibboleth",
            method: 'GET'
        };
        var req = https.request(options, function(res) {

            res.on("data", function(d){});
            res.on("end", function(){
                return connect_to_switch(res);
            })
        });
        req.end();




        function connect_to_switch(res){
            console.log("connect to switch")
            var loc = res.headers.location;
            var host = "wayf.switch.ch";
            var path = loc.split(host)[1];
            var options = {
                host: host,
                path: path,
                method: 'GET'
            };
            var req = https.request(options, function(r) {

                r.on("data", function(d){
                });
                r.on("end", function(){
                    return post_to_switch(res, path);
                })
            });
            req.end();
        }

        function post_to_switch(res, prev_path){
            console.log("post to switch")

            map_cookies(res.headers["set-cookie"]);
            var cookie = get_cookies();
            var host = "wayf.switch.ch";
            var path = prev_path;

            var post_data = querystring.stringify ({
                select : "Select",
                user_idp : "https://login2.usi.ch/idp/shibboleth"
            });
            var options = {
                host: host,
                path: path,
                method: 'POST',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length,
                    "Cookie" : cookie,
                    Origin: "https://wayf.switch.ch"
                }
            };

            var req = https.request(options, function(r) {

                r.on("data", function(){});

                r.on("end", function(){
                    return connect_to_icorsi(r);
                })
            });
            req.write(post_data);
            req.end();
        }

        function connect_to_icorsi(res){
            console.log("connect to icorsi")

            var loc = res.headers.location;
            var host = "www2.icorsi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var path = loc.split(host)[1];

            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate, sdch",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"max-age=0",
                    "Connection" : "keep-alive",
                    "Host":"www2.icorsi.ch",
                    "Cookie" : cookies
                }
            };


            var req = https.request(options, function(r) {

                r.on("data", function(d){
                });

                r.on("end", function(){
                    return connect_to_login2(r)
                })
            });
            req.end();
        }

        function connect_to_login2(res){
            var loc = res.headers.location;
            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var path = loc.split(host)[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };
            var req = https.request(options, function(r) {

                r.on("data", function(d){});
                r.on("end", function(){ return connect_to_authengine(r);})
            });
            req.end();
        }

        function connect_to_authengine(res){
            var loc = res.headers.location;
            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var path = loc.split(host+":443")[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };

            var req = https.request(options, function(r) {

                r.on("data", function(d){});
                r.on("end", function(){return connect_to_remoteUser(r);})
            });
            req.end();
        }

        function connect_to_remoteUser(res){
            var loc = res.headers.location;
            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var path = loc.split(host+":443")[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };
            var req = https.request(options, function(r) {

                r.on("data", function(d){});
                r.on("end", function(){return connect_to_login2service(r);})
            });
            req.end();
        }

        function connect_to_login2service(res){
            var loc = res.headers.location;
            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var path = loc.split("https://login2.usi.ch")[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };

            var req = https.request(options, function(r) {

                r.on("data", function(d){});
                r.on("end", function(){return connect_to_login2service2(r);})
            });
            req.end();
        }

        function connect_to_login2service2(res){
            var host = "login2.usi.ch";
            var jsid = res.headers["set-cookie"][0].split(';')[0];

            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var path2 = "/cas/login;" +jsid + "?service=https%3A%2F%2Flogin2.usi.ch%2Fidp%2FAuthn%2FRemoteUser";
            var options = {
                host: host,
                path: path2,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };

            var req = https.request(options, function(r) {
                var lt;
                var execution;
                var submit;
                r.on("data", function(d){

                    var StringDecoder = require('string_decoder').StringDecoder;
                    var decoder = new StringDecoder('utf8');

                    var cent = new Buffer(d);
                    var rawHtml =  decoder.write(cent);

                    var $ = cheerio.load(rawHtml);
                    lt = $("[name='lt']").attr("value");
                    execution = $("[name='execution']").attr("value");
                    submit = $("[name='submit']").attr("value");
                });

                r.on("end", function(){
                    return post_to_login2(r, path2, lt, execution, submit);
                })
            });
            req.end();
        }

        function post_to_login2(res, path2, lt, execution, submit){

            //var jsid = res.headers["set-cookie"][0].split(';')[0];

            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies("JSESSIONID");
            //path = "cas/login;" +jsid + "?service=https%3A%2F%2Flogin2.usi.ch%2Fidp%2FAuthn%2FRemoteUser";

            var post_data = querystring.stringify({
                'username' : username,
                "password":password,
                "_eventId":"submit",
                "submit":submit,
                "lt":lt,
                "execution":execution
            });

            var options = {
                host: host,
                path: path2,
                method: 'POST',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length,
                    "Connection":"keep-alive",
                    "Cookie" : cookies,
                    "Host":"login2.usi.ch",
                    "Origin":"https://login2.usi.ch",
                    "Referer":"https://login2.usi.ch/cas/login?service=https%3A%2F%2Flogin2.usi.ch%2Fidp%2FAuthn%2FRemoteUser"
                }
            };
            var req = https.request(options, function(r) {

                r.on("data", function(d){

                });
                r.on("end", function(){
                    return connect_to_login2_after_post(r)
                })
            });
            req.write(post_data);
            req.end();
        }

        function connect_to_login2_after_post(res){

            var loc = res.headers.location;

            if (!loc) return cb(false);

            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies("_idp_authn_lc_key");
            var path = loc.split("https://login2.usi.ch")[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };
            var req = https.request(options, function(r) {


                r.on("data", function(d){});
                r.on("end", function(){return connect_to_login2_after_post2(r)})
            });
            req.end();
        }

        function connect_to_login2_after_post2(res){


            var loc = res.headers.location;
            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies("_idp_authn_lc_key");
            var path = loc.split("https://login2.usi.ch")[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };

            var req = https.request(options, function(r) {

                r.on("data", function(d){

                });
                r.on("end", function(){
                   return  connect_to_login2_after_post3(r)
                })
            });
            req.end();
        }

        function connect_to_login2_after_post3(res){

            var loc = res.headers.location;
            var host = "login2.usi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies("_idp_authn_lc_key") + "; " + get_cookies("_idp_session");
            var path = loc.split("https://login2.usi.ch:443")[1];
            var options = {
                host: host,
                path: path,
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'text/html; charset=UTF-8',
                    "Cookie" : cookies,
                    "Host":"login2.usi.ch",
                    "Origin":"https://login2.usi.ch",
                    "Referer":"https://login2.usi.ch/cas/login?service=https%3A%2F%2Flogin2.usi.ch%2Fidp%2FAuthn%2FRemoteUser"
                }
            };

            var req = https.request(options, function(r) {

                var RelayState;
                var SAMLResponse;

                var rawHtml = ""
                r.on("data", function(d){

                    var StringDecoder = require('string_decoder').StringDecoder;
                    var decoder = new StringDecoder('utf8');
                    var cent = new Buffer(d);
                    rawHtml +=  decoder.write(cent);

                });
                r.on("end", function(){

                    var $ = cheerio.load(rawHtml);
                    RelayState = $("[name='RelayState']").attr("value");
                    SAMLResponse = $("[name='SAMLResponse']").attr("value");

                    return connect_to_login2_after_post4(r, RelayState, SAMLResponse);



                })
            });
            req.end();
        }

        function connect_to_login2_after_post4(res,  RelayState, SAMLResponse){
            var host = "www2.icorsi.ch";
            map_cookies(res.headers["set-cookie"]);

            var post_data = querystring.stringify({
                "RelayState":RelayState,
                "SAMLResponse":SAMLResponse
            });

            var options = {
                host: host,
                path: "/Shibboleth.sso/SAML2/POST",
                method: 'POST',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length,
                    "Connection":"keep-alive",
                    "Host":"www2.icorsi.ch",
                    "Origin":"https://login2.usi.ch",
                    "Referer":"https://login2.usi.ch/idp/profile/SAML2/Redirect/SSO"
                }
            };
            var req = https.request(options, function(r) {

                r.on("data", function(d){

                });
                r.on("end", function(){
                    return connect_to_shibolet(r);
                })
            });
            req.write(post_data);
            req.end();
        }

        function connect_to_shibolet(res){
            var host = "www2.icorsi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies("shibsession");
            var options = {
                host: host,
                path: "/auth/shibboleth/",
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };
            var req = https.request(options, function(r) {
                r.on("data", function(d){});
                r.on("end", function(){return get_user_info(r)})
            });
            req.end();
        }

        function get_user_info(res){
            var host = "www2.icorsi.ch";
            map_cookies(res.headers["set-cookie"]);
            var cookies = get_cookies();
            var options = {
                host: host,
                path: "/auth/mobileaai/get_user.php",
                method: 'GET',
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding":"gzip, deflate",
                    "Accept-Language":"en,en-US;q=0.8,it-IT;q=0.6,it;q=0.4",
                    "Cache-Control":"no-cache",
                    "Connection":"keep-alive",
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Cookie" : cookies
                }
            };
            var req = https.request(options, function(r) {
                var rawHtml = ""
                r.on("data", function(d){

                    var StringDecoder = require('string_decoder').StringDecoder;
                    var decoder = new StringDecoder('utf8');
                    var cent = new Buffer(d);
                    rawHtml +=  decoder.write(cent);

                });
                r.on("end", function(){
                    cb(rawHtml);
                })
            });
            req.end();
        }



        function map_cookies(ck_list){
            for (var x in ck_list){
                var ck_merge = ck_list[x].split(';')[0]
                cookie_map[ck_merge.split("=")[0]] = ck_merge.split("=")[1];
            }
        }

        function get_cookies(ck){
            var ck_merge = "";
            if(ck && ck == "shibsession"){
                for (var k in cookie_map){
                    if(k.indexOf('shibsession') == 1 )
                        return k + "="+ cookie_map[k];
                }
            }
            else
            if(ck){
                return ck + "="+ cookie_map[ck];
            }

            else
                for (var key in cookie_map){
                    ck_merge += key + "="+ cookie_map[key] +";";
                }
            return ck_merge;

        }
    }
};


module.exports = moodle;