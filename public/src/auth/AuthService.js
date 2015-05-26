(function(){
    'use strict';

    angular.module('USiBeacon.auth')
        .service('authAPI', ['$http', AuthAPI])
        .factory('authStatus', ['$window', '$localStorage', AuthStatus])
        .factory('loginDialog', ['$mdDialog', '$document', 'authAPI', 'authStatus', LoginDialog])
        .service('authManager', ['authStatus', 'loginDialog', '$window', '$localStorage', AuthManager]);

    /**
     * Auth DataService
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function AuthAPI($http){

        var API = "";

        this.login = function(username, password) {
            if(username && password) {
                //this should post and set loggedIn accordingly
                return $http.post(API + '/login', { username: username, password: password });
            }
        };

        //do I need more than username and password here?
        this.signup = function(username, password) {
            //TODO
        };
    }

    /**
     * Returns the authentication status of the user in the application
     *
     * @returns {{loggedIn: boolean, checkLoginStatus: Function}}
     * @constructor
     */
    function AuthStatus($window, $localStorage) {

        var auth = {
            loggedIn : false,
            checkLoginStatus : function() {

                var lastToken = $localStorage.get('token');
                var userData = $localStorage.get('userData');
                //var lastToken = $window.localStorage.getItem('USiBeaconToken');
                //var userData = $window.localStorage.getItem('USiBeaconUserData');

                if(lastToken && userData) {

                    this.loggedIn = true;
                    this.user = userData;

                    //console.log(this.loggedIn);
                    //console.log(this.user);
                } else {
                    this.isLogged = false;
                    delete this.user;
                }
            },
            set: function(res) {
                console.log('Response: ', res);
                this.user = {
                    firstname : res.user.firstname,
                    lastname: res.user.lastname,
                    avatar: res.user.avatar,
                    email: res.user.email,
                    role: res.user.role
                };
                //$window.localStorage['USiBeaconToken'] = res.user.token;
                //$window.localStorage['USiBeaconUserData'] = this.user;

                $localStorage.set('token', res.user.token);
                $localStorage.set('userData', this.user);

                this.loggedIn = true;
            }
        }

        return auth;
    }

    /**
     *
     * A factory for the login dialog
     *
     * @param $mdDialog
     * @constructor
     */
    function LoginDialog($mdDialog, $document, authAPI, authStatus) {

        var getLoginDialog = function(params) {
            return {
                clickOutsideToClose: false,
                escapeToClose: false,
                parent: angular.element($document.body),
                title: 'USiBeacon Login',
                templateUrl: './src/auth/view/loginDialog.html',
                controllerAs: 'vm',
                controller: function() {

                    this.username;
                    this.password;

                    this.login = function() {
                        console.log(this.username, this.password);
                        if(!this.username || !this.password) {
                            alert('Insert username and password.');
                            return;
                        };
                        authAPI.login(this.username, this.password)
                                .then(
                                    function(res) {
                                        authStatus.set(res.data);
                                        return $mdDialog.hide();
                                    },
                                    function(err) {
                                        alert('There was an error processing your request. Please try again.')
                                    }
                                );
                    }.bind(this);


                    this.signup = function() {
                        //TODO: move to signup page
                    }
                }
            }
        }

        function LoginDialog(username, password, route) {
            this.username = username;
            this.password = password;
            this.route = route;
        }

        LoginDialog.prototype.prompt = function() {

            var dialog = getLoginDialog();
            return $mdDialog.show(dialog);

        }

        return LoginDialog;

    }

    /**
     * A service to handle all authentication related functions
     *
     * @constructor
     */
    function AuthManager(authStatus, loginDialog, $window, $location, $localStorage) {

        this.promptLogin = function() {
            new loginDialog().prompt()
                             .finally(
                                function() {
                                    $location.url('/home');
                                });
        };

        this.bootstrapCheck = function() {
            authStatus.checkLoginStatus();
        }.bind(this);

        this.isLoggedIn = function() { return authStatus.loggedIn; };

        this.logout = function() {
            //delete $window.localStorage['USiBeaconToken'];
            //delete $window.localStorage['USiBeaconUserData'];
            $localStorage.removeItem('token');
            $localStorage.removeItem('userData');
            authStatus.checkLoginStatus();
        }

    }

})();
