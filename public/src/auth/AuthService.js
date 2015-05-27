(function(){
    'use strict';

    angular.module('USiBeacon.auth')
        .service('authAPI', ['$http', AuthAPI])
        .service('waitingQueue', ['$rootScope', '$q', 'authStatus', WaitingQueue])
        .factory('authStatus', ['$localStorage', '$rootScope', AuthStatus])
        .factory('loginDialog', ['$mdDialog', '$document', 'authAPI', 'authStatus', LoginDialog])
        .service('authManager', ['authStatus', 'loginDialog', '$localStorage', AuthManager]);

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
                return $http.post(API + '/login', { username: username, password: password });
            }
        };

    }

    /**
     *
     * This service enqueues API requests that require auth if
     * the user is not logged in, and resolves them once the user is
     * authenticated
     * @constructor
     */
    function WaitingQueue($rootScope, $q, authStatus) {

        var queue = [];

        this.apiCall = function(fn, self, params) {
            if(authStatus.loggedIn) {
                return fn.call(self, params);
            } else {
                var deferred = $q.defer();
                queue.push({
                    deferred: deferred,
                    fn: fn,
                    self: self,
                    params: params
                });
                return deferred.promise;
            }
        }

        var resolveApiCall = function(ac) {
            return ac.fn.call(ac.self, ac.params)
                        .then(
                            function(value) { ac.deferred.resolve(value); },
                            function(reason) { ac.deferred.reject(reason); }
                        );
        }

        $rootScope.$on(
            'USiBeacon.loggedInEvent',
            function(userData) {
                queue.forEach(resolveApiCall);
            }
        );

    }

    /**
     * Returns the authentication status of the user in the application
     *
     * @returns {{loggedIn: boolean, checkLoginStatus: Function}}
     * @constructor
     */
    function AuthStatus($localStorage, $rootScope) {

        var auth = {
            loggedIn : false,
            checkLoginStatus : function() {

                var lastToken = $localStorage.get('token');
                var userData = $localStorage.get('userData');

                if(lastToken && userData) {

                    this.loggedIn = true;
                    this.user = userData;
                    $rootScope.$emit('USiBeacon.loggedInEvent', userData);

                } else {
                    this.isLogged = false;
                    delete this.user;
                }
            },
            set: function(res) {

                $localStorage.set('token', res.user.token);
                $localStorage.set('userData', {
                    firstname : res.user.firstname,
                    lastname: res.user.lastname,
                    avatar: res.user.avatar,
                    email: res.user.email,
                    role: res.user.role,
                    id: res.user.id
                });

                //this.loggedIn = true;
                this.checkLoginStatus();
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
                    this.loading = false;

                    this.login = function() {
                        if(!this.username || !this.password) {
                            alert('Insert username and password.');
                            return;
                        };
                        this.loading = true;
                        authAPI.login(this.username, this.password)
                                .then(
                                    function(res) {
                                        console.log(res)
                                        authStatus.set(res.data);
                                        this.loading = false;
                                        return $mdDialog.hide();
                                    }.bind(this),
                                    function(err) {
                                        this.loading = false;
                                        alert('There was an error processing your request. Please try again.')
                                    }.bind(this)
                                );
                    }.bind(this);

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
    function AuthManager(authStatus, loginDialog, $location, $localStorage) {

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
            $localStorage.removeItem('token');
            $localStorage.removeItem('userData');
            authStatus.checkLoginStatus();
        }

    }

})();
